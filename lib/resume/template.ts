import "server-only";
import { BRAND } from "@/lib/brand";
import type { Database } from "@/lib/database.types";

type Candidate = Database["public"]["Tables"]["candidates"]["Row"];
type Experience = Database["public"]["Tables"]["candidate_experience"]["Row"];
type Education = Database["public"]["Tables"]["candidate_education"]["Row"];

export type ResumeData = {
  candidate: Candidate;
  experience: Experience[];
  education: Education[];
};

/** Escape a value for safe interpolation into HTML text/attributes. */
function esc(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Split a comma/newline separated list into trimmed, non-empty items. */
function toList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Split a free-text description into bullet points. Honors explicit newlines or
 * leading bullet characters; otherwise falls back to sentence-splitting so a
 * paragraph still renders as scannable, ATS-friendly bullets.
 */
function toBullets(value: string | null | undefined): string[] {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed) return [];

  // Explicit line breaks or bullet markers → one bullet per line.
  if (/[\n\r]/.test(trimmed) || /^[•\-*]/m.test(trimmed)) {
    return trimmed
      .split(/[\n\r]+/)
      .map((l) => l.replace(/^[\s•\-*]+/, "").trim())
      .filter(Boolean);
  }

  // Single paragraph → split into sentences (keeps each as its own bullet).
  const sentences = trimmed
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.length > 1 ? sentences : [trimmed];
}

/** Format a YYYY-MM-DD date as "Mon YYYY"; empty string on null. */
function monthYear(date: string | null): string {
  if (!date) return "";
  const d = new Date(date + "T00:00:00");
  if (Number.isNaN(d.getTime())) return esc(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function dateRange(start: string | null, end: string | null, isCurrent: boolean): string {
  const from = monthYear(start);
  const to = isCurrent ? "Present" : monthYear(end);
  if (!from && !to) return "";
  return esc([from, to].filter(Boolean).join(" – "));
}

/** Derive a concise fallback professional summary from the profile fields. */
function fallbackSummary(c: Candidate): string {
  const bits: string[] = [];
  const role = c.current_title || c.target_role;
  const exp = c.total_experience ? `${c.total_experience} of experience` : "";
  if (role && exp) bits.push(`${role} with ${exp}`);
  else if (role) bits.push(role);
  else if (exp) bits.push(`Professional with ${exp}`);

  const skills = toList(c.primary_skills).slice(0, 4);
  if (skills.length) bits.push(`skilled in ${skills.join(", ")}`);
  if (c.preferred_industry) bits.push(`focused on the ${c.preferred_industry} sector`);

  if (bits.length === 0) return "";
  const sentence = bits.join(", ").replace(/^./, (m) => m.toUpperCase());
  return sentence.endsWith(".") ? sentence : sentence + ".";
}

/**
 * Renders a candidate's record into a fully self-contained, A4 print-optimized
 * HTML résumé (inline CSS, no external assets). The layout follows 2026
 * best practice for ATS-parseable, recruiter-ready résumés: a single linear
 * column, standard section headings ("Professional Summary", "Experience",
 * "Education", "Skills"), reverse-chronological experience with achievement
 * bullets, and a clean scannable contact line. Agency branding sits in the
 * footer so a recruiter can present it to a client. All candidate data is
 * HTML-escaped. Missing structured data falls back to the flat profile fields
 * so the résumé is never empty.
 */
export function renderResumeHtml(data: ResumeData): string {
  const c = data.candidate;

  const primarySkills = toList(c.primary_skills);
  const secondarySkills = toList(c.secondary_skills);
  const certifications = toList(c.certifications);

  const roleLine = [c.current_title, c.current_employer].filter(Boolean).join(" · ");

  const contactBits = [
    c.email ? esc(c.email) : "",
    c.phone ? esc(c.phone) : "",
    c.location ? esc(c.location) : "",
    c.linkedin_url ? esc(c.linkedin_url) : "",
  ]
    .filter(Boolean)
    .join('<span class="sep">|</span>');

  const summary = (c.professional_summary && c.professional_summary.trim())
    ? c.professional_summary.trim()
    : fallbackSummary(c);

  // ── Experience ──────────────────────────────────────────────────────────
  const experienceItems: {
    title: string;
    company: string;
    range: string;
    bullets: string[];
  }[] =
    data.experience.length > 0
      ? data.experience.map((e) => ({
          title: e.title || "Role",
          company: e.company || "",
          range: dateRange(e.start_date, e.end_date, e.is_current),
          bullets: toBullets(e.description),
        }))
      : c.current_title || c.current_employer
        ? [
            {
              title: c.current_title || "Current Role",
              company: c.current_employer || "",
              range: c.total_experience ? `${esc(c.total_experience)} total` : "",
              bullets: [],
            },
          ]
        : [];

  const experienceHtml =
    experienceItems.length > 0
      ? experienceItems
          .map(
            (e) => `
        <div class="entry">
          <div class="entry-head">
            <div class="entry-role">${esc(e.title)}</div>
            <div class="entry-dates">${e.range}</div>
          </div>
          ${e.company ? `<div class="entry-org">${esc(e.company)}</div>` : ""}
          ${
            e.bullets.length
              ? `<ul class="bullets">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
              : ""
          }
        </div>`,
          )
          .join("")
      : `<p class="muted">Experience details to be provided.</p>`;

  // ── Education ───────────────────────────────────────────────────────────
  const educationItems =
    data.education.length > 0
      ? data.education.map((ed) => ({
          degree:
            (ed.degree || "Qualification") + (ed.field_of_study ? `, ${ed.field_of_study}` : ""),
          institution: ed.institution || "",
          year: ed.graduation_year || "",
        }))
      : c.highest_degree || c.university
        ? [
            {
              degree:
                (c.highest_degree || "Qualification") +
                (c.field_of_study ? `, ${c.field_of_study}` : ""),
              institution: c.university || "",
              year: c.graduation_year || "",
            },
          ]
        : [];

  const educationHtml =
    educationItems.length > 0
      ? educationItems
          .map(
            (ed) => `
        <div class="entry">
          <div class="entry-head">
            <div class="entry-role">${esc(ed.degree)}</div>
            <div class="entry-dates">${esc(ed.year)}</div>
          </div>
          ${ed.institution ? `<div class="entry-org">${esc(ed.institution)}</div>` : ""}
        </div>`,
          )
          .join("")
      : `<p class="muted">Education details to be provided.</p>`;

  const skillLine = (items: string[]) => items.map((s) => esc(s)).join("  ·  ");

  const generatedOn = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(c.full_name)} — Résumé</title>
<style>
  :root {
    --ink: #1f2937;
    --muted: #6b7280;
    --rule: #d1d5db;
    --accent: #1e3a5f;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: "Calibri", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    color: var(--ink);
    background: #eef1f4;
    line-height: 1.42;
    font-size: 10.8pt;
  }
  .sheet {
    max-width: 8.27in;
    margin: 20px auto;
    background: #fff;
    padding: 0.7in 0.75in 0.55in;
    box-shadow: 0 3px 20px rgba(15, 23, 42, 0.12);
  }

  /* Header */
  header { text-align: center; padding-bottom: 12px; border-bottom: 2px solid var(--accent); }
  .name {
    font-size: 23pt;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--accent);
    text-transform: uppercase;
  }
  .role-line { margin-top: 3px; font-size: 11.5pt; color: var(--ink); font-weight: 600; }
  .contact { margin-top: 7px; font-size: 9.6pt; color: var(--muted); }
  .contact .sep { padding: 0 7px; color: var(--rule); }

  /* Sections */
  section { margin-top: 15px; }
  h2 {
    font-size: 11pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--accent);
    border-bottom: 1px solid var(--rule);
    padding-bottom: 3px;
    margin-bottom: 8px;
  }
  .summary { font-size: 10.6pt; color: #374151; text-align: justify; }

  .entry { margin-bottom: 11px; break-inside: avoid; }
  .entry:last-child { margin-bottom: 0; }
  .entry-head { display: flex; justify-content: space-between; align-items: baseline; gap: 14px; }
  .entry-role { font-weight: 700; font-size: 11pt; color: var(--ink); }
  .entry-dates { font-size: 9.6pt; color: var(--muted); white-space: nowrap; font-style: italic; }
  .entry-org { font-size: 10.4pt; font-weight: 600; color: #374151; margin-top: 1px; }
  .bullets { margin: 5px 0 0 17px; }
  .bullets li { margin-bottom: 2.5px; font-size: 10.3pt; color: #374151; }

  .skills-group { margin-bottom: 6px; }
  .skills-group:last-child { margin-bottom: 0; }
  .skills-label { font-weight: 700; color: var(--ink); font-size: 10.2pt; }
  .skills-line { color: #374151; font-size: 10.2pt; }

  .muted { color: var(--muted); font-style: italic; }

  footer {
    margin-top: 20px;
    padding-top: 9px;
    border-top: 1px solid var(--rule);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8.4pt;
    color: var(--muted);
  }
  footer .brand { font-weight: 700; color: var(--accent); letter-spacing: 0.04em; }

  @media print {
    body { background: #fff; }
    .sheet { box-shadow: none; margin: 0; max-width: none; padding: 0; }
  }
  @page { size: A4; margin: 14mm 15mm; }
</style>
</head>
<body>
  <div class="sheet">
    <header>
      <div class="name">${esc(c.full_name)}</div>
      ${roleLine ? `<div class="role-line">${esc(roleLine)}</div>` : ""}
      ${contactBits ? `<div class="contact">${contactBits}</div>` : ""}
    </header>

    ${
      summary
        ? `<section>
      <h2>Professional Summary</h2>
      <p class="summary">${esc(summary)}</p>
    </section>`
        : ""
    }

    <section>
      <h2>Experience</h2>
      ${experienceHtml}
    </section>

    <section>
      <h2>Education</h2>
      ${educationHtml}
    </section>

    ${
      primarySkills.length || secondarySkills.length
        ? `<section>
      <h2>Skills</h2>
      ${primarySkills.length ? `<div class="skills-group"><span class="skills-label">Core: </span><span class="skills-line">${skillLine(primarySkills)}</span></div>` : ""}
      ${secondarySkills.length ? `<div class="skills-group"><span class="skills-label">Additional: </span><span class="skills-line">${skillLine(secondarySkills)}</span></div>` : ""}
    </section>`
        : ""
    }

    ${
      certifications.length
        ? `<section>
      <h2>Certifications</h2>
      <div class="skills-line">${skillLine(certifications)}</div>
    </section>`
        : ""
    }

    <footer>
      <span>Represented by <span class="brand">${esc(BRAND.name)}</span></span>
      <span>${esc(generatedOn)}</span>
    </footer>
  </div>
</body>
</html>`;
}

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

/**
 * Renders a candidate's structured record into a fully self-contained, A4
 * print-optimized HTML résumé document (inline CSS, no external assets). The
 * result is stored as a `generated_resume` document and can be previewed or
 * printed to PDF from the browser. The layout intentionally omits the candidate's
 * personal contact block's private fields when absent, and carries agency branding
 * so a recruiter can present it to a client.
 */
export function renderResumeHtml(data: ResumeData): string {
  const c = data.candidate;

  const primarySkills = toList(c.primary_skills);
  const secondarySkills = toList(c.secondary_skills);
  const certifications = toList(c.certifications);

  const subtitle = [c.current_title, c.current_employer].filter(Boolean).join(" · ");

  const contactBits = [
    c.email ? `<span>${esc(c.email)}</span>` : "",
    c.phone ? `<span>${esc(c.phone)}</span>` : "",
    c.location ? `<span>${esc(c.location)}</span>` : "",
    c.linkedin_url ? `<span>${esc(c.linkedin_url)}</span>` : "",
  ]
    .filter(Boolean)
    .join('<span class="dot">•</span>');

  // Experience: prefer structured rows; otherwise fall back to the free-text
  // "current role" summary so the résumé is never empty.
  const experienceRows =
    data.experience.length > 0
      ? data.experience
          .map(
            (e) => `
        <div class="item">
          <div class="item-head">
            <div>
              <div class="item-title">${esc(e.title) || "Role"}</div>
              <div class="item-sub">${esc(e.company)}</div>
            </div>
            <div class="item-meta">${dateRange(e.start_date, e.end_date, e.is_current)}</div>
          </div>
          ${e.description ? `<p class="item-desc">${esc(e.description)}</p>` : ""}
        </div>`,
          )
          .join("")
      : c.current_title || c.current_employer
        ? `
        <div class="item">
          <div class="item-head">
            <div>
              <div class="item-title">${esc(c.current_title) || "Current Role"}</div>
              <div class="item-sub">${esc(c.current_employer)}</div>
            </div>
            <div class="item-meta">${esc(c.total_experience) ? esc(c.total_experience) + " total" : ""}</div>
          </div>
        </div>`
        : `<p class="empty">Experience details to be provided.</p>`;

  // Education: structured rows, else the flat candidate fields.
  const educationRows =
    data.education.length > 0
      ? data.education
          .map(
            (ed) => `
        <div class="item">
          <div class="item-head">
            <div>
              <div class="item-title">${esc(ed.degree) || "Qualification"}${
                ed.field_of_study ? `, ${esc(ed.field_of_study)}` : ""
              }</div>
              <div class="item-sub">${esc(ed.institution)}</div>
            </div>
            <div class="item-meta">${esc(ed.graduation_year)}</div>
          </div>
        </div>`,
          )
          .join("")
      : c.highest_degree || c.university
        ? `
        <div class="item">
          <div class="item-head">
            <div>
              <div class="item-title">${esc(c.highest_degree) || "Qualification"}${
                c.field_of_study ? `, ${esc(c.field_of_study)}` : ""
              }</div>
              <div class="item-sub">${esc(c.university)}</div>
            </div>
            <div class="item-meta">${esc(c.graduation_year)}</div>
          </div>
        </div>`
        : `<p class="empty">Education details to be provided.</p>`;

  const chips = (items: string[]) =>
    items.map((s) => `<span class="chip">${esc(s)}</span>`).join("");

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
    --ink: #1a2332;
    --muted: #5b6b82;
    --line: #e2e8f0;
    --brand: #1e3a5f;
    --accent: #c9a227;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    color: var(--ink);
    background: #f1f5f9;
    line-height: 1.5;
    font-size: 13px;
  }
  .sheet {
    max-width: 820px;
    margin: 24px auto;
    background: #fff;
    box-shadow: 0 4px 24px rgba(15, 23, 42, 0.12);
    border-radius: 4px;
    overflow: hidden;
  }
  .band {
    background: var(--brand);
    color: #fff;
    padding: 28px 40px;
    border-bottom: 4px solid var(--accent);
  }
  .name { font-size: 26px; font-weight: 700; letter-spacing: -0.01em; }
  .subtitle { margin-top: 4px; font-size: 14px; color: #cbd5e1; }
  .contact {
    margin-top: 14px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px 4px;
    font-size: 11.5px;
    color: #e2e8f0;
    align-items: center;
  }
  .contact .dot { opacity: 0.5; padding: 0 4px; }
  .body { padding: 28px 40px 36px; }
  .section { margin-bottom: 22px; }
  .section:last-child { margin-bottom: 0; }
  .section-title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--brand);
    padding-bottom: 6px;
    margin-bottom: 12px;
    border-bottom: 2px solid var(--line);
  }
  .item { margin-bottom: 14px; break-inside: avoid; }
  .item:last-child { margin-bottom: 0; }
  .item-head { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; }
  .item-title { font-weight: 600; font-size: 13.5px; }
  .item-sub { color: var(--muted); font-size: 12.5px; }
  .item-meta { color: var(--muted); font-size: 11.5px; white-space: nowrap; }
  .item-desc { margin-top: 4px; font-size: 12.5px; color: #334155; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
  .kv-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
  .kv-value { font-size: 13px; margin-top: 1px; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip {
    background: #eef2f7;
    color: #27364a;
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 3px 10px;
    font-size: 11.5px;
  }
  .subhead { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 10px 0 6px; }
  .empty { color: var(--muted); font-style: italic; font-size: 12.5px; }
  .footer {
    margin-top: 26px;
    padding-top: 14px;
    border-top: 1px solid var(--line);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10.5px;
    color: var(--muted);
  }
  .footer .brand { font-weight: 700; color: var(--brand); letter-spacing: 0.03em; }
  @media print {
    body { background: #fff; font-size: 12px; }
    .sheet { box-shadow: none; margin: 0; max-width: none; border-radius: 0; }
    .band { padding: 24px 32px; }
    .body { padding: 24px 32px; }
  }
  @page { margin: 12mm; }
</style>
</head>
<body>
  <div class="sheet">
    <div class="band">
      <div class="name">${esc(c.full_name)}</div>
      ${subtitle ? `<div class="subtitle">${esc(subtitle)}</div>` : ""}
      ${contactBits ? `<div class="contact">${contactBits}</div>` : ""}
    </div>
    <div class="body">
      ${
        c.total_experience || c.notice_period || c.target_role || c.work_preference
          ? `
      <div class="section">
        <div class="section-title">Profile</div>
        <div class="grid">
          ${c.total_experience ? `<div><div class="kv-label">Total Experience</div><div class="kv-value">${esc(c.total_experience)}</div></div>` : ""}
          ${c.target_role ? `<div><div class="kv-label">Target Role</div><div class="kv-value">${esc(c.target_role)}</div></div>` : ""}
          ${c.preferred_industry ? `<div><div class="kv-label">Preferred Industry</div><div class="kv-value">${esc(c.preferred_industry)}</div></div>` : ""}
          ${c.work_preference ? `<div><div class="kv-label">Work Preference</div><div class="kv-value">${esc(c.work_preference)}</div></div>` : ""}
          ${c.notice_period ? `<div><div class="kv-label">Notice Period</div><div class="kv-value">${esc(c.notice_period)}</div></div>` : ""}
        </div>
      </div>`
          : ""
      }

      <div class="section">
        <div class="section-title">Experience</div>
        ${experienceRows}
      </div>

      <div class="section">
        <div class="section-title">Education</div>
        ${educationRows}
      </div>

      ${
        primarySkills.length || secondarySkills.length
          ? `
      <div class="section">
        <div class="section-title">Skills</div>
        ${primarySkills.length ? `<div class="subhead">Core</div><div class="chips">${chips(primarySkills)}</div>` : ""}
        ${secondarySkills.length ? `<div class="subhead">Additional</div><div class="chips">${chips(secondarySkills)}</div>` : ""}
      </div>`
          : ""
      }

      ${
        certifications.length
          ? `
      <div class="section">
        <div class="section-title">Certifications</div>
        <div class="chips">${chips(certifications)}</div>
      </div>`
          : ""
      }

      <div class="footer">
        <span>Prepared and represented by <span class="brand">${esc(BRAND.name)}</span></span>
        <span>Generated ${esc(generatedOn)}</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

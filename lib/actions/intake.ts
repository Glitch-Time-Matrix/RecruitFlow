"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { uploadDocument } from "@/lib/storage";
import {
  candidateIntakeSchema,
  employerIntakeSchema,
  contactIntakeSchema,
  FILE_RULES,
} from "@/lib/validation/intake";

export type IntakeResult =
  | { success: true; reference: string; message: string }
  | { success: false; error: string };

/** Turn a FormData string field into a plain string. */
function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

/** Extract a real uploaded file (or null) from FormData. */
function file(fd: FormData, key: string): File | null {
  const v = fd.get(key);
  return v instanceof File && v.size > 0 ? v : null;
}

/** Validate an uploaded file against its rules; returns an error string or null. */
function checkFile(
  f: File,
  rules: { maxBytes: number; mimes: readonly string[]; label: string },
): string | null {
  if (f.size > rules.maxBytes) return rules.label;
  if (f.type && !rules.mimes.includes(f.type)) return rules.label;
  return null;
}

/** Short human-facing reference derived from a uuid. */
function ref(prefix: string, id: string): string {
  return `${prefix}-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Candidate registration
// ─────────────────────────────────────────────────────────────────────────────
export async function submitCandidate(fd: FormData): Promise<IntakeResult> {
  // Honeypot: real users never fill this hidden field. Silently succeed on bots.
  if (str(fd, "company_website")) {
    return { success: true, reference: "CAND-RECEIVED", message: "Received." };
  }

  const parsed = candidateIntakeSchema.safeParse({
    fullName: str(fd, "fullName"),
    email: str(fd, "email"),
    phone: str(fd, "phone"),
    location: str(fd, "location"),
    linkedInUrl: str(fd, "linkedInUrl"),
    currentTitle: str(fd, "currentTitle"),
    totalExperience: str(fd, "totalExperience"),
    currentEmployer: str(fd, "currentEmployer"),
    noticePeriod: str(fd, "noticePeriod"),
    highestDegree: str(fd, "highestDegree"),
    fieldOfStudy: str(fd, "fieldOfStudy"),
    university: str(fd, "university"),
    graduationYear: str(fd, "graduationYear"),
    primarySkills: str(fd, "primarySkills"),
    secondarySkills: str(fd, "secondarySkills"),
    certifications: str(fd, "certifications"),
    targetRole: str(fd, "targetRole"),
    preferredIndustry: str(fd, "preferredIndustry"),
    expectedSalary: str(fd, "expectedSalary"),
    workPreference: str(fd, "workPreference"),
    declarationConsent: str(fd, "declarationConsent"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  }
  const d = parsed.data;

  const resume = file(fd, "resume");
  const photo = file(fd, "photo");
  if (resume) {
    const err = checkFile(resume, FILE_RULES.resume);
    if (err) return { success: false, error: err };
  }
  if (photo) {
    const err = checkFile(photo, FILE_RULES.photo);
    if (err) return { success: false, error: err };
  }

  try {
    const admin = createAdminClient();

    const { data: candidate, error: insErr } = await admin
      .from("candidates")
      .insert({
        full_name: d.fullName,
        email: d.email,
        phone: d.phone,
        location: d.location || null,
        linkedin_url: d.linkedInUrl || null,
        current_title: d.currentTitle || null,
        total_experience: d.totalExperience || null,
        current_employer: d.currentEmployer || null,
        notice_period: d.noticePeriod || null,
        highest_degree: d.highestDegree || null,
        field_of_study: d.fieldOfStudy || null,
        university: d.university || null,
        graduation_year: d.graduationYear || null,
        primary_skills: d.primarySkills,
        secondary_skills: d.secondarySkills || null,
        certifications: d.certifications || null,
        target_role: d.targetRole || null,
        preferred_industry: d.preferredIndustry || null,
        expected_salary: d.expectedSalary || null,
        work_preference: d.workPreference || null,
        consent_given: true,
        source: "web",
        status: "new",
      })
      .select("id")
      .single();
    if (insErr) throw new Error(insErr.message);

    const candidateId = candidate.id;

    if (photo) {
      const photoDocId = await uploadDocument({
        f: photo,
        bucket: "candidate-photos",
        kind: "candidate_photo",
        ownerType: "candidate",
        ownerId: candidateId,
      });
      await admin
        .from("candidates")
        .update({ photo_document_id: photoDocId })
        .eq("id", candidateId);
    }

    if (resume) {
      await uploadDocument({
        f: resume,
        bucket: "resumes",
        kind: "resume",
        ownerType: "candidate",
        ownerId: candidateId,
      });
    }

    // If the candidate applied from a specific job listing, create the linked
    // application (candidate -> job -> employer) automatically.
    const jobId = str(fd, "jobId");
    if (jobId && /^[0-9a-f-]{36}$/i.test(jobId)) {
      const { data: job } = await admin
        .from("jobs")
        .select("id, employer_id")
        .eq("id", jobId)
        .eq("is_published", true)
        .maybeSingle();
      if (job) {
        await admin.from("applications").insert({
          candidate_id: candidateId,
          job_id: job.id,
          employer_id: job.employer_id,
          stage: "applied",
          source: "web",
        });
      }
    }

    return {
      success: true,
      reference: ref("CAND", candidateId),
      message: "Your profile has been registered securely in our talent database.",
    };
  } catch (e) {
    console.error("submitCandidate failed:", e);
    return { success: false, error: "We could not process your submission. Please try again." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Employer hiring request
// ─────────────────────────────────────────────────────────────────────────────
export async function submitEmployer(fd: FormData): Promise<IntakeResult> {
  if (str(fd, "company_website_confirm")) {
    return { success: true, reference: "HIRE-RECEIVED", message: "Received." };
  }

  const parsed = employerIntakeSchema.safeParse({
    companyName: str(fd, "companyName"),
    industry: str(fd, "industry"),
    companyScale: str(fd, "companyScale"),
    websiteUrl: str(fd, "websiteUrl"),
    contactName: str(fd, "contactName"),
    designation: str(fd, "designation"),
    email: str(fd, "email"),
    phone: str(fd, "phone"),
    jobTitle: str(fd, "jobTitle"),
    department: str(fd, "department"),
    openingsCount: str(fd, "openingsCount"),
    employmentType: str(fd, "employmentType"),
    requiredSkills: str(fd, "requiredSkills"),
    requiredExperience: str(fd, "requiredExperience"),
    workLocation: str(fd, "workLocation"),
    salaryRange: str(fd, "salaryRange"),
    jobDescriptionText: str(fd, "jobDescriptionText"),
    urgencyTimeline: str(fd, "urgencyTimeline"),
    additionalNotes: str(fd, "additionalNotes"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  }
  const d = parsed.data;

  const jd = file(fd, "jd");
  if (jd) {
    const err = checkFile(jd, FILE_RULES.jd);
    if (err) return { success: false, error: err };
  }

  try {
    const admin = createAdminClient();

    // 1. Employer (company)
    const { data: employer, error: empErr } = await admin
      .from("employers")
      .insert({
        company_name: d.companyName,
        industry: d.industry || null,
        company_scale: d.companyScale || null,
        website_url: d.websiteUrl || null,
        source: "web",
        status: "prospect",
      })
      .select("id")
      .single();
    if (empErr) throw new Error(empErr.message);
    const employerId = employer.id;

    // 2. Contact person (sensitive — separate table)
    await admin.from("employer_contacts").insert({
      employer_id: employerId,
      contact_name: d.contactName,
      designation: d.designation || null,
      email: d.email,
      phone: d.phone || null,
      is_primary: true,
    });

    // 3. Hiring request
    const { data: request, error: reqErr } = await admin
      .from("hiring_requests")
      .insert({
        employer_id: employerId,
        job_title: d.jobTitle,
        department: d.department || null,
        openings_count: d.openingsCount || null,
        employment_type: d.employmentType || null,
        required_skills: d.requiredSkills || null,
        required_experience: d.requiredExperience || null,
        work_location: d.workLocation || null,
        salary_range: d.salaryRange || null,
        job_description_text: d.jobDescriptionText || null,
        urgency_timeline: d.urgencyTimeline || null,
        additional_notes: d.additionalNotes || null,
        source: "web",
        status: "new",
      })
      .select("id")
      .single();
    if (reqErr) throw new Error(reqErr.message);
    const requestId = request.id;

    // 4. Optional JD document
    if (jd) {
      const jdDocId = await uploadDocument({
        f: jd,
        bucket: "job-descriptions",
        kind: "job_description",
        ownerType: "employer",
        ownerId: employerId,
      });
      await admin
        .from("hiring_requests")
        .update({ jd_document_id: jdDocId })
        .eq("id", requestId);
    }

    return {
      success: true,
      reference: ref("HIRE", requestId),
      message: "Your hiring request has been received. A recruitment specialist will be assigned.",
    };
  } catch (e) {
    console.error("submitEmployer failed:", e);
    return { success: false, error: "We could not process your request. Please try again." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// General contact inquiry
// ─────────────────────────────────────────────────────────────────────────────
export async function submitContact(fd: FormData): Promise<IntakeResult> {
  if (str(fd, "company_website")) {
    return { success: true, reference: "MSG-RECEIVED", message: "Received." };
  }

  const parsed = contactIntakeSchema.safeParse({
    fullName: str(fd, "fullName"),
    email: str(fd, "email"),
    phone: str(fd, "phone"),
    inquiryType: str(fd, "inquiryType"),
    subject: str(fd, "subject"),
    message: str(fd, "message"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  }
  const d = parsed.data;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("contact_messages")
      .insert({
        full_name: d.fullName,
        email: d.email,
        phone: d.phone || null,
        inquiry_type: d.inquiryType || null,
        subject: d.subject || null,
        message: d.message,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    return {
      success: true,
      reference: ref("MSG", data.id),
      message: "Thank you for reaching out. Our team will respond within 24 hours.",
    };
  } catch (e) {
    console.error("submitContact failed:", e);
    return { success: false, error: "We could not send your message. Please try again." };
  }
}

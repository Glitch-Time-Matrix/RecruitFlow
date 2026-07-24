import { z } from "zod";

/**
 * Validation schemas for the public intake forms. These run on the SERVER
 * (inside the server actions) so submissions can never bypass validation, and
 * they also type the parsed data used to build database rows.
 */

const optionalText = z.string().trim().max(2000).optional().or(z.literal(""));

export const candidateIntakeSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(200),
  email: z.string().trim().email("A valid email is required").max(320),
  phone: z.string().trim().min(3, "Phone number is required").max(50),
  location: optionalText,
  linkedInUrl: z.string().trim().max(500).optional().or(z.literal("")),
  currentTitle: optionalText,
  totalExperience: optionalText,
  currentEmployer: optionalText,
  noticePeriod: optionalText,
  highestDegree: optionalText,
  fieldOfStudy: optionalText,
  university: optionalText,
  graduationYear: optionalText,
  primarySkills: z.string().trim().min(1, "Primary skills are required").max(1000),
  secondarySkills: optionalText,
  certifications: optionalText,
  targetRole: optionalText,
  preferredIndustry: optionalText,
  expectedSalary: optionalText,
  workPreference: optionalText,
  declarationConsent: z
    .union([z.literal("true"), z.literal("on"), z.literal(true)])
    .refine((v) => v === "true" || v === "on" || v === true, {
      message: "Consent is required",
    }),
});

/**
 * Dashboard candidate schema — used when a recruiter adds/edits a candidate
 * manually (e.g. an office walk-in). Same fields as the public intake, but the
 * declaration-consent checkbox is not required (the recruiter records consent
 * out-of-band). Everything else mirrors `candidateIntakeSchema`.
 */
export const candidateManageSchema = candidateIntakeSchema
  .omit({ declarationConsent: true })
  .extend({
    professionalSummary: z.string().trim().max(4000).optional().or(z.literal("")),
    status: z
      .enum([
        "new",
        "screening",
        "shortlisted",
        "submitted",
        "interviewing",
        "offered",
        "placed",
        "rejected",
        "on_hold",
      ])
      .default("new"),
  });

/** One structured work-experience entry (for the résumé + profile). */
export const experienceEntrySchema = z.object({
  title: z.string().trim().max(200).optional().or(z.literal("")),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  startDate: z.string().trim().max(20).optional().or(z.literal("")),
  endDate: z.string().trim().max(20).optional().or(z.literal("")),
  isCurrent: z.boolean().optional().default(false),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
});

/** One structured education entry. */
export const educationEntrySchema = z.object({
  degree: z.string().trim().max(200).optional().or(z.literal("")),
  fieldOfStudy: z.string().trim().max(200).optional().or(z.literal("")),
  institution: z.string().trim().max(200).optional().or(z.literal("")),
  graduationYear: z.string().trim().max(20).optional().or(z.literal("")),
});

export type CandidateManage = z.infer<typeof candidateManageSchema>;
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;

export const employerIntakeSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required").max(200),
  industry: optionalText,
  companyScale: optionalText,
  websiteUrl: z.string().trim().max(500).optional().or(z.literal("")),
  contactName: z.string().trim().min(1, "Contact person is required").max(200),
  designation: optionalText,
  email: z.string().trim().email("A valid email is required").max(320),
  phone: optionalText,
  jobTitle: z.string().trim().min(1, "Job title is required").max(200),
  department: optionalText,
  openingsCount: optionalText,
  employmentType: optionalText,
  requiredSkills: optionalText,
  requiredExperience: optionalText,
  workLocation: optionalText,
  salaryRange: optionalText,
  jobDescriptionText: z.string().trim().max(10000).optional().or(z.literal("")),
  urgencyTimeline: optionalText,
  additionalNotes: optionalText,
});

/**
 * Dashboard employer schema — recruiter adds/edits a company + its primary
 * contact. The hiring-request fields from the public form are optional here
 * (a manually-added employer may not have an open role yet).
 */
export const employerManageSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required").max(200),
  industry: optionalText,
  companyScale: optionalText,
  websiteUrl: z.string().trim().max(500).optional().or(z.literal("")),
  status: z.enum(["prospect", "active", "inactive"]).default("prospect"),
  contactName: optionalText,
  designation: optionalText,
  contactEmail: z.string().trim().max(320).optional().or(z.literal("")),
  contactPhone: optionalText,
});

export type EmployerManage = z.infer<typeof employerManageSchema>;

export const contactIntakeSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(200),
  email: z.string().trim().email("A valid email is required").max(320),
  phone: optionalText,
  inquiryType: optionalText,
  subject: optionalText,
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export type CandidateIntake = z.infer<typeof candidateIntakeSchema>;
export type EmployerIntake = z.infer<typeof employerIntakeSchema>;
export type ContactIntake = z.infer<typeof contactIntakeSchema>;

/** Upload constraints, enforced server-side. */
export const FILE_RULES = {
  resume: {
    maxBytes: 10 * 1024 * 1024, // 10 MB
    mimes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    label: "Resume must be a PDF or Word document under 10MB.",
  },
  jd: {
    maxBytes: 10 * 1024 * 1024,
    mimes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    label: "Job description must be a PDF or Word document under 10MB.",
  },
  photo: {
    maxBytes: 5 * 1024 * 1024, // 5 MB
    mimes: ["image/jpeg", "image/png", "image/webp"],
    label: "Photo must be a JPG, PNG, or WebP image under 5MB.",
  },
} as const;

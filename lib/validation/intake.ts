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

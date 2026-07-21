export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
}

export interface CandidateMatch {
  jobId: string;
  matchScore: number;
  whyYouMatch: string;
  interviewTips: string[];
}

export interface EmployerSpec {
  idealTitle: string;
  requiredSkills: string[];
  estimatedBaseSalary: string;
  screeningQuestions: string[];
  sourcingStrategy: string;
  marketInsights: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
  category?: "Employer" | "Candidate" | "HR Partner";
}

export interface ClientLogo {
  name: string;
  symbol: string;
}

export interface CandidateRegistration {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedInUrl?: string;
  currentTitle: string;
  totalExperience: string;
  currentEmployer: string;
  noticePeriod: string;
  highestDegree: string;
  fieldOfStudy: string;
  university: string;
  graduationYear: string;
  primarySkills: string;
  secondarySkills?: string;
  certifications?: string;
  targetRole: string;
  preferredIndustry: string;
  expectedSalary: string;
  workPreference: string;
  resumeFileName?: string;
  declarationConsent: boolean;
}

export interface EmployerHiringRequest {
  companyName: string;
  industry: string;
  companyScale: string;
  websiteUrl?: string;
  contactName: string;
  designation: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  openingsCount: string;
  employmentType: string;
  requiredSkills: string;
  requiredExperience: string;
  workLocation: string;
  salaryRange: string;
  jobDescriptionText: string;
  jdFileName?: string;
  urgencyTimeline: string;
  additionalNotes?: string;
}

export interface ContactInquiry {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  subject: string;
  message: string;
}

export interface IndustryInfo {
  id: string;
  name: string;
  iconName: string;
  description: string;
  typicalRoles: string[];
  stats: string;
  sourcingHighlight: string;
}

export interface ServiceInfo {
  id: string;
  title: string;
  tagline: string;
  description: string;
  keyBenefits: string[];
  idealFor: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  metric?: string;
}

export interface LeadershipMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedIn?: string;
}

export type PageView = "home" | "about" | "services" | "industries" | "jobs" | "candidates" | "employers" | "contact";


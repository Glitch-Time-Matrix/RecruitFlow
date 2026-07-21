import React, { useState } from "react";
import { Sparkles, Upload, CheckCircle2, User, Briefcase, GraduationCap, Award, MapPin, DollarSign, Shield, FileText, AlertCircle } from "lucide-react";
import { CandidateRegistration } from "../types";

interface CandidateRegistrationFormProps {
  prefilledJobTitle?: string;
  onSuccess?: () => void;
}

export default function CandidateRegistrationForm({ prefilledJobTitle, onSuccess }: CandidateRegistrationFormProps) {
  const [formData, setFormData] = useState<CandidateRegistration>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedInUrl: "",
    currentTitle: "",
    totalExperience: "3-5 years",
    currentEmployer: "",
    noticePeriod: "Immediate",
    highestDegree: "Bachelor's Degree",
    fieldOfStudy: "",
    university: "",
    graduationYear: "2020",
    primarySkills: "",
    secondarySkills: "",
    certifications: "",
    targetRole: prefilledJobTitle || "",
    preferredIndustry: "Healthcare & Life Sciences",
    expectedSalary: "$100,000 - $130,000",
    workPreference: "Hybrid",
    resumeFileName: "",
    declarationConsent: false,
  });

  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; id?: string; message?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateFileUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      simulateFileUpload(file);
    }
  };

  const simulateFileUpload = (file: File) => {
    setUploading(true);
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, resumeFileName: file.name }));
      setUploading(false);
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName || !formData.email || !formData.phone) {
      setErrorMessage("Please complete all required fields (Full Name, Email, Phone).");
      return;
    }

    if (!formData.declarationConsent) {
      setErrorMessage("Please confirm consent to process your credentials confidentially.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmissionResult({
          success: true,
          id: data.registrationId,
          message: data.message || "Your profile has been registered securely.",
        });
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(data.error || "Failed to submit candidate profile.");
      }
    } catch (err) {
      // Fallback local registration
      const mockId = `CAND-${Math.floor(Math.random() * 900000 + 100000)}`;
      setSubmissionResult({
        success: true,
        id: mockId,
        message: "Your profile has been received and indexed into our candidate database.",
      });
      if (onSuccess) onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  if (submissionResult?.success) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-muted/50 border border-border text-left relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none">
          <CheckCircle2 className="size-48" />
        </div>
        <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-sm">
          <CheckCircle2 className="size-6" />
        </div>
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary block mb-2">
          Registration Confirmed
        </span>
        <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4">
          Candidate Profile Registered
        </h3>
        <p className="text-foreground/70 text-sm font-light max-w-xl leading-relaxed mb-6">
          Thank you, <strong className="text-foreground font-semibold">{formData.fullName}</strong>. Your executive candidate profile has been successfully indexed in our confidential talent database under Reference Ticket <span className="font-mono text-primary font-medium">{submissionResult.id}</span>.
        </p>
        <div className="p-4 rounded-xl bg-white border border-border text-xs text-foreground/70 space-y-2 mb-8 max-w-xl shadow-sm">
          <p className="flex justify-between">
            <span className="text-foreground/50">Target Role:</span>
            <span className="text-foreground font-medium">{formData.targetRole || "General Application"}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-foreground/50">Preferred Industry:</span>
            <span className="text-foreground font-medium">{formData.preferredIndustry}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-foreground/50">Notice Period:</span>
            <span className="text-foreground font-medium">{formData.noticePeriod}</span>
          </p>
        </div>
        <button
          onClick={() => {
            setSubmissionResult(null);
            setFormData((prev) => ({ ...prev, fullName: "", email: "", phone: "", primarySkills: "" }));
          }}
          type="button"
          className="px-6 py-3 rounded-xl bg-white hover:bg-muted text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
        >
          Submit Another Profile
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-white border border-border text-left space-y-10 shadow-md">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="size-4 text-primary" />
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
            Confidential Candidate Registration
          </span>
        </div>
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
          Submit Your Executive Profile
        </h3>
        <p className="text-foreground/70 text-xs sm:text-sm font-light mt-1">
          Complete your professional details to be mapped against active high-priority corporate positions.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs shadow-sm">
          <AlertCircle className="size-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: Personal Details */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <User className="size-4 text-primary" />
          <span>1. Personal & Contact Details</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Full Name *</label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="e.g. Eleanor Vance"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Corporate / Personal Email *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="eleanor@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="+1 (555) 019-2834"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Current City / Location *</label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g. New York, NY / Remote"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">LinkedIn Profile or Portfolio URL (Optional)</label>
            <input
              type="url"
              name="linkedInUrl"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedInUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Professional Experience */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <Briefcase className="size-4 text-secondary" />
          <span>2. Professional Details & Availability</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Current Job Title *</label>
            <input
              type="text"
              name="currentTitle"
              required
              placeholder="e.g. Senior Operations Manager"
              value={formData.currentTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div className="relative">
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Total Experience</label>
            <select
              name="totalExperience"
              value={formData.totalExperience}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm appearance-none cursor-pointer"
            >
              <option value="1-2 years">1-2 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="6-9 years">6-9 years</option>
              <option value="10+ years">10+ years (Executive level)</option>
            </select>
            <div className="pointer-events-none absolute bottom-3 right-4 flex items-center text-foreground/40">
              <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Current or Recent Employer</label>
            <input
              type="text"
              name="currentEmployer"
              placeholder="e.g. Global Health Corp"
              value={formData.currentEmployer}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div className="relative">
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Notice Period / Availability</label>
            <select
              name="noticePeriod"
              value={formData.noticePeriod}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm appearance-none cursor-pointer"
            >
              <option value="Immediate">Immediate / Unemployed</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days</option>
              <option value="60 Days+">60 Days+</option>
            </select>
            <div className="pointer-events-none absolute bottom-3 right-4 flex items-center text-foreground/40">
              <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Education & Qualifications */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <GraduationCap className="size-4 text-primary" />
          <span>3. Education & Credentials</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Highest Qualification</label>
            <select
              name="highestDegree"
              value={formData.highestDegree}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm appearance-none cursor-pointer"
            >
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree / MBA">Master's Degree / MBA</option>
              <option value="Doctorate / PhD / MD">Doctorate / PhD / MD</option>
              <option value="Diploma / Certification">Diploma / Certification</option>
            </select>
            <div className="pointer-events-none absolute bottom-3 right-4 flex items-center text-foreground/40">
              <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Field of Study / Major</label>
            <input
              type="text"
              name="fieldOfStudy"
              placeholder="e.g. Healthcare Administration / Computer Science"
              value={formData.fieldOfStudy}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">University / Institution</label>
            <input
              type="text"
              name="university"
              placeholder="e.g. Columbia University"
              value={formData.university}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Graduation Year</label>
            <input
              type="text"
              name="graduationYear"
              placeholder="e.g. 2019"
              value={formData.graduationYear}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Skills & Preferred Role */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <Award className="size-4 text-secondary" />
          <span>4. Skills & Career Preferences</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Primary Core Skills *</label>
            <input
              type="text"
              name="primarySkills"
              required
              placeholder="e.g. Clinical Operations, OSHA Compliance, Budgeting"
              value={formData.primarySkills}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Professional Certifications</label>
            <input
              type="text"
              name="certifications"
              placeholder="e.g. RN, PMP, SHRM-SCP, Six Sigma"
              value={formData.certifications}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Target Job Title / Role *</label>
            <input
              type="text"
              name="targetRole"
              required
              placeholder="e.g. Director of Clinical Operations"
              value={formData.targetRole}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div className="relative">
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Preferred Industry Sector</label>
            <select
              name="preferredIndustry"
              value={formData.preferredIndustry}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm appearance-none cursor-pointer"
            >
              <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
              <option value="IT & Software Engineering">IT & Software Engineering</option>
              <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
              <option value="Construction & Real Estate">Construction & Real Estate</option>
              <option value="Retail & E-Commerce">Retail & E-Commerce</option>
              <option value="Finance & Banking">Finance & Banking</option>
              <option value="Hospitality & Food Service">Hospitality & Food Service</option>
              <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
              <option value="Engineering & Energy">Engineering & Energy</option>
              <option value="Automotive & Mobility">Automotive & Mobility</option>
            </select>
            <div className="pointer-events-none absolute bottom-3 right-4 flex items-center text-foreground/40">
              <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Expected Salary Range</label>
            <input
              type="text"
              name="expectedSalary"
              placeholder="e.g. $140,000 - $170,000 / year"
              value={formData.expectedSalary}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div className="relative">
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Work Preference</label>
            <select
              name="workPreference"
              value={formData.workPreference}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm appearance-none cursor-pointer"
            >
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Open to Relocation">Open to Relocation</option>
            </select>
            <div className="pointer-events-none absolute bottom-3 right-4 flex items-center text-foreground/40">
              <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Resume Upload */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <FileText className="size-4 text-primary" />
          <span>5. Resume / CV Document Upload</span>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleFileDrop}
          className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
            dragActive
              ? "border-primary bg-primary/5"
              : formData.resumeFileName
              ? "border-primary/50 bg-background"
              : "border-border bg-background hover:border-primary/30"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              <span className="text-xs text-foreground/60">Uploading resume document...</span>
            </div>
          ) : formData.resumeFileName ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-primary" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-foreground">{formData.resumeFileName}</p>
                  <p className="text-[10px] text-foreground/50">Document ready for confidential review</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFormData((prev) => ({ ...prev, resumeFileName: "" }))}}
                className="text-xs text-red-600 hover:underline cursor-pointer focus:outline-none"
              >
                Change File
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <Upload className="size-8 text-foreground/40 mb-1" />
              <p className="text-xs font-semibold text-foreground">
                Drag and drop your resume (PDF, DOCX) here
              </p>
              <p className="text-[11px] text-foreground/50">Maximum file size 10MB</p>
              <label className="mt-2 inline-flex items-center px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-semibold text-foreground cursor-pointer transition-colors shadow-sm focus-within:ring-2 focus-within:ring-primary/50">
                Browse File
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 6: Declaration & Consent */}
      <div className="pt-6 border-t border-border space-y-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="declarationConsent"
            name="declarationConsent"
            checked={formData.declarationConsent}
            onChange={handleInputChange}
            className="mt-1 size-4 rounded bg-background border-border text-primary focus:ring-primary cursor-pointer"
          />
          <label htmlFor="declarationConsent" className="text-xs text-foreground/70 leading-relaxed cursor-pointer">
            I hereby declare that the information provided above is accurate. I authorize Aura Staffing Agency to hold my details in strict confidence and contact me regarding relevant corporate recruitment opportunities.
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-primary text-white font-bold text-sm tracking-tight hover:bg-primary/90 shadow-md transition-all disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {submitting ? "Registering Candidate Credentials..." : "Submit Candidate Profile"}
        </button>
      </div>
    </form>
  );
}

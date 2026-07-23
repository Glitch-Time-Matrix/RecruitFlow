"use client";
import React, { useState } from "react";
import { Building2, Upload, CheckCircle2, User, FileText, DollarSign, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { EmployerHiringRequest } from "@/lib/types";
import { submitEmployer } from "@/lib/actions/intake";

interface EmployerHiringRequestFormProps {
  onSuccess?: () => void;
}

export default function EmployerHiringRequestForm({ onSuccess }: EmployerHiringRequestFormProps) {
  const [formData, setFormData] = useState<EmployerHiringRequest>({
    companyName: "",
    industry: "IT & Software Engineering",
    companyScale: "51-200 employees",
    websiteUrl: "",
    contactName: "",
    designation: "",
    email: "",
    phone: "",
    jobTitle: "",
    department: "Engineering",
    openingsCount: "1",
    employmentType: "Permanent Recruitment",
    requiredSkills: "",
    requiredExperience: "5+ years",
    workLocation: "Hybrid",
    salaryRange: "$150,000 - $180,000 / year",
    jobDescriptionText: "",
    jdFileName: "",
    urgencyTimeline: "Immediate (Within 14 Days)",
    additionalNotes: "",
  });

  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; id?: string; message?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setJdFile(file);
    setFormData((prev) => ({ ...prev, jdFileName: file.name }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.companyName || !formData.contactName || !formData.email || !formData.jobTitle) {
      setErrorMessage("Please complete all required fields (Company Name, Contact Person, Corporate Email, Job Title).");
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      const { jdFileName, ...fields } = formData;
      void jdFileName;
      Object.entries(fields).forEach(([k, v]) => fd.append(k, String(v ?? "")));
      if (jdFile) fd.append("jd", jdFile);
      fd.append("company_website_confirm", honeypot);

      const result = await submitEmployer(fd);

      if (result.success) {
        setSubmissionResult({ success: true, id: result.reference, message: result.message });
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(result.error);
      }
    } catch (err) {
      setErrorMessage("Something went wrong submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submissionResult?.success) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-muted/50 border border-border text-left relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none">
          <Building2 className="size-48" />
        </div>
        <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-sm">
          <CheckCircle2 className="size-6" />
        </div>
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary block mb-2">
          Hiring Request Received
        </span>
        <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4">
          Client Recruitment Requirement Logged
        </h3>
        <p className="text-foreground/70 text-sm font-light max-w-xl leading-relaxed mb-6">
          Thank you, <strong className="text-foreground font-semibold">{formData.contactName}</strong> from <strong className="text-foreground font-semibold">{formData.companyName}</strong>. Your recruitment request for <span className="text-primary font-medium">{formData.jobTitle}</span> has been assigned Reference ID <span className="font-mono text-primary">{submissionResult.id}</span>.
        </p>
        <div className="p-4 rounded-xl bg-white border border-border text-xs text-foreground/70 space-y-2 mb-8 max-w-xl shadow-sm">
          <p className="flex justify-between">
            <span className="text-foreground/50">Service Type:</span>
            <span className="text-foreground font-medium">{formData.employmentType}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-foreground/50">Number of Openings:</span>
            <span className="text-foreground font-medium">{formData.openingsCount}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-foreground/50">Target Timeline:</span>
            <span className="text-foreground font-medium">{formData.urgencyTimeline}</span>
          </p>
        </div>
        <button
          onClick={() => {
            setSubmissionResult(null);
            setFormData((prev) => ({ ...prev, jobTitle: "", requiredSkills: "", jobDescriptionText: "" }));
          }}
          type="button"
          className="px-6 py-3 rounded-xl bg-white hover:bg-muted text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
        >
          Submit Additional Hiring Requirement
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-white border border-border text-left space-y-10 shadow-md">
      {/* Honeypot: hidden from real users; bots that fill it are silently dropped */}
      <div className="hidden" aria-hidden="true">
        <label>
          Do not fill this field
          <input
            type="text"
            name="company_website_confirm"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="size-4 text-primary" />
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
            Employer Talent Acquisition Request
          </span>
        </div>
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
          Submit Corporate Hiring Requirements
        </h3>
        <p className="text-foreground/70 text-xs sm:text-sm font-light mt-1">
          Provide position specifications to engage our specialized headhunting team and initiate candidate mapping.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs shadow-sm">
          <AlertCircle className="size-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: Company Details */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <Building2 className="size-4 text-primary" />
          <span>1. Company Information</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Company Name *</label>
            <input
              type="text"
              name="companyName"
              required
              placeholder="e.g. Apex Industrial Systems"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div className="relative">
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Industry Sector</label>
            <select
              name="industry"
              value={formData.industry}
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

          <div className="relative">
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Company Size / Employee Count</label>
            <select
              name="companyScale"
              value={formData.companyScale}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm appearance-none cursor-pointer"
            >
              <option value="1-10 employees">1-10 employees</option>
              <option value="11-50 employees">11-50 employees</option>
              <option value="51-200 employees">51-200 employees</option>
              <option value="201-1000 employees">201-1000 employees</option>
              <option value="1000+ Enterprise">1000+ Enterprise</option>
            </select>
            <div className="pointer-events-none absolute bottom-3 right-4 flex items-center text-foreground/40">
              <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Company Website (Optional)</label>
            <input
              type="url"
              name="websiteUrl"
              placeholder="https://company.com"
              value={formData.websiteUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Contact Person */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <User className="size-4 text-primary" />
          <span>2. Contact Person Details</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Contact Person Name *</label>
            <input
              type="text"
              name="contactName"
              required
              placeholder="e.g. Marcus Thorne"
              value={formData.contactName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Designation / Role</label>
            <input
              type="text"
              name="designation"
              placeholder="e.g. VP of Human Resources / Talent Acquisition Director"
              value={formData.designation}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Corporate Email Address *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="marcus@company.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Direct Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="+1 (555) 234-5678"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Position Details */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <FileText className="size-4 text-primary" />
          <span>3. Position Specifications & Requirements</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Target Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              required
              placeholder="e.g. Senior Plant Operations Manager"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div className="relative">
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Recruitment Service Required</label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm appearance-none cursor-pointer"
            >
              <option value="Permanent Recruitment">Permanent Recruitment</option>
              <option value="Contract Staffing">Contract Staffing</option>
              <option value="Executive Search">Executive Search</option>
              <option value="Bulk & Volume Hiring">Bulk & Volume Hiring</option>
              <option value="Campus & Graduate Hiring">Campus & Graduate Hiring</option>
              <option value="RPO Solutions">RPO Solutions</option>
            </select>
            <div className="pointer-events-none absolute bottom-3 right-4 flex items-center text-foreground/40">
              <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Number of Openings</label>
            <input
              type="text"
              name="openingsCount"
              placeholder="e.g. 1 position / 10 bulk roles"
              value={formData.openingsCount}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div className="relative">
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Required Experience Level</label>
            <select
              name="requiredExperience"
              value={formData.requiredExperience}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm appearance-none cursor-pointer"
            >
              <option value="1-3 years">1-3 years (Junior)</option>
              <option value="3-5 years">3-5 years (Mid-Level)</option>
              <option value="5-8 years">5-8 years (Senior)</option>
              <option value="8-12+ years">8-12+ years (Lead / Executive)</option>
            </select>
            <div className="pointer-events-none absolute bottom-3 right-4 flex items-center text-foreground/40">
              <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>

          <div className="relative">
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Work Arrangement / Location</label>
            <select
              name="workLocation"
              value={formData.workLocation}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm appearance-none cursor-pointer"
            >
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
            </select>
            <div className="pointer-events-none absolute bottom-3 right-4 flex items-center text-foreground/40">
              <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>

          <div>
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Budgeted Salary / Compensation Range</label>
            <input
              type="text"
              name="salaryRange"
              placeholder="e.g. $140,000 - $180,000"
              value={formData.salaryRange}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Key Technical & Behavioral Skills Required</label>
            <input
              type="text"
              name="requiredSkills"
              placeholder="e.g. Lean Manufacturing, OSHA 30, Team Leadership, ERP Systems"
              value={formData.requiredSkills}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Job Description Summary / Role Responsibilities</label>
            <textarea
              name="jobDescriptionText"
              rows={4}
              placeholder="Paste job details or overview of key responsibilities, team size, and goals..."
              value={formData.jobDescriptionText}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Upload JD File */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <Upload className="size-4 text-primary" />
          <span>4. Upload Job Description Document (Optional)</span>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleFileDrop}
          className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
            dragActive
              ? "border-primary bg-primary/5"
              : formData.jdFileName
              ? "border-primary/50 bg-background"
              : "border-border bg-background hover:border-primary/30"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              <span className="text-xs text-foreground/60">Uploading job description...</span>
            </div>
          ) : formData.jdFileName ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-primary" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-foreground">{formData.jdFileName}</p>
                  <p className="text-[10px] text-foreground/50">Document attached to hiring ticket</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setJdFile(null); setFormData((prev) => ({ ...prev, jdFileName: "" }))}}
                className="text-xs text-red-600 hover:underline cursor-pointer focus:outline-none"
              >
                Remove File
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <Upload className="size-8 text-foreground/40 mb-1" />
              <p className="text-xs font-semibold text-foreground">
                Drag and drop your official Job Description (PDF, DOCX)
              </p>
              <label className="mt-2 inline-flex items-center px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-semibold text-foreground cursor-pointer transition-colors shadow-sm focus-within:ring-2 focus-within:ring-primary/50">
                Browse Document
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

      {/* SECTION 5: Urgency & Submission */}
      <div className="pt-6 border-t border-border space-y-4">
        <div className="relative">
          <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Target Fulfillment Timeline</label>
          <select
            name="urgencyTimeline"
            value={formData.urgencyTimeline}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm appearance-none cursor-pointer"
          >
            <option value="Immediate (Within 14 Days)">Immediate (Shortlist within 48-72 hours)</option>
            <option value="Standard Search (30 Days)">Standard Search (Fulfillment within 30 days)</option>
            <option value="Pipeline Building (Future Project)">Future Pipeline / Confidential Replacement</option>
          </select>
          <div className="pointer-events-none absolute bottom-3 right-4 flex items-center text-foreground/40">
            <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-primary text-white font-bold text-sm tracking-tight hover:bg-primary/90 shadow-md transition-all disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {submitting ? "Logging Hiring Request..." : "Submit Employer Hiring Request"}
        </button>
      </div>
    </form>
  );
}
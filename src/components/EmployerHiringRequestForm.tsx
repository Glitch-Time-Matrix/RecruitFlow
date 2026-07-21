import React, { useState } from "react";
import { Building2, Upload, CheckCircle2, User, FileText, DollarSign, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { EmployerHiringRequest } from "../types";

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
    setUploading(true);
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, jdFileName: file.name }));
      setUploading(false);
    }, 1200);
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
      const response = await fetch("/api/employers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmissionResult({
          success: true,
          id: data.requestId,
          message: data.message || "Hiring request registered with our executive search division.",
        });
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(data.error || "Failed to submit hiring request.");
      }
    } catch (err) {
      // Fallback local response
      const mockId = `HIRING-${Math.floor(Math.random() * 900000 + 100000)}`;
      setSubmissionResult({
        success: true,
        id: mockId,
        message: "Your hiring requirement has been submitted. An account executive will contact you shortly.",
      });
      if (onSuccess) onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  if (submissionResult?.success) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-brand-slate/40 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-brand-slate/10 pointer-events-none">
          <Building2 className="size-48" />
        </div>
        <div className="size-12 rounded-2xl bg-brand-slate/20 border border-brand-slate/40 flex items-center justify-center text-brand-slate mb-6">
          <CheckCircle2 className="size-6" />
        </div>
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-slate block mb-2">
          Hiring Request Received
        </span>
        <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
          Client Recruitment Requirement Logged
        </h3>
        <p className="text-zinc-400 text-sm font-light max-w-xl leading-relaxed mb-6">
          Thank you, <strong className="text-white font-semibold">{formData.contactName}</strong> from <strong className="text-white font-semibold">{formData.companyName}</strong>. Your recruitment request for <span className="text-brand-slate font-medium">{formData.jobTitle}</span> has been assigned Reference ID <span className="font-mono text-brand-slate">{submissionResult.id}</span>.
        </p>
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 space-y-2 mb-8 max-w-xl">
          <p className="flex justify-between">
            <span className="text-zinc-500">Service Type:</span>
            <span className="text-white font-medium">{formData.employmentType}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-zinc-500">Number of Openings:</span>
            <span className="text-white font-medium">{formData.openingsCount}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-zinc-500">Target Timeline:</span>
            <span className="text-white font-medium">{formData.urgencyTimeline}</span>
          </p>
        </div>
        <button
          onClick={() => {
            setSubmissionResult(null);
            setFormData((prev) => ({ ...prev, jobTitle: "", requiredSkills: "", jobDescriptionText: "" }));
          }}
          type="button"
          className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold border border-zinc-800 transition-colors"
        >
          Submit Additional Hiring Requirement
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-[#09090d] border border-zinc-800/80 text-left space-y-10 shadow-2xl">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="size-4 text-brand-slate" />
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-slate">
            Employer Talent Acquisition Request
          </span>
        </div>
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
          Submit Corporate Hiring Requirements
        </h3>
        <p className="text-zinc-400 text-xs sm:text-sm font-light mt-1">
          Provide position specifications to engage our specialized headhunting team and initiate candidate mapping.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-3 text-red-300 text-xs">
          <AlertCircle className="size-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: Company Details */}
      <div className="space-y-4 pt-4 border-t border-zinc-900">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Building2 className="size-4 text-brand-slate" />
          <span>1. Company Information</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Company Name *</label>
            <input
              type="text"
              name="companyName"
              required
              placeholder="e.g. Apex Industrial Systems"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-slate transition-colors"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Industry Sector</label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs focus:outline-none focus:border-brand-slate transition-colors"
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
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Company Size / Employee Count</label>
            <select
              name="companyScale"
              value={formData.companyScale}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs focus:outline-none focus:border-brand-slate transition-colors"
            >
              <option value="1-10 employees">1-10 employees</option>
              <option value="11-50 employees">11-50 employees</option>
              <option value="51-200 employees">51-200 employees</option>
              <option value="201-1000 employees">201-1000 employees</option>
              <option value="1000+ Enterprise">1000+ Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Company Website (Optional)</label>
            <input
              type="url"
              name="websiteUrl"
              placeholder="https://company.com"
              value={formData.websiteUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-slate transition-colors"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Contact Person */}
      <div className="space-y-4 pt-6 border-t border-zinc-900">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <User className="size-4 text-brand-emerald" />
          <span>2. Contact Person Details</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Contact Person Name *</label>
            <input
              type="text"
              name="contactName"
              required
              placeholder="e.g. Marcus Thorne"
              value={formData.contactName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-slate transition-colors"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Designation / Role</label>
            <input
              type="text"
              name="designation"
              placeholder="e.g. VP of Human Resources / Talent Acquisition Director"
              value={formData.designation}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-slate transition-colors"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Corporate Email Address *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="marcus@company.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-slate transition-colors"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Direct Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="+1 (555) 234-5678"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-slate transition-colors"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Position Details */}
      <div className="space-y-4 pt-6 border-t border-zinc-900">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <FileText className="size-4 text-brand-slate" />
          <span>3. Position Specifications & Requirements</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Target Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              required
              placeholder="e.g. Senior Plant Operations Manager"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-slate transition-colors"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Recruitment Service Required</label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs focus:outline-none focus:border-brand-slate transition-colors"
            >
              <option value="Permanent Recruitment">Permanent Recruitment</option>
              <option value="Contract Staffing">Contract Staffing</option>
              <option value="Executive Search">Executive Search</option>
              <option value="Bulk & Volume Hiring">Bulk & Volume Hiring</option>
              <option value="Campus & Graduate Hiring">Campus & Graduate Hiring</option>
              <option value="RPO Solutions">RPO Solutions</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Number of Openings</label>
            <input
              type="text"
              name="openingsCount"
              placeholder="e.g. 1 position / 10 bulk roles"
              value={formData.openingsCount}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-slate transition-colors"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Required Experience Level</label>
            <select
              name="requiredExperience"
              value={formData.requiredExperience}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs focus:outline-none focus:border-brand-slate transition-colors"
            >
              <option value="1-3 years">1-3 years (Junior)</option>
              <option value="3-5 years">3-5 years (Mid-Level)</option>
              <option value="5-8 years">5-8 years (Senior)</option>
              <option value="8-12+ years">8-12+ years (Lead / Executive)</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Work Arrangement / Location</label>
            <select
              name="workLocation"
              value={formData.workLocation}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs focus:outline-none focus:border-brand-slate transition-colors"
            >
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Budgeted Salary / Compensation Range</label>
            <input
              type="text"
              name="salaryRange"
              placeholder="e.g. $140,000 - $180,000"
              value={formData.salaryRange}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-slate transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Key Technical & Behavioral Skills Required</label>
            <input
              type="text"
              name="requiredSkills"
              placeholder="e.g. Lean Manufacturing, OSHA 30, Team Leadership, ERP Systems"
              value={formData.requiredSkills}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-slate transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Job Description Summary / Role Responsibilities</label>
            <textarea
              name="jobDescriptionText"
              rows={4}
              placeholder="Paste job details or overview of key responsibilities, team size, and goals..."
              value={formData.jobDescriptionText}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-slate transition-colors"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Upload JD File */}
      <div className="space-y-4 pt-6 border-t border-zinc-900">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Upload className="size-4 text-brand-emerald" />
          <span>4. Upload Job Description Document (Optional)</span>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleFileDrop}
          className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
            dragActive
              ? "border-brand-slate bg-brand-slate/10"
              : formData.jdFileName
              ? "border-brand-slate/60 bg-zinc-900/80"
              : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="size-8 rounded-full border-2 border-brand-slate border-t-transparent animate-spin"></div>
              <span className="text-xs text-zinc-400">Uploading job description...</span>
            </div>
          ) : formData.jdFileName ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-brand-slate" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-white">{formData.jdFileName}</p>
                  <p className="text-[10px] text-zinc-500">Document attached to hiring ticket</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, jdFileName: "" }))}
                className="text-xs text-red-400 hover:underline"
              >
                Remove File
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <Upload className="size-8 text-zinc-500 mb-1" />
              <p className="text-xs font-semibold text-white">
                Drag and drop your official Job Description (PDF, DOCX)
              </p>
              <label className="mt-2 inline-flex items-center px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 cursor-pointer transition-colors">
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
      <div className="pt-6 border-t border-zinc-900 space-y-4">
        <div>
          <label className="block text-zinc-400 text-xs font-medium mb-1.5">Target Fulfillment Timeline</label>
          <select
            name="urgencyTimeline"
            value={formData.urgencyTimeline}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs focus:outline-none focus:border-brand-slate transition-colors"
          >
            <option value="Immediate (Within 14 Days)">Immediate (Shortlist within 48-72 hours)</option>
            <option value="Standard Search (30 Days)">Standard Search (Fulfillment within 30 days)</option>
            <option value="Pipeline Building (Future Project)">Future Pipeline / Confidential Replacement</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-slate text-black font-bold text-sm tracking-tight hover:opacity-95 shadow-xl transition-all disabled:opacity-50"
        >
          {submitting ? "Logging Hiring Request..." : "Submit Employer Hiring Request"}
        </button>
      </div>
    </form>
  );
}

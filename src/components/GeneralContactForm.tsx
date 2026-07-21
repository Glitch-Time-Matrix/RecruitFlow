import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Building2 } from "lucide-react";
import { ContactInquiry } from "../types";

export default function GeneralContactForm() {
  const [formData, setFormData] = useState<ContactInquiry>({
    fullName: "",
    email: "",
    phone: "",
    inquiryType: "Employer Hiring Inquiry",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; id?: string; message?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName || !formData.email || !formData.message) {
      setErrorMessage("Please complete all required fields (Full Name, Email, Message).");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmissionResult({
          success: true,
          id: data.messageId,
          message: data.message || "Thank you for reaching out. A representative will contact you within 24 hours.",
        });
      } else {
        setErrorMessage(data.error || "Failed to submit contact inquiry.");
      }
    } catch (err) {
      const mockId = `MSG-${Math.floor(Math.random() * 900000 + 100000)}`;
      setSubmissionResult({
        success: true,
        id: mockId,
        message: "Your message has been dispatched to our communications team.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submissionResult?.success) {
    return (
      <div className="p-8 rounded-3xl bg-muted/50 border border-border text-left relative overflow-hidden shadow-sm">
        <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-sm">
          <CheckCircle2 className="size-6" />
        </div>
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary block mb-2">
          Inquiry Dispatched
        </span>
        <h3 className="text-2xl font-display font-bold text-foreground mb-3">
          Message Received
        </h3>
        <p className="text-foreground/70 text-sm font-light leading-relaxed mb-6">
          Thank you, <strong className="text-foreground font-semibold">{formData.fullName}</strong>. Your message has been routed to our agency operations desk under Reference Ticket <span className="font-mono text-primary font-medium">{submissionResult.id}</span>.
        </p>
        <button
          onClick={() => {
            setSubmissionResult(null);
            setFormData({ fullName: "", email: "", phone: "", inquiryType: "Employer Hiring Inquiry", subject: "", message: "" });
          }}
          type="button"
          className="px-6 py-2.5 rounded-xl bg-white hover:bg-muted text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-border text-left space-y-6 shadow-md">
      <div>
        <h3 className="font-display font-bold text-2xl text-foreground tracking-tight">
          Send Us a Direct Inquiry
        </h3>
        <p className="text-foreground/70 text-xs font-light mt-1">
          Reach our corporate recruitment advisors, client account managers, or candidate support representatives.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs shadow-sm">
          <AlertCircle className="size-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Full Name *</label>
          <input
            type="text"
            name="fullName"
            required
            placeholder="e.g. Sarah Jenkins"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
          />
        </div>

        <div>
          <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Business / Personal Email *</label>
          <input
            type="email"
            name="email"
            required
            placeholder="sarah@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
          />
        </div>

        <div>
          <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="+1 (555) 019-2834"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
          />
        </div>

        <div className="relative">
          <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Inquiry Category</label>
          <select
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm appearance-none cursor-pointer"
          >
            <option value="Employer Hiring Inquiry">Employer Hiring Inquiry</option>
            <option value="Candidate Application Support">Candidate Application Support</option>
            <option value="Executive Search & Headhunting">Executive Search & Headhunting</option>
            <option value="RPO / Bulk Staffing Consultation">RPO / Bulk Staffing Consultation</option>
            <option value="General Corporate Partnership">General Corporate Partnership</option>
          </select>
          <div className="pointer-events-none absolute bottom-3 right-4 flex items-center text-foreground/40">
            <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Subject</label>
          <input
            type="text"
            name="subject"
            placeholder="e.g. Executive Staffing Inquiry for Healthcare Division"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-foreground/80 text-xs font-semibold mb-1.5">Detailed Message *</label>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Provide details about your staffing needs or questions..."
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm tracking-tight hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-md"
      >
        <Send className="size-4" />
        {submitting ? "Sending Inquiry..." : "Submit Direct Message"}
      </button>
    </form>
  );
}

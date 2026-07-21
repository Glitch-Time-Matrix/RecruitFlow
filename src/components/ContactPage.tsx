import React, { useState } from "react";
import GeneralContactForm from "./GeneralContactForm";
import { Mail, Phone, MapPin, Clock, Building2, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const offices = [
    {
      city: "New York HQ",
      address: "350 Fifth Avenue, Suite 6200, New York, NY 10118",
      phone: "+1 (212) 555-0192",
      email: "ny.office@aurastaffing.com",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM EST",
    },
    {
      city: "Chicago Regional",
      address: "233 S Wacker Dr, Suite 4500, Chicago, IL 60606",
      phone: "+1 (312) 555-0184",
      email: "chicago@aurastaffing.com",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM CST",
    },
    {
      city: "San Francisco Tech Desk",
      address: "500 Howard Street, Suite 300, San Francisco, CA 94105",
      phone: "+1 (415) 555-0177",
      email: "sf.tech@aurastaffing.com",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM PST",
    },
    {
      city: "London International Desk",
      address: "1 Canada Square, Canary Wharf, London E14 5AA",
      phone: "+44 20 7946 0912",
      email: "london@aurastaffing.com",
      hours: "Mon - Fri: 8:30 AM - 5:30 PM GMT",
    },
  ];

  const faqs = [
    {
      q: "How fast can Aura Staffing present a qualified candidate shortlist?",
      a: "For standard permanent and contract roles, our team presents an initial vetted shortlist of 3-5 candidates within 48 to 72 hours. Executive search timelines typically run 10-14 days due to extensive background and reference verification.",
    },
    {
      q: "What is included in Aura's 90-Day Placement Retention Guarantee?",
      a: "If a candidate placed by Aura Staffing voluntarily resigns or is terminated for cause within 90 days of employment, we provide a full, priority replacement search at no additional cost.",
    },
    {
      q: "How does contract staffing payroll and compliance work?",
      a: "Aura acts as the Employer of Record (EOR) for contract personnel, managing all W2/1099 payroll, statutory taxes, workers' compensation insurance, health benefits, and labor law compliance.",
    },
    {
      q: "Is candidate registration free for job seekers?",
      a: "Yes. Aura Staffing Agency never charges candidates or job seekers any fees. Our services are entirely employer-funded.",
    },
  ];

  return (
    <div className="w-full bg-[#070709] text-white py-16 sm:py-24 px-6 text-left">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-emerald block">
            Client & Candidate Contact Desk
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-tight">
            Get in Touch with our Recruitment Advisors.
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed">
            Whether inquiring about executive staffing solutions, submitting a hiring proposal, or seeking application assistance, our regional offices respond within 24 hours.
          </p>
        </div>

        {/* Form and Office Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <GeneralContactForm />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#09090d] border border-zinc-800/80 space-y-6">
              <h3 className="font-display font-bold text-xl text-white">Global Headquarters & Offices</h3>
              
              <div className="space-y-6 divide-y divide-zinc-900">
                {offices.map((office, idx) => (
                  <div key={idx} className={idx > 0 ? "pt-6" : ""}>
                    <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                      <Building2 className="size-4 text-brand-emerald" />
                      {office.city}
                    </h4>
                    <p className="text-zinc-400 text-xs font-light mt-1 flex items-start gap-1.5">
                      <MapPin className="size-3.5 text-zinc-500 shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-4 text-xs text-zinc-400 font-light">
                      <a href={`tel:${office.phone}`} className="hover:text-brand-emerald flex items-center gap-1">
                        <Phone className="size-3 text-brand-slate" />
                        {office.phone}
                      </a>
                      <a href={`mailto:${office.email}`} className="hover:text-brand-emerald flex items-center gap-1">
                        <Mail className="size-3 text-brand-slate" />
                        {office.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map visual panel */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-brand-emerald/10 text-brand-emerald">
                <Clock className="size-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">24/7 Candidate Support Line</h4>
                <p className="text-zinc-400 text-xs font-light mt-0.5">Emergency shift fulfillment desk active for healthcare & industrial facilities.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="pt-12 border-t border-zinc-900 space-y-8">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-slate block mb-2">
              Frequently Asked Questions
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Everything you need to know about our recruitment process.
            </h2>
          </div>

          <div className="space-y-4 max-w-4xl">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#09090d] border border-zinc-800/80 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm sm:text-base text-white hover:text-brand-emerald transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="size-5 text-brand-emerald shrink-0" /> : <ChevronDown className="size-5 text-zinc-500 shrink-0" />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 font-light border-t border-zinc-900 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

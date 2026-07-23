"use client";
import React, { useState, useRef } from "react";
import GeneralContactForm from "./GeneralContactForm";
import { Mail, Phone, MapPin, Clock, Building2, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);
export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header reveal
    gsap.from(".contact-header > *", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });

    // Form and Offices reveal
    gsap.from(".contact-panel", {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".contact-grid",
        start: "top 85%"
      }
    });

    // FAQ reveal
    gsap.from(".faq-item", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".faq-container",
        start: "top 85%"
      }
    });
  }, { scope: containerRef });

  const offices = [
    {
      city: "New York HQ",
      address: "350 Fifth Avenue, Suite 6200, New York, NY 10118",
      phone: "+1 (212) 555-0192",
      email: "ny.office@recruitflowstaffing.com",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM EST",
    },
    {
      city: "Chicago Regional",
      address: "233 S Wacker Dr, Suite 4500, Chicago, IL 60606",
      phone: "+1 (312) 555-0184",
      email: "chicago@recruitflowstaffing.com",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM CST",
    },
    {
      city: "San Francisco Tech Desk",
      address: "500 Howard Street, Suite 300, San Francisco, CA 94105",
      phone: "+1 (415) 555-0177",
      email: "sf.tech@recruitflowstaffing.com",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM PST",
    },
    {
      city: "London International Desk",
      address: "1 Canada Square, Canary Wharf, London E14 5AA",
      phone: "+44 20 7946 0912",
      email: "london@recruitflowstaffing.com",
      hours: "Mon - Fri: 8:30 AM - 5:30 PM GMT",
    },
  ];

  const faqs = [
    {
      q: "How fast can RecruitFlow present a qualified candidate shortlist?",
      a: "For standard permanent and contract roles, our team presents an initial vetted shortlist of 3-5 candidates within 48 to 72 hours. Executive search timelines typically run 10-14 days due to extensive background and reference verification.",
    },
    {
      q: "What is included in RecruitFlow's 90-Day Placement Retention Guarantee?",
      a: "If a candidate placed by RecruitFlow voluntarily resigns or is terminated for cause within 90 days of employment, we provide a full, priority replacement search at no additional cost.",
    },
    {
      q: "How does contract staffing payroll and compliance work?",
      a: "RecruitFlow acts as the Employer of Record (EOR) for contract personnel, managing all W2/1099 payroll, statutory taxes, workers' compensation insurance, health benefits, and labor law compliance.",
    },
    {
      q: "Is candidate registration free for job seekers?",
      a: "Yes. RecruitFlow never charges candidates or job seekers any fees. Our services are entirely employer-funded.",
    },
  ];

  return (
    <div ref={containerRef} className="w-full bg-background text-foreground py-16 sm:py-24 px-6 text-left">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="contact-header max-w-3xl space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary block">
            Client & Candidate Contact Desk
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground tracking-tight leading-tight">
            Get in Touch with our Recruitment Advisors.
          </h1>
          <p className="text-foreground/70 text-base sm:text-lg font-light leading-relaxed">
            Whether inquiring about executive staffing solutions, submitting a hiring proposal, or seeking application assistance, our regional offices respond within 24 hours.
          </p>
        </div>

        {/* Form and Office Contact Info */}
        <div className="contact-grid grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="contact-panel lg:col-span-7">
            <GeneralContactForm />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="contact-panel p-6 sm:p-8 rounded-3xl bg-white border border-border shadow-sm space-y-6">
              <h3 className="font-display font-bold text-xl text-foreground">Global Headquarters & Offices</h3>
              
              <div className="space-y-6 divide-y divide-border">
                {offices.map((office, idx) => (
                  <div key={idx} className={idx > 0 ? "pt-6" : ""}>
                    <h4 className="text-foreground font-semibold text-sm flex items-center gap-2">
                      <Building2 className="size-4 text-primary" />
                      {office.city}
                    </h4>
                    <p className="text-foreground/70 text-xs font-light mt-1 flex items-start gap-1.5">
                      <MapPin className="size-3.5 text-foreground/40 shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-4 text-xs text-foreground/70 font-light">
                      <a href={`tel:${office.phone}`} className="hover:text-primary flex items-center gap-1 transition-colors">
                        <Phone className="size-3 text-secondary" />
                        {office.phone}
                      </a>
                      <a href={`mailto:${office.email}`} className="hover:text-primary flex items-center gap-1 transition-colors">
                        <Mail className="size-3 text-secondary" />
                        {office.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map visual panel */}
            <div className="contact-panel p-6 rounded-3xl bg-muted/50 border border-border shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <Clock className="size-6" />
              </div>
              <div>
                <h4 className="text-foreground font-semibold text-sm">24/7 Candidate Support Line</h4>
                <p className="text-foreground/70 text-xs font-light mt-0.5">Emergency shift fulfillment desk active for healthcare & industrial facilities.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="faq-container pt-12 border-t border-border space-y-8">
          <div className="faq-item">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-secondary block mb-2">
              Frequently Asked Questions
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
              Everything you need to know about our recruitment process.
            </h2>
          </div>

          <div className="space-y-4 max-w-4xl">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="faq-item rounded-2xl bg-white border border-border shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="size-5 text-primary shrink-0" /> : <ChevronDown className="size-5 text-foreground/40 shrink-0" />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-foreground/70 font-light border-t border-border leading-relaxed">
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
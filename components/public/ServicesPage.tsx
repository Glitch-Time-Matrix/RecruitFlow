"use client";
import React, { useRef } from "react";
import { CheckCircle2, ShieldCheck, UserCheck, Briefcase, Users, GraduationCap, DollarSign, Layers, ArrowUpRight, Award, Search, Target } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RECRUITMENT_SERVICES } from "@/lib/data";

gsap.registerPlugin(useGSAP, ScrollTrigger);
interface ServicesPageProps {
  onNavigateEmployer: () => void;
}

const SERVICE_ICONS = [
  UserCheck,
  Briefcase,
  ShieldCheck,
  Users,
  GraduationCap,
  DollarSign,
  Layers,
];

export default function ServicesPage({ onNavigateEmployer }: ServicesPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header reveal
    gsap.from(".services-header > *", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });

    // Services Cards
    gsap.from(".service-card", {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".services-grid",
        start: "top 80%"
      }
    });

    // Process Steps
    gsap.from(".process-step", {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".process-grid",
        start: "top 85%"
      }
    });

    // Guarantee Banner
    gsap.from(".guarantee-banner", {
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".guarantee-banner",
        start: "top 85%"
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-background min-h-screen text-foreground pb-24 text-left">
      {/* Header Section */}
      <div className="services-header max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono font-medium text-primary mb-6 shadow-sm">
          <span className="flex size-2 rounded-full bg-accent animate-pulse"></span>
          Executive Recruitment Solutions
        </div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground tracking-tight leading-tight max-w-3xl mb-6">
          Architecting high-performance <span className="text-primary">corporate teams</span>.
        </h1>
        <p className="text-foreground/70 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
          From confidential C-suite executive search to scalable volume hiring, we deploy rigorous vetting frameworks to deliver exact-match candidates with industry-leading retention rates.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="services-grid grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          {RECRUITMENT_SERVICES.map((service, idx) => {
            const Icon = SERVICE_ICONS[idx % SERVICE_ICONS.length];
            return (
              <div key={service.id} className="service-card group p-8 sm:p-10 rounded-[2rem] bg-white border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col">
                <div className="flex items-start justify-between mb-8">
                  <div className="size-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon className="size-6" />
                  </div>
                  <span className="text-foreground/40 font-mono text-xs font-bold uppercase tracking-widest">
                    Solution 0{idx + 1}
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl text-foreground mb-2">{service.title}</h3>
                <p className="text-primary text-xs font-mono font-semibold uppercase tracking-wider mb-6">
                  {service.tagline}
                </p>
                <p className="text-foreground/70 text-sm font-light leading-relaxed mb-8">
                  {service.description}
                </p>

                <div className="mt-auto space-y-6">
                  <div>
                    <h4 className="text-foreground text-xs font-semibold uppercase tracking-wider mb-3">Key Benefits</h4>
                    <ul className="space-y-2">
                      {service.keyBenefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-light">
                          <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <p className="text-xs text-foreground/60 font-light mb-4">
                      <strong className="text-foreground font-semibold">Ideal For:</strong> {service.idealFor}
                    </p>
                    <button 
                      onClick={onNavigateEmployer}
                      className="w-full py-3.5 rounded-xl bg-white border border-border text-foreground text-sm font-bold tracking-tight hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
                    >
                      Inquire About {service.title}
                      <ArrowUpRight className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Execution Process */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl text-foreground tracking-tight mb-4">
              Our 4-Step Recruitment Execution
            </h2>
            <p className="text-foreground/70 text-sm font-light max-w-2xl mx-auto">
              A mathematical approach to talent acquisition. We eliminate the guesswork from hiring.
            </p>
          </div>

          <div className="process-grid grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0"></div>

            {[
              { icon: Search, title: "Market Mapping", desc: "Deep-dive talent landscape analysis and competitor benchmarking." },
              { icon: UserCheck, title: "Behavioral Vetting", desc: "Rigorous 3-stage interviews and technical proficiency testing." },
              { icon: ShieldCheck, title: "Reference Auditing", desc: "Comprehensive background checks and peer reference verification." },
              { icon: Target, title: "Placement & Follow-up", desc: "Offer negotiation, onboarding support, and 90-day retention tracking." }
            ].map((step, idx) => (
              <div key={idx} className="process-step relative z-10 flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-border shadow-sm">
                <div className="size-12 rounded-full bg-muted border border-border flex items-center justify-center text-foreground mb-4 shadow-sm">
                  <step.icon className="size-5" />
                </div>
                <h4 className="text-foreground font-bold text-sm mb-2">{step.title}</h4>
                <p className="text-foreground/60 text-xs font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="guarantee-banner rounded-[2.5rem] bg-white border border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/5 p-10 md:p-16 flex flex-col md:flex-row items-center gap-8 shadow-xl">
          <div className="size-20 rounded-full bg-white text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-md">
            <Award className="size-10" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-3">
              The 90-Day Placement Guarantee
            </h3>
            <p className="text-foreground/70 font-light leading-relaxed max-w-3xl">
              Every permanent executive and specialist placement is fully insured. If a candidate does not meet your cultural or technical expectations within the first 90 days, we run a replacement search at zero additional cost to your firm.
            </p>
          </div>
          <div className="shrink-0">
            <button 
              onClick={onNavigateEmployer}
              className="px-8 py-4 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Start Hiring Today
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
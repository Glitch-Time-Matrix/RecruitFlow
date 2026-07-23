"use client";
import React from "react";
import DisplayCards from "@/components/public/ui/display-cards";
import { Sparkles, Building2, ShieldCheck, Users } from "lucide-react";

export default function Features() {
  const featureCards = [
    {
      icon: <Users className="size-4 text-primary" />,
      title: "Global Talent Pool",
      description: "Access elite candidates instantly",
      date: "Active 24/7",
      iconClassName: "text-primary",
      titleClassName: "text-primary",
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <ShieldCheck className="size-4 text-primary" />,
      title: "Vetted Professionals",
      description: "Rigorous screening processes",
      date: "Guaranteed Placements",
      iconClassName: "text-primary",
      titleClassName: "text-primary",
      className:
        "[grid-area:stack] max-sm:translate-x-4 max-sm:translate-y-4 sm:translate-x-12 sm:translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Building2 className="size-4 text-primary" />,
      title: "Enterprise Ready",
      description: "Scalable staffing solutions",
      date: "Fortune 500 Trusted",
      iconClassName: "text-primary",
      titleClassName: "text-primary",
      className:
        "[grid-area:stack] max-sm:translate-x-8 max-sm:translate-y-8 sm:translate-x-24 sm:translate-y-20 hover:translate-y-10",
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div className="flex flex-col items-start text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono font-medium text-primary mb-6 shadow-sm">
            <span className="flex size-2 rounded-full bg-accent animate-pulse"></span>
            Why Choose RecruitFlow
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight leading-tight mb-6">
            Precision Staffing, <br/>
            <span className="text-primary">Unmatched Speed.</span>
          </h2>
          <p className="text-foreground/70 text-lg font-light leading-relaxed max-w-lg mb-8">
            Experience a new standard in corporate recruitment. Our proprietary matching algorithms and expansive network ensure you find the perfect fit faster than traditional agencies.
          </p>
          
          <ul className="space-y-4 mb-10">
            {[
              "90-Day Placement Guarantee",
              "Dedicated Account Manager",
              "Proprietary AI Matching"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                <div className="flex size-6 rounded-full bg-primary/10 items-center justify-center text-primary">
                  <Sparkles className="size-3" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex min-h-[400px] w-full items-center justify-center py-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 rounded-3xl blur-3xl -z-10"></div>
          <div className="w-full max-w-md pl-4 overflow-hidden">
            <DisplayCards cards={featureCards} />
          </div>
        </div>

      </div>
    </section>
  );
}
import React, { useRef } from "react";
import { ArrowUpRight, Sparkles, Building2, TrendingUp, ShieldCheck } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { AGENCY_STATS } from "../data";

gsap.registerPlugin(useGSAP);

interface HeroProps {
  onNavigateCandidate: () => void;
  onNavigateEmployer: () => void;
}

export default function Hero({ onNavigateCandidate, onNavigateEmployer }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".hero-tag", { opacity: 0, y: 15, duration: 0.4, ease: "power2.out" })
      .from(".hero-headline", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, "-=0.2")
      .from(".hero-subheadline", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, "-=0.4")
      .from(".hero-cta button", { opacity: 0, y: 15, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.4")
      .from(".hero-trust div", { opacity: 0, x: -10, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "-=0.2")
      .from(".hero-image-panel", { opacity: 0, scale: 0.95, duration: 0.8, ease: "power3.out" }, "-=1")
      .from(".hero-stats div", { opacity: 0, y: 20, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.5");

    gsap.to(".pulse-glow-bg", {
      y: 30,
      x: 20,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 2
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full py-16 md:py-24 px-6 grid-bg border-b border-border overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] rounded-full bg-accent/10 blur-[100px] pointer-events-none pulse-glow-bg"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[110px] pointer-events-none pulse-glow-bg"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Core Narrative Heading & Calls to Action */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Tag */}
          <div className="hero-tag inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono font-medium text-foreground/80 mb-6 shadow-sm">
            <span className="flex size-2 rounded-full bg-accent animate-pulse"></span>
            Premier Corporate Recruitment & Executive Staffing Agency
          </div>

          {/* Heading */}
          <h1 className="hero-headline font-display font-bold text-4xl sm:text-5xl lg:text-[58px] text-foreground tracking-tight leading-[1.08] mb-6">
            Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">exceptional talent</span> with world-class enterprises.
          </h1>

          {/* Subheadline */}
          <p className="hero-subheadline text-foreground/70 text-base sm:text-lg font-light leading-relaxed mb-8 max-w-xl">
            RecruitFlow delivers specialized permanent, contract, and executive recruitment solutions across Healthcare, Technology, Manufacturing, Finance, Construction, and Engineering.
          </p>

          {/* Primary and Secondary CTA Buttons */}
          <div className="hero-cta flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full max-w-md mb-10">
            <button
              onClick={onNavigateCandidate}
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm tracking-tight shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer min-h-[44px]"
            >
              <Sparkles className="size-4 text-white" />
              Submit Resume
              <ArrowUpRight className="size-4 text-white" />
            </button>
            <button
              onClick={onNavigateEmployer}
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-muted text-foreground border border-border font-semibold text-sm tracking-tight transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer min-h-[44px]"
            >
              <Building2 className="size-4 text-secondary" />
              Hire Talent
            </button>
          </div>

          {/* Trust badges */}
          <div className="hero-trust flex flex-wrap items-center gap-6 text-xs text-foreground/60 font-light pt-4 border-t border-border w-full max-w-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-accent" />
              <span>90-Day Retention Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-secondary" />
              <span>Confidential Executive Search</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <span>100% Vetted Candidates</span>
            </div>
          </div>
        </div>

        {/* Corporate Workspace Visual Panel */}
        <div className="hero-image-panel lg:col-span-5 relative w-full flex items-center justify-center">
          <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden border border-border shadow-2xl">
            {/* Status overlay */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full border border-border bg-white/80 backdrop-blur-md shadow-sm">
              <span className="flex size-2 rounded-full bg-accent animate-ping"></span>
              <p className="font-mono text-xs text-foreground font-semibold tracking-tight">Vetted Talent Database Active</p>
            </div>

            {/* Corporate Staffing Image */}
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" 
              alt="RecruitFlow Corporate Recruitment Headquarters"
              loading="lazy"
              className="absolute inset-0 size-full object-cover scale-[1.01] hover:scale-105 transition-transform duration-[4000ms] ease-out-quint"
            />

            {/* Subtle Gradient Veil */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90"></div>

            {/* Live Performance Panel */}
            <div className="absolute bottom-6 left-6 right-6 z-20 p-5 rounded-2xl border border-border bg-white/90 backdrop-blur-md text-left shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <h4 className="text-foreground font-bold text-sm">Rapid Executive & Specialist Search</h4>
                  <p className="text-foreground/70 text-xs font-light mt-0.5">Average qualified shortlist presented in 48-72 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Agency Stats Bar */}
      <div id="stats" className="hero-stats max-w-7xl mx-auto mt-20 pt-12 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
        {AGENCY_STATS.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-start text-left">
            <span className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight leading-none mb-2">
              {stat.value}
            </span>
            <span className="text-accent font-semibold text-xs tracking-tight uppercase mb-1">
              {stat.label}
            </span>
            <span className="text-foreground/70 text-xs font-light max-w-[180px]">
              {stat.desc}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}


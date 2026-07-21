import React, { useRef } from "react";
import { ArrowRight, Sparkles, Building2, TrendingUp } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AGENCY_STATS } from "../data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HeroProps {
  onNavigateCandidate: () => void;
  onNavigateEmployer: () => void;
}

export default function Hero({ onNavigateCandidate, onNavigateEmployer }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Initial load animation
    tl.fromTo(bgRef.current, 
      { scale: 1.1, filter: "blur(10px)", opacity: 0 }, 
      { scale: 1, filter: "blur(0px)", opacity: 1, duration: 1.5, ease: "power3.out" }
    )
    .fromTo(".hero-tag", 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 
      "-=0.8"
    )
    .fromTo(".hero-headline .line", 
      { opacity: 0, y: 50, rotation: 2 }, 
      { opacity: 1, y: 0, rotation: 0, duration: 1, stagger: 0.15, ease: "power3.out" }, 
      "-=0.6"
    )
    .fromTo(".hero-subheadline", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 
      "-=0.6"
    )
    .fromTo(".hero-cta-block", 
      { opacity: 0, x: 50 }, 
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, 
      "-=0.4"
    );

    // Parallax scrolling effect
    gsap.to(bgRef.current, {
      yPercent: 30, // Move background down as we scroll down (slower than foreground)
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(textRef.current, {
      yPercent: -40, // Move text up faster
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Stats bar reveal
    gsap.fromTo(".hero-stats div", 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".hero-stats",
          start: "top 90%"
        }
      }
    );

  }, { scope: containerRef });

  return (
    <>
      <section ref={containerRef} className="relative w-full h-[95vh] min-h-[700px] overflow-hidden bg-background">
        {/* Full-bleed Parallax Background */}
        <div className="absolute inset-0 w-full h-[120%] -top-[10%] z-0">
          <img 
            ref={bgRef}
            src="/hero-bg.png" 
            alt="RecruitFlow Cinematic Background"
            className="w-full h-full object-cover origin-center"
          />
          {/* Gradient veils for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent"></div>
        </div>

        {/* Foreground Content */}
        <div className="absolute inset-0 w-full h-full max-w-[1600px] mx-auto px-6 md:px-12 xl:px-24 flex items-center z-10 pointer-events-none">
          <div ref={textRef} className="max-w-4xl pt-20">
            {/* Tag */}
            <div className="hero-tag inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-medium text-foreground mb-8">
              <span className="flex size-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(22,163,74,0.8)]"></span>
              Premier Executive Staffing
            </div>

            {/* Massive Typography */}
            <h1 className="hero-headline font-display font-bold text-5xl md:text-7xl lg:text-[100px] text-foreground tracking-tighter leading-[0.95] mb-8">
              <div className="line overflow-hidden"><span className="block">Connecting</span></div>
              <div className="line overflow-hidden"><span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">exceptional talent</span></div>
              <div className="line overflow-hidden"><span className="block">with world-class</span></div>
              <div className="line overflow-hidden"><span className="block">enterprises.</span></div>
            </h1>

            {/* Subheadline */}
            <p className="hero-subheadline text-foreground/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
              RecruitFlow delivers specialized permanent, contract, and executive recruitment solutions across Healthcare, Technology, Manufacturing, Finance, and Engineering.
            </p>
          </div>
        </div>

        {/* Dual-CTA Block (Pinned to bottom right, inspired by doghouse.nl) */}
        <div className="hero-cta-block absolute bottom-0 right-0 md:bottom-12 md:right-12 z-20 flex flex-col sm:flex-row shadow-2xl">
          {/* For Employers */}
          <button 
            onClick={onNavigateEmployer}
            className="group flex-1 sm:w-64 md:w-72 p-8 md:p-10 bg-primary hover:bg-primary/95 text-white text-left flex flex-col justify-between min-h-[220px] transition-colors border-r border-white/10 cursor-pointer focus:outline-none"
          >
            <div>
              <div className="flex items-center gap-2 mb-6 text-white/70">
                <Building2 className="size-4" />
                <span className="text-[10px] uppercase tracking-widest font-mono font-semibold">For Companies</span>
              </div>
              <h3 className="font-display font-bold text-2xl md:text-3xl leading-tight">
                Hire Top-Tier <br/>Professionals
              </h3>
            </div>
            <div className="mt-8 flex justify-end">
              <div className="size-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-300">
                <ArrowRight className="size-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </div>
            </div>
          </button>

          {/* For Job Seekers */}
          <button 
            onClick={onNavigateCandidate}
            className="group flex-1 sm:w-64 md:w-72 p-8 md:p-10 bg-accent hover:bg-accent/95 text-white text-left flex flex-col justify-between min-h-[220px] transition-colors cursor-pointer focus:outline-none"
          >
            <div>
              <div className="flex items-center gap-2 mb-6 text-white/70">
                <Sparkles className="size-4" />
                <span className="text-[10px] uppercase tracking-widest font-mono font-semibold">For Job Seekers</span>
              </div>
              <h3 className="font-display font-bold text-2xl md:text-3xl leading-tight">
                Find Your <br/>Dream Role
              </h3>
            </div>
            <div className="mt-8 flex justify-end">
              <div className="size-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-accent transition-all duration-300">
                <ArrowRight className="size-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Prominent Agency Stats Bar - Moved directly below the new Hero */}
      <section className="bg-background py-16 border-b border-border">
        <div className="hero-stats max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 text-left">
          {AGENCY_STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-start text-left group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <TrendingUp className="size-5" />
                </div>
                <span className="text-foreground/50 font-mono text-[10px] font-bold uppercase tracking-widest">Metric 0{idx + 1}</span>
              </div>
              <span className="font-display font-bold text-4xl sm:text-5xl text-foreground tracking-tight leading-none mb-3">
                {stat.value}
              </span>
              <span className="text-primary font-semibold text-xs tracking-tight uppercase mb-2">
                {stat.label}
              </span>
              <span className="text-foreground/70 text-xs font-light leading-relaxed max-w-[200px]">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}


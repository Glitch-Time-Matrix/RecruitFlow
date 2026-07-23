"use client";
import React, { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SparklesCore } from "@/components/public/ui/sparkles";

gsap.registerPlugin(useGSAP);

interface HeroProps {
  onNavigateCandidate: () => void;
  onNavigateEmployer: () => void;
}

export default function Hero({ onNavigateCandidate, onNavigateEmployer }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal text
    const tl = gsap.timeline();
    tl.fromTo(".hero-kicker", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 })
      .fromTo(".hero-title .line", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.4")
      .fromTo(".hero-cta", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4");

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen min-h-[700px] bg-white overflow-hidden flex flex-col items-center justify-center">
      
      {/* Sparkles Background */}
      <div className="w-full absolute inset-0 h-screen z-0 pointer-events-none">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.8}
          particleDensity={80}
          className="w-full h-full"
          particleColor="#0F172A" // Slate 900 to contrast beautifully with the white background
          speed={0.8}
        />
        {/* Subtle gradient mask to fade sparkles near the edges */}
        <div className="absolute inset-0 w-full h-full bg-white [mask-image:radial-gradient(800px_800px_at_center,transparent_20%,white)] pointer-events-none"></div>
      </div>

      {/* Central Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Kicker */}
        <span className="hero-kicker font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-foreground mb-6">
          RecruitFlow
        </span>

        {/* Massive Typography */}
        <h1 className="hero-title font-display font-medium text-4xl sm:text-6xl md:text-7xl lg:text-[85px] text-foreground tracking-[-0.04em] leading-[1.05] mb-12">
          <div className="overflow-hidden pb-2"><span className="line block">Connecting exceptional</span></div>
          <div className="overflow-hidden pb-2"><span className="line block text-foreground/50">talent with world-class</span></div>
          <div className="overflow-hidden pb-2"><span className="line block">enterprises.</span></div>
        </h1>

        {/* Minimalist CTAs */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          <button 
            onClick={onNavigateEmployer}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-foreground text-background text-sm font-semibold tracking-tight hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-foreground/50 shadow-xl shadow-black/10 cursor-pointer"
          >
            Hire Talent
          </button>
          <button 
            onClick={onNavigateCandidate}
            className="w-full sm:w-auto justify-center px-7 py-3.5 rounded-full bg-white border border-border text-foreground text-sm font-semibold tracking-tight hover:scale-105 hover:bg-muted transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-foreground/50 shadow-sm cursor-pointer"
          >
            Submit Resume
            <ArrowUpRight className="size-3.5 text-foreground/50" />
          </button>
        </div>
      </div>
      
      {/* Scroll Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-foreground/40 text-[10px] uppercase tracking-widest font-mono z-10 pointer-events-none">
        <span className="animate-pulse">↓</span> Scroll to discover
      </div>
    </section>
  );
}
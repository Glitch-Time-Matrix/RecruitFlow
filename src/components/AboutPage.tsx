import React, { useRef } from "react";
import { Building2, ShieldCheck, Award, Users, Target, Heart, Eye, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LEADERSHIP_TEAM, AGENCY_STATS } from "../data";

gsap.registerPlugin(useGSAP, ScrollTrigger);
interface AboutPageProps {
  onNavigateCandidate: () => void;
  onNavigateEmployer: () => void;
}

export default function AboutPage({ onNavigateCandidate, onNavigateEmployer }: AboutPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero Section
    gsap.from(".about-hero-text > *", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });

    // Story Section
    gsap.from(".about-story-text", {
      opacity: 0,
      x: -30,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-story-text",
        start: "top 80%"
      }
    });

    gsap.from(".about-story-img", {
      opacity: 0,
      x: 30,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-story-img",
        start: "top 80%"
      }
    });

    // Value Cards
    gsap.from(".about-value-card", {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-value-grid",
        start: "top 80%"
      }
    });

    // Leadership Cards
    gsap.from(".about-leader-card", {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-leader-grid",
        start: "top 80%"
      }
    });

    // CTA Banner
    gsap.from(".about-cta-content > *", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-cta-section",
        start: "top 80%"
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-background min-h-screen text-foreground">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="about-hero-text text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono font-medium text-foreground/80 mb-6 shadow-sm">
              <span className="flex size-2 rounded-full bg-accent animate-pulse"></span>
              The RecruitFlow Advantage
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground tracking-tight leading-[1.1] mb-6">
              Elevating the standard of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">executive recruitment</span> globally.
            </h1>
            <p className="text-foreground/70 text-base sm:text-lg font-light leading-relaxed mb-8">
              Founded on the principles of precision, discretion, and strategic alignment, RecruitFlow operates as a premier extension of your internal talent acquisition function. We don't just fill seats; we architect leadership teams.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto space-y-20 px-6 pb-24">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="about-story-text lg:col-span-7 space-y-6">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
              Replacing fragmented recruitment with structured partnership.
            </h2>
            <p className="text-foreground/70 text-sm sm:text-base font-light leading-relaxed">
              Traditional staffing agencies flood hiring managers with hundreds of unvetted resumes, creating friction, wasted interviews, and high attrition. At RecruitFlow, we operate as a confidential talent advisor.
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-border">
              <div>
                <h4 className="text-3xl font-display font-bold text-foreground mb-1">15+</h4>
                <p className="text-xs text-foreground/60 font-mono uppercase tracking-wider">Years Excellence</p>
              </div>
              <div>
                <h4 className="text-3xl font-display font-bold text-foreground mb-1">450+</h4>
                <p className="text-xs text-foreground/60 font-mono uppercase tracking-wider">Enterprise Clients</p>
              </div>
            </div>
          </div>

          <div className="about-story-img relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-[2rem] transform rotate-3 scale-105"></div>
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80" 
              alt="RecruitFlow Executive Boardroom" 
              loading="lazy"
              className="relative rounded-[2rem] w-full aspect-[4/3] object-cover shadow-2xl border border-border"
            />
          </div>
        </div>

        {/* Mission, Vision, Values Grid */}
        <div className="about-value-grid grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border">
          <div className="about-value-card p-8 rounded-3xl bg-white border border-border space-y-3 shadow-sm">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Target className="size-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">Our Mission</h3>
            <p className="text-foreground/60 text-xs font-light leading-relaxed">
              To empower organizations with transformative talent while providing candidates with career opportunities that align with their highest potential.
            </p>
          </div>

          <div className="about-value-card p-8 rounded-3xl bg-white border border-border space-y-3 shadow-sm">
            <div className="size-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Eye className="size-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">Our Vision</h3>
            <p className="text-foreground/60 text-xs font-light leading-relaxed">
              To define the global gold standard in corporate staffing, recognized for integrity, speed, zero-attrition placement rates, and human craftsmanship.
            </p>
          </div>

          <div className="about-value-card p-8 rounded-3xl bg-white border border-border space-y-3 shadow-sm">
            <div className="size-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <Heart className="size-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">Core Values</h3>
            <p className="text-foreground/60 text-xs font-light leading-relaxed">
              Uncompromising integrity, radical transparency in compensation, continuous market benchmarking, and relentless client dedication.
            </p>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="pt-8 border-t border-border">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight mb-4">
              Executive Leadership
            </h2>
            <p className="text-foreground/70 text-sm font-light max-w-2xl mx-auto">
              Our specialized recruitment directors bring decades of direct industry experience from the sectors they now recruit for.
            </p>
          </div>

          <div className="about-leader-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {LEADERSHIP_TEAM.map((member, idx) => (
              <div key={idx} className="about-leader-card p-6 rounded-3xl bg-white border border-border space-y-4 shadow-sm">
                <div className="aspect-square rounded-2xl overflow-hidden border border-border">
                  <img src={member.image} alt={member.name} className="size-full object-cover" />
                </div>
                <div>
                  <h3 className="text-foreground font-bold text-lg">{member.name}</h3>
                  <p className="text-primary font-mono text-xs font-semibold mt-0.5">{member.role}</p>
                  <p className="text-foreground/60 text-xs font-light leading-relaxed mt-2">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <section className="about-cta-section py-24 px-6 relative overflow-hidden bg-background">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 grid-bg opacity-20 mix-blend-overlay"></div>
          <div className="about-cta-content relative z-10 flex flex-col items-center">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mb-4">
              Ready to scale your leadership?
            </h2>
            <p className="text-white/90 text-sm font-light max-w-lg mb-8">
              Partner with RecruitFlow to access our confidential network of vetted executives and specialized technical talent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-8 py-3.5 rounded-xl bg-white text-primary font-bold text-sm hover:bg-muted transition-all shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50">
                Submit Hiring Request
              </button>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-8 py-3.5 rounded-xl bg-transparent border border-white text-white font-semibold text-sm hover:bg-white/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50">
                Contact Operations Desk
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface HeroProps {
  onNavigateCandidate: () => void;
  onNavigateEmployer: () => void;
}

const FLOATING_IMAGES = [
  { src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80", top: "15%", left: "15%", size: "w-24 h-24", rotation: -6 },
  { src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80", top: "25%", left: "80%", size: "w-32 h-32", rotation: 8 },
  { src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80", top: "70%", left: "10%", size: "w-28 h-28", rotation: -12 },
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80", top: "75%", left: "85%", size: "w-20 h-20", rotation: 15 },
  { src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80", top: "10%", left: "45%", size: "w-16 h-16", rotation: 5 },
  { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80", top: "45%", left: "5%", size: "w-20 h-20", rotation: -5 },
  { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80", top: "50%", left: "92%", size: "w-24 h-24", rotation: -8 },
  { src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80", top: "85%", left: "40%", size: "w-16 h-16", rotation: 10 },
  { src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=256&q=80", top: "85%", left: "65%", size: "w-24 h-24", rotation: -15 },
  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80", top: "12%", left: "70%", size: "w-20 h-20", rotation: 12 },
  { src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=256&q=80", top: "35%", left: "18%", size: "w-16 h-16", rotation: -20 },
  { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80", top: "35%", left: "75%", size: "w-16 h-16", rotation: 25 },
];

export default function Hero({ onNavigateCandidate, onNavigateEmployer }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal text
    const tl = gsap.timeline();
    tl.fromTo(".hero-kicker", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 })
      .fromTo(".hero-title .line", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.4")
      .fromTo(".hero-cta", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4");

    // Scatter elements pop-in
    gsap.fromTo(".scatter-img", 
      { opacity: 0, scale: 0.5 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 1, 
        stagger: 0.05, 
        ease: "back.out(1.5)",
        delay: 0.4
      }
    );

    // Continuous floating animation
    gsap.utils.toArray(".scatter-img").forEach((el: any) => {
      // Randomize float distances and durations
      const randomY = gsap.utils.random(-25, 25);
      const randomX = gsap.utils.random(-15, 15);
      const randomRot = gsap.utils.random(-10, 10);
      const randomDur = gsap.utils.random(4, 7);
      
      gsap.to(el, {
        y: `+=${randomY}`,
        x: `+=${randomX}`,
        rotation: `+=${randomRot}`,
        duration: randomDur,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: gsap.utils.random(0, 2) // Stagger the start of the float
      });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen min-h-[700px] bg-white overflow-hidden flex flex-col items-center justify-center">
      
      {/* Floating Constellation Images */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {FLOATING_IMAGES.map((img, idx) => (
          <div 
            key={idx}
            className={`scatter-img absolute ${img.size} rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5 bg-muted hidden md:block`}
            style={{
              top: img.top,
              left: img.left,
              transform: `rotate(${img.rotation}deg)`
            }}
          >
            <img 
              src={img.src} 
              alt="Talent"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Central Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Kicker */}
        <span className="hero-kicker font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-foreground mb-6">
          RecruitFlow
        </span>

        {/* Massive Typography */}
        <h1 className="hero-title font-display font-medium text-5xl sm:text-6xl md:text-7xl lg:text-[85px] text-foreground tracking-[-0.04em] leading-[1.05] mb-12">
          <div className="overflow-hidden pb-2"><span className="line block">Connecting exceptional</span></div>
          <div className="overflow-hidden pb-2"><span className="line block text-foreground/50">talent with world-class</span></div>
          <div className="overflow-hidden pb-2"><span className="line block">enterprises.</span></div>
        </h1>

        {/* Minimalist CTAs */}
        <div className="hero-cta flex items-center justify-center gap-4">
          <button 
            onClick={onNavigateEmployer}
            className="px-7 py-3.5 rounded-full bg-foreground text-background text-sm font-semibold tracking-tight hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-foreground/50 shadow-xl shadow-black/10"
          >
            Hire Talent
          </button>
          <button 
            onClick={onNavigateCandidate}
            className="px-7 py-3.5 rounded-full bg-white border border-border text-foreground text-sm font-semibold tracking-tight hover:scale-105 hover:bg-muted transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-foreground/50 shadow-sm"
          >
            Submit Resume
            <ArrowUpRight className="size-3.5 text-foreground/50" />
          </button>
        </div>
      </div>
      
      {/* Scroll Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-foreground/40 text-[10px] uppercase tracking-widest font-mono">
        <span className="animate-bounce">↓</span> Scroll to discover
      </div>
    </section>
  );
}


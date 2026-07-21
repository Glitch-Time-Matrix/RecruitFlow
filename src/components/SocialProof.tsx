import React, { useRef } from "react";
import { Quote, Star } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CLIENT_LOGOS, TESTIMONIALS } from "../data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function SocialProof() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header reveal
    gsap.fromTo(".sp-header > *", 
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".sp-header",
          start: "top 85%"
        }
      }
    );

    // Testimonials reveal
    gsap.fromTo(".sp-card", 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".sp-grid",
          start: "top 85%"
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="testimonials" className="py-24 bg-muted border-t border-border relative overflow-hidden">
      <div className="sp-header max-w-7xl mx-auto px-6 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border text-xs font-mono font-medium text-foreground/80 mb-6 shadow-sm">
          <span className="flex size-2 rounded-full bg-accent animate-pulse"></span>
          Trusted by Industry Leaders
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight max-w-2xl mx-auto">
          Powering the workforce of <span className="text-primary">Fortune 500s</span> & high-growth innovators.
        </h2>
        <p className="text-foreground/70 text-sm font-light mt-4 max-w-xl mx-auto">
          Over 450 corporate partners rely on RecruitFlow for critical talent acquisition and executive search.
        </p>
      </div>

      {/* Client Logos Infinite Loop Banner */}
      <div className="relative w-full py-8 mb-20 overflow-hidden select-none border-y border-border bg-white">
        {/* Fade overlays for marquee */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
        
        <div className="animate-marquee flex items-center gap-12 sm:gap-24">
          {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, idx) => (
            <div key={idx} className="flex items-center gap-3 text-foreground/40 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tighter uppercase whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="sp-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="sp-card p-8 rounded-3xl bg-white border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col text-left relative group cursor-default"
            >
              <Quote className="absolute top-6 right-6 size-12 text-muted opacity-50 group-hover:text-primary/10 transition-colors duration-300" />
              
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="size-4 text-accent fill-accent" />
                ))}
              </div>

              <p className="text-foreground/80 font-light text-sm leading-relaxed mb-8 flex-1 relative z-10">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="size-10 rounded-full object-cover border border-border"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <h4 className="text-foreground font-bold text-sm">{testimonial.name}</h4>
                  <p className="text-foreground/60 text-xs font-light mt-0.5">
                    {testimonial.role}, <span className="text-primary font-medium">{testimonial.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

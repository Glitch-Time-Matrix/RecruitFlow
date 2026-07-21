import React from "react";
import { CLIENT_LOGOS, TESTIMONIALS } from "../data";

export default function SocialProof() {
  return (
    <section id="testimonials" className="py-20 border-b border-dark-border bg-dark-bg relative overflow-hidden">
      {/* Client Logos Infinite Loop Banner */}
      <div className="w-full border-y border-zinc-900 bg-zinc-950/20 py-8 mb-20 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-6 mb-4 text-left">
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
            Trusted Placement Network / Sourced From Top Workforces
          </p>
        </div>
        
        {/* Infinite Loop Container */}
        <div className="relative flex w-full">
          <div className="animate-marquee flex gap-12 sm:gap-24 items-center">
            {/* First sequence */}
            {CLIENT_LOGOS.map((logo, idx) => (
              <div key={idx} className="flex items-center gap-2 px-4 py-2 text-zinc-400 font-display font-medium text-lg sm:text-2xl hover:text-white transition-colors duration-200">
                <span className="text-zinc-600 font-normal">{logo.symbol}</span>
                <span>{logo.name}</span>
              </div>
            ))}
            {/* Duplicate sequence for continuous infinite loop */}
            {CLIENT_LOGOS.map((logo, idx) => (
              <div key={`dup-${idx}`} className="flex items-center gap-2 px-4 py-2 text-zinc-400 font-display font-medium text-lg sm:text-2xl hover:text-white transition-colors duration-200">
                <span className="text-zinc-600 font-normal">{logo.symbol}</span>
                <span>{logo.name}</span>
              </div>
            ))}
          </div>

          {/* Gradients to fade edges */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-dark-bg to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-dark-bg to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Testimonials Bento Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-left mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mb-4">
            Hear from our placement network.
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl font-light">
            Read the experiences of leading executives and high-caliber specialists who found their home or scaled their core teams through our curated agency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="group flex flex-col justify-between p-6 rounded-2xl bg-[#0b0b0e] border border-zinc-900/80 hover:border-zinc-800 transition-all duration-300"
            >
              <div className="mb-6">
                {/* Visual Quote mark */}
                <span className="block text-4xl font-serif text-brand-emerald/40 leading-none select-none mb-2">“</span>
                <p className="text-zinc-300 text-sm font-light leading-relaxed">
                  {testimonial.quote}
                </p>
              </div>

              {/* Author metadata */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-900/50">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="size-10 rounded-full object-cover border border-zinc-800"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-white font-semibold text-xs leading-none">
                    {testimonial.name}
                  </h4>
                  <p className="text-zinc-500 text-[11px] font-light mt-1">
                    {testimonial.role} at <span className="text-zinc-400 font-medium">{testimonial.company}</span>
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

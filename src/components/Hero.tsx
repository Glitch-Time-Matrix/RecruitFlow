import React from "react";
import { ArrowUpRight, Sparkles, Building2, TrendingUp, ShieldCheck } from "lucide-react";
import { AGENCY_STATS } from "../data";

interface HeroProps {
  onNavigateCandidate: () => void;
  onNavigateEmployer: () => void;
}

export default function Hero({ onNavigateCandidate, onNavigateEmployer }: HeroProps) {
  return (
    <section className="relative w-full py-16 md:py-24 px-6 grid-bg border-b border-dark-border overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] rounded-full bg-brand-emerald/10 blur-[100px] pointer-events-none pulse-glow-bg"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-brand-slate/10 blur-[110px] pointer-events-none pulse-glow-bg"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Core Narrative Heading & Calls to Action */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono font-medium text-zinc-300 mb-6">
            <span className="flex size-2 rounded-full bg-brand-emerald animate-pulse"></span>
            Premier Corporate Recruitment & Executive Staffing Agency
          </div>

          {/* Heading */}
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[58px] text-white tracking-tight leading-[1.08] mb-6">
            Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald to-brand-slate">exceptional talent</span> with world-class enterprises.
          </h1>

          {/* Subheadline */}
          <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed mb-8 max-w-xl">
            Aura Staffing Agency delivers specialized permanent, contract, and executive recruitment solutions across Healthcare, Technology, Manufacturing, Finance, Construction, and Engineering.
          </p>

          {/* Primary and Secondary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full max-w-md mb-10">
            <button
              onClick={onNavigateCandidate}
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-slate text-black font-semibold text-sm tracking-tight hover:opacity-95 shadow-lg shadow-brand-emerald/10 transition-all duration-200"
            >
              <Sparkles className="size-4 text-black" />
              Submit Resume
              <ArrowUpRight className="size-4 text-black" />
            </button>
            <button
              onClick={onNavigateEmployer}
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700 font-semibold text-sm tracking-tight transition-all duration-200"
            >
              <Building2 className="size-4 text-brand-slate" />
              Hire Talent
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-500 font-light pt-2 border-t border-zinc-900/80 w-full max-w-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand-emerald" />
              <span>90-Day Retention Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand-slate" />
              <span>Confidential Executive Search</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-zinc-400" />
              <span>100% Vetted Candidates</span>
            </div>
          </div>
        </div>

        {/* Corporate Workspace Visual Panel */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center">
          <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden border border-zinc-800 shadow-2xl">
            {/* Status overlay */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
              <span className="flex size-2 rounded-full bg-brand-emerald animate-ping"></span>
              <p className="font-mono text-xs text-white tracking-tight">Vetted Talent Database Active</p>
            </div>

            {/* Corporate Staffing Image */}
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" 
              alt="Aura Corporate Recruitment Headquarters"
              className="absolute inset-0 size-full object-cover scale-[1.01] hover:scale-105 transition-transform duration-[4000ms] ease-out-quint"
            />

            {/* Subtle Gradient Veil */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent opacity-90"></div>

            {/* Live Performance Panel */}
            <div className="absolute bottom-6 left-6 right-6 z-20 p-5 rounded-2xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-800 text-brand-emerald">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Rapid Executive & Specialist Search</h4>
                  <p className="text-zinc-400 text-xs font-light mt-0.5">Average qualified shortlist presented in 48-72 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Agency Stats Bar */}
      <div id="stats" className="max-w-7xl mx-auto mt-20 pt-12 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
        {AGENCY_STATS.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-start text-left">
            <span className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight leading-none mb-2">
              {stat.value}
            </span>
            <span className="text-brand-emerald font-semibold text-xs tracking-tight uppercase mb-1">
              {stat.label}
            </span>
            <span className="text-zinc-500 text-xs font-light max-w-[180px]">
              {stat.desc}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}


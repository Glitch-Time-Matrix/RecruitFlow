import React from "react";
import { Building2, ShieldCheck, Award, Users, Target, Heart, Eye, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { LEADERSHIP_TEAM, AGENCY_STATS } from "../data";

interface AboutPageProps {
  onNavigateCandidate: () => void;
  onNavigateEmployer: () => void;
}

export default function AboutPage({ onNavigateCandidate, onNavigateEmployer }: AboutPageProps) {
  return (
    <div className="w-full bg-[#070709] text-white py-16 sm:py-24 px-6 text-left">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Header Hero */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-emerald block">
            About Aura Staffing Agency
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-tight">
            Architecting modern corporate workforces with mathematical precision.
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed">
            Founded by veteran corporate recruiters and talent acquisition strategists, Aura Staffing Agency bridges specialized human expertise with rigorous vetting frameworks to eliminate bad hires and accelerate organizational growth.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Replacing fragmented recruitment with structured partnership.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
              Traditional staffing agencies flood hiring managers with hundreds of unvetted resumes, creating friction, wasted interviews, and high attrition. At Aura, we operate as a confidential talent advisor.
            </p>
            <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
              Our 5-point evaluation framework analyzes technical competency, leadership trajectory, cultural alignment, background compliance, and long-term retention probability before presenting a single candidate.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <ShieldCheck className="size-6 text-brand-emerald mb-2" />
                <h4 className="text-white font-semibold text-sm mb-1">Confidential Headhunting</h4>
                <p className="text-zinc-500 text-xs font-light">Discreet executive mapping for sensitive corporate replacements.</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <Award className="size-6 text-brand-slate mb-2" />
                <h4 className="text-white font-semibold text-sm mb-1">90-Day Guarantee</h4>
                <p className="text-zinc-500 text-xs font-light">Complete placement insurance and replacement assurance policy.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Aura Executive Leadership Meeting"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 backdrop-blur-md">
                <span className="text-brand-emerald text-xs font-mono font-semibold block">Headquarters & Global Desk</span>
                <span className="text-white font-semibold text-sm block mt-0.5">Managing 450+ Active Corporate Accounts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-zinc-900">
          <div className="p-8 rounded-3xl bg-[#09090d] border border-zinc-800/80 space-y-3">
            <div className="size-10 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center">
              <Target className="size-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Our Mission</h3>
            <p className="text-zinc-400 text-xs font-light leading-relaxed">
              To empower organizations with transformative talent while providing candidates with career opportunities that align with their highest potential.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#09090d] border border-zinc-800/80 space-y-3">
            <div className="size-10 rounded-xl bg-brand-slate/10 text-brand-slate flex items-center justify-center">
              <Eye className="size-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Our Vision</h3>
            <p className="text-zinc-400 text-xs font-light leading-relaxed">
              To define the global gold standard in corporate staffing, recognized for integrity, speed, zero-attrition placement rates, and human craftsmanship.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#09090d] border border-zinc-800/80 space-y-3">
            <div className="size-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center">
              <Heart className="size-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Core Values</h3>
            <p className="text-zinc-400 text-xs font-light leading-relaxed">
              Uncompromising integrity, radical transparency in compensation, continuous market benchmarking, and relentless client dedication.
            </p>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="space-y-8 pt-8 border-t border-zinc-900">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-emerald block mb-2">
              Executive Leadership
            </span>
            <h2 className="font-display font-bold text-3xl text-white">
              Meet our Senior Recruitment Directors
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm font-light mt-1 max-w-xl">
              Seasoned industry advisors leading our specialized vertical staffing divisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LEADERSHIP_TEAM.map((member, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-[#09090d] border border-zinc-800/80 space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden border border-zinc-800">
                  <img src={member.image} alt={member.name} className="size-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{member.name}</h3>
                  <p className="text-brand-emerald font-mono text-xs font-semibold mt-0.5">{member.role}</p>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed mt-2">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h3 className="font-display font-bold text-2xl text-white mb-2">Ready to partner with Aura Staffing?</h3>
            <p className="text-zinc-400 text-xs font-light max-w-md">Contact our corporate recruitment team or submit your candidate credentials today.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onNavigateCandidate}
              className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition-colors"
            >
              Submit Candidate Resume
            </button>
            <button
              onClick={onNavigateEmployer}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-slate text-black text-xs font-bold transition-opacity hover:opacity-90"
            >
              Request Employer Staffing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

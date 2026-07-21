import React from "react";
import { CheckCircle2, ShieldCheck, ArrowRight, UserCheck, Briefcase, Building2, Users, GraduationCap, DollarSign, Layers } from "lucide-react";
import { RECRUITMENT_SERVICES } from "../data";

interface ServicesPageProps {
  onNavigateEmployer: () => void;
}

export default function ServicesPage({ onNavigateEmployer }: ServicesPageProps) {
  const serviceIcons = [
    <UserCheck className="size-6 text-brand-emerald" />,
    <Briefcase className="size-6 text-brand-slate" />,
    <ShieldCheck className="size-6 text-brand-emerald" />,
    <Users className="size-6 text-brand-slate" />,
    <GraduationCap className="size-6 text-brand-emerald" />,
    <DollarSign className="size-6 text-brand-slate" />,
    <Layers className="size-6 text-brand-emerald" />,
  ];

  return (
    <div className="w-full bg-[#070709] text-white py-16 sm:py-24 px-6 text-left">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-emerald block">
            Specialized Recruitment Solutions
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-tight">
            Corporate Staffing Services Built for Operational Excellence.
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed">
            Whether filling a single confidential executive seat or deploying hundreds of specialized contract personnel across regional facilities, our recruitment practices deliver guaranteed fit.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RECRUITMENT_SERVICES.map((service, idx) => (
            <div 
              key={service.id} 
              className="p-8 rounded-3xl bg-[#09090d] border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 w-fit">
                  {serviceIcons[idx % serviceIcons.length]}
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-brand-emerald transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-brand-slate text-xs font-mono font-medium mt-1">
                    {service.tagline}
                  </p>
                </div>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Key Service Value</span>
                  {service.keyBenefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="size-3.5 text-brand-emerald shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900/80 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 font-light">Ideal for: {service.idealFor}</span>
                <button
                  onClick={onNavigateEmployer}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
                  title="Inquire about this service"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="p-10 rounded-3xl bg-zinc-950 border border-brand-emerald/30 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="text-brand-emerald font-mono text-xs font-semibold uppercase tracking-wider block">
              Placement Protection Assurance
            </span>
            <h3 className="font-display font-bold text-2xl text-white">
              Every permanent placement comes with our 90-Day Guarantee.
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
              If a placed candidate leaves or fails to meet established performance milestones within 90 days, Aura Staffing Agency will source and onboard a fully qualified replacement at zero additional client fee.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button
              onClick={onNavigateEmployer}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-slate text-black font-bold text-xs tracking-tight hover:opacity-95 shadow-lg transition-all"
            >
              Request Employer Consultation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

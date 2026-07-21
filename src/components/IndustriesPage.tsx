import React from "react";
import { ArrowUpRight, CheckCircle2, Stethoscope, Laptop, Factory, HardHat, ShoppingBag, Landmark, Utensils, Truck, Zap, Car } from "lucide-react";
import { INDUSTRIES_SERVED } from "../data";

interface IndustriesPageProps {
  onNavigateCandidate: () => void;
  onNavigateEmployer: () => void;
}

export default function IndustriesPage({ onNavigateCandidate, onNavigateEmployer }: IndustriesPageProps) {
  const industryIcons: Record<string, React.ReactNode> = {
    "Healthcare & Life Sciences": <Stethoscope className="size-6 text-brand-emerald" />,
    "IT & Software Engineering": <Laptop className="size-6 text-brand-slate" />,
    "Manufacturing & Industrial": <Factory className="size-6 text-brand-emerald" />,
    "Construction & Real Estate": <HardHat className="size-6 text-brand-slate" />,
    "Retail & E-Commerce": <ShoppingBag className="size-6 text-brand-emerald" />,
    "Finance & Banking": <Landmark className="size-6 text-brand-slate" />,
    "Hospitality & Food Service": <Utensils className="size-6 text-brand-emerald" />,
    "Logistics & Supply Chain": <Truck className="size-6 text-brand-slate" />,
    "Engineering & Energy": <Zap className="size-6 text-brand-emerald" />,
    "Automotive & Mobility": <Car className="size-6 text-brand-slate" />,
  };

  return (
    <div className="w-full bg-[#070709] text-white py-16 sm:py-24 px-6 text-left">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-emerald block">
            Specialized Industry Vertical Practices
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-tight">
            Deep domain expertise across high-demand sectors.
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed">
            Generic recruitment fails in specialized verticals. Our staffing practices are managed by recruiters with direct field background in Healthcare, IT, Manufacturing, Construction, and Finance.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INDUSTRIES_SERVED.map((ind) => (
            <div 
              key={ind.id}
              className="p-8 rounded-3xl bg-[#09090d] border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 space-y-6 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                    {industryIcons[ind.name] || <Factory className="size-6 text-brand-emerald" />}
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                    Active Desk
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-brand-emerald transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed mt-2">
                    {ind.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Frequently Placed Positions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ind.typicalRoles.map((role, rIdx) => (
                      <span key={rIdx} className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900/80 flex items-center justify-between">
                <button
                  onClick={onNavigateCandidate}
                  className="text-xs text-brand-emerald hover:underline font-semibold flex items-center gap-1"
                >
                  Apply to Sector
                  <ArrowUpRight className="size-3.5" />
                </button>
                <button
                  onClick={onNavigateEmployer}
                  className="text-xs text-zinc-400 hover:text-white font-semibold"
                >
                  Hire in Sector &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Industry Banner */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h3 className="font-display font-bold text-2xl text-white mb-2">Need a custom niche industry search?</h3>
            <p className="text-zinc-400 text-xs font-light max-w-md">Our executive search team can execute custom headhunting assignments for specialized technical domains.</p>
          </div>
          <button
            onClick={onNavigateEmployer}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-slate text-black font-bold text-xs tracking-tight hover:opacity-95 shadow-lg transition-all"
          >
            Speak to an Industry Executive
          </button>
        </div>

      </div>
    </div>
  );
}

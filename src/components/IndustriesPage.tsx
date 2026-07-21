import React from "react";
import { ArrowUpRight, CheckCircle2, Stethoscope, Laptop, Factory, HardHat, ShoppingBag, Landmark, Utensils, Truck, Zap, Car } from "lucide-react";
import { INDUSTRIES_SERVED } from "../data";

interface IndustriesPageProps {
  onNavigateCandidate: () => void;
  onNavigateEmployer: () => void;
}

export default function IndustriesPage({ onNavigateCandidate, onNavigateEmployer }: IndustriesPageProps) {
  const industryIcons: Record<string, React.ReactNode> = {
    "Healthcare & Life Sciences": <Stethoscope className="size-6 text-accent" />,
    "IT & Software Engineering": <Laptop className="size-6 text-primary" />,
    "Manufacturing & Industrial": <Factory className="size-6 text-accent" />,
    "Construction & Real Estate": <HardHat className="size-6 text-primary" />,
    "Retail & E-Commerce": <ShoppingBag className="size-6 text-accent" />,
    "Finance & Banking": <Landmark className="size-6 text-primary" />,
    "Hospitality & Food Service": <Utensils className="size-6 text-accent" />,
    "Logistics & Supply Chain": <Truck className="size-6 text-primary" />,
    "Engineering & Energy": <Zap className="size-6 text-accent" />,
    "Automotive & Mobility": <Car className="size-6 text-primary" />,
  };

  return (
    <div className="bg-background min-h-screen text-foreground pb-24 text-left">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono font-medium text-primary mb-6 shadow-sm">
          <span className="flex size-2 rounded-full bg-accent animate-pulse"></span>
          Specialized Industry Vertical Practices
        </div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground tracking-tight leading-tight max-w-3xl mb-6">
          Deep domain expertise across <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">high-demand sectors</span>.
        </h1>
        <p className="text-foreground/70 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
          Generic recruitment fails in specialized verticals. Our staffing practices are managed by recruiters with direct field background in Healthcare, IT, Manufacturing, Construction, and Finance.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INDUSTRIES_SERVED.map((ind) => (
            <div 
              key={ind.id}
              className="p-8 rounded-3xl bg-white border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 space-y-6 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-muted border border-border group-hover:bg-primary/5 transition-colors">
                    {industryIcons[ind.name] || <Factory className="size-6 text-accent" />}
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-muted border border-border text-foreground/70 shadow-sm">
                    Active Desk
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-foreground/70 text-xs font-light leading-relaxed mt-2">
                    {ind.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/60 block">Frequently Placed Positions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ind.typicalRoles.map((role, rIdx) => (
                      <span key={rIdx} className="text-[11px] px-2.5 py-1 rounded-lg bg-background border border-border text-foreground/80 shadow-sm">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <button
                  onClick={onNavigateCandidate}
                  className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Apply to Sector
                  <ArrowUpRight className="size-3.5" />
                </button>
                <button
                  onClick={onNavigateEmployer}
                  className="text-xs text-foreground/60 hover:text-primary font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Hire in Sector &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Industry Banner */}
        <div className="p-10 md:p-16 rounded-[2.5rem] bg-white border border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-3">Need a custom niche industry search?</h3>
            <p className="text-foreground/70 font-light max-w-xl">Our executive search team can execute custom headhunting assignments for specialized technical domains.</p>
          </div>
          <div className="shrink-0">
            <button
              onClick={onNavigateEmployer}
              className="px-8 py-4 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Speak to an Industry Executive
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

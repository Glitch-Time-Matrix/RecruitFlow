"use client";
import React, { useState } from "react";
import { Building2, Sparkles, Send, CheckCircle2, ChevronRight, HelpCircle, DollarSign, BrainCircuit, Users } from "lucide-react";
import { EmployerSpec } from "@/lib/types";

export default function EmployerPortal() {
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("11-50 employees");
  const [targetHireText, setTargetHireText] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spec, setSpec] = useState<EmployerSpec | null>(null);

  // Sample templates to load for rapid user testing
  const SAMPLES = [
    {
      title: "Interactive UI Lead",
      company: "Cosmos Design Studio",
      text: "We need a principal design-focused engineer to craft custom layouts, elegant typography grids, and rich responsive interactive canvases. They must love negative space and have deep React performance experience."
    },
    {
      title: "Quantitative Dev",
      company: "Aether Capitals",
      text: "We require an expert with deep systems knowledge of Linux containers, Node server-side proxies, custom bundlers like esbuild, and scalable microservices. Must be highly analytical."
    },
    {
      title: "Cultural Creative Lead",
      company: "Loom lifestyle",
      text: "Looking for an editorial lead to manage high-end lifestyle campaigns, photoshoots in cultural hubs like Paris, and social-first media curation. They will own the aesthetic direction entirely."
    }
  ];

  const loadSample = (sample: typeof SAMPLES[0]) => {
    setCompanyName(sample.company);
    setTargetHireText(sample.text);
  };

  const handleGeneratePipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetHireText.trim()) {
      setError("Please describe the kind of talent you are looking to hire.");
      return;
    }

    setLoading(true);
    setError(null);
    setSpec(null);

    try {
      const response = await fetch("/api/employer-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, companySize, targetHireText })
      });

      if (!response.ok) {
        throw new Error("Unable to execute talent specification pipeline.");
      }

      const data = await response.json();
      setSpec(data);
    } catch (err: any) {
      console.error(err);
      setError("Talent Spec Engine failed. Please ensure environment variables are configured and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side - Employer Requirements Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-white border border-border text-left shadow-sm">
            <h3 className="text-foreground font-semibold text-lg mb-2 flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              Talent Pipeline Architect
            </h3>
            <p className="text-foreground/70 text-xs font-light mb-6">
              Describe your target profile in plain words. Our agency's AI intelligence will design a targeted sourcing spec, estimated base salaries, and screening heuristics.
            </p>

            {/* Quick Sourcing Prompts */}
            <div className="mb-6">
              <span className="block text-foreground/50 text-[10px] font-mono uppercase tracking-wider mb-2">
                Quick Sourcing Requirements Templates
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadSample(sample)}
                    className="px-3 py-1.5 rounded-lg bg-muted border border-border text-[11px] font-medium text-foreground/80 hover:border-primary/50 hover:bg-white shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGeneratePipeline} className="space-y-5">
              
              {/* Company Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-foreground/80 text-xs font-semibold mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Stripe, Linear"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-foreground/40 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm outline-none transition-all duration-200"
                  />
                </div>
                <div className="relative">
                  <label className="block text-foreground/80 text-xs font-semibold mb-2">
                    Company Scale
                  </label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary shadow-sm outline-none appearance-none cursor-pointer transition-all duration-200"
                  >
                    <option value="1-10 employees">1-10 (Seed Stage)</option>
                    <option value="11-50 employees">11-50 (Scaleup)</option>
                    <option value="51-200 employees">51-200 (Series B-C)</option>
                    <option value="200+ employees">200+ (Enterprise)</option>
                  </select>
                  <div className="pointer-events-none absolute bottom-2.5 right-3 flex items-center text-foreground/40">
                    <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>

              {/* Requirement descriptions */}
              <div>
                <label className="block text-foreground/80 text-xs font-semibold mb-2">
                  Describe the Target Hire
                </label>
                <textarea
                  value={targetHireText}
                  onChange={(e) => setTargetHireText(e.target.value)}
                  placeholder="Describe your ideal candidate. What would they work on first? What are the core challenges or unique aesthetic preferences required for this role?"
                  className="w-full h-44 px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs font-light placeholder:text-foreground/40 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm outline-none transition-colors duration-200 resize-none"
                />
              </div>

              {/* Hiring Solutions Type */}
              <div className="p-4 rounded-xl bg-muted border border-border space-y-3 shadow-sm">
                <span className="block text-foreground/60 text-[9px] font-mono uppercase tracking-wider font-semibold">
                  Selected Agency Placement Type
                </span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-foreground/80 text-xs cursor-pointer select-none">
                    <input type="radio" name="solution" defaultChecked className="accent-primary w-4 h-4" />
                    Direct Executive Search
                  </label>
                  <label className="flex items-center gap-2 text-foreground/80 text-xs cursor-pointer select-none">
                    <input type="radio" name="solution" className="accent-primary w-4 h-4" />
                    Retained Contract Team
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || !targetHireText}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-foreground/40 transition-colors duration-200 font-semibold tracking-tight text-white text-xs flex items-center justify-center gap-2 select-none shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {loading ? "Architecting Sourcing Spec..." : "Generate Pipeline Strategy"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Sourcing specification response panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {loading ? (
            /* Loading State */
            <div className="p-8 rounded-2xl bg-white border border-border shadow-sm min-h-[463px] flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="flex gap-1">
                  <span className="size-2 rounded-full bg-primary animate-pulse delay-0"></span>
                  <span className="size-2 rounded-full bg-primary animate-pulse delay-150"></span>
                  <span className="size-2 rounded-full bg-primary animate-pulse delay-300"></span>
                </div>
              </div>
              <p className="text-foreground text-sm font-semibold mb-1">
                Consulting Sourcing Frameworks
              </p>
              <p className="text-foreground/70 text-xs font-light max-w-xs leading-relaxed">
                Gemini is translating casual requirements into strict candidate spec variables, market comp bands, and interview screening strategies...
              </p>
            </div>
          ) : error ? (
            <div className="p-8 rounded-2xl bg-red-50 border border-red-200 shadow-sm min-h-[463px] flex flex-col items-center justify-center text-center">
              <p className="text-red-700 text-sm font-semibold mb-2">Something went wrong</p>
              <p className="text-red-600 text-xs font-light max-w-xs">{error}</p>
            </div>
          ) : spec ? (
            /* Sourcing Spec Generated State */
            <div className="space-y-6 text-left">
              <div className="mb-2">
                <h3 className="text-foreground font-semibold text-lg">
                  Target Candidate Profile Specification
                </h3>
                <p className="text-foreground/70 text-xs font-light">
                  Direct search mapping constructed by our staffing matching heuristics.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-border hover:border-primary/50 shadow-sm transition-all duration-300 space-y-6">
                {/* Header Title / Salary */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-border">
                  <div>
                    <h4 className="text-foreground font-bold text-lg">
                      {spec.idealTitle}
                    </h4>
                    <p className="text-foreground/60 text-xs font-mono font-medium mt-1 uppercase tracking-wider">
                      Ideal Placement Architecture
                    </p>
                  </div>
                  <div className="flex items-center gap-2 py-1.5 px-3.5 rounded-xl bg-muted border border-border">
                    <DollarSign className="size-4 text-primary" />
                    <span className="text-foreground text-xs font-semibold font-mono tracking-tight">
                      {spec.estimatedBaseSalary}
                    </span>
                  </div>
                </div>

                {/* Sourcing Strategy & Sourcing Pools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <span className="block text-foreground/60 text-[10px] font-mono uppercase tracking-wider mb-2 font-semibold">
                      Sourcing Strategy
                    </span>
                    <p className="text-foreground/80 text-xs font-light leading-relaxed">
                      {spec.sourcingStrategy}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <span className="block text-foreground/60 text-[10px] font-mono uppercase tracking-wider mb-2 font-semibold">
                      Target Competencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {spec.requiredSkills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 rounded bg-white border border-border text-foreground/80 font-mono text-[10px] shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Market insights */}
                <div className="p-4 rounded-xl bg-muted border border-border">
                  <span className="block text-foreground/60 text-[10px] font-mono uppercase tracking-wider mb-1 font-semibold">
                    Market Pool Insights
                  </span>
                  <p className="text-foreground/80 text-xs font-light leading-relaxed">
                    {spec.marketInsights}
                  </p>
                </div>

                {/* Screening questions */}
                <div className="space-y-3">
                  <span className="block text-foreground/60 text-[10px] font-mono uppercase tracking-wider">
                    Recommended Technical Screening Heuristics
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {spec.screeningQuestions.map((question, idx) => (
                      <div key={idx} className="flex gap-3 p-3 rounded-lg bg-white border border-border shadow-sm">
                        <span className="text-primary font-mono text-xs font-semibold select-none">
                          Q{idx + 1}
                        </span>
                        <p className="text-foreground/80 text-xs font-light leading-snug">
                          {question}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Launch Campaign */}
                <div className="pt-4 flex justify-between items-center gap-4 border-t border-border">
                  <p className="text-foreground/60 text-[11px] font-light">
                    Sourcing spec compiled successfully. Initiate search to begin receiving matched CVs.
                  </p>
                  <button 
                    onClick={() => alert(`A targeted placement campaign has been launched for "${spec.idealTitle}". We will deliver matched candidate specifications to you directly.`)}
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors duration-200 text-xs font-bold font-display select-none tracking-tight flex items-center gap-1.5 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    Initiate Active Sourcing
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty state prior to submit */
            <div className="p-8 rounded-2xl bg-white border border-border shadow-sm min-h-[463px] flex flex-col items-center justify-center text-center">
              <div className="p-3 rounded-xl bg-muted border border-border text-foreground/40 mb-4 shadow-sm">
                <Users className="size-6" />
              </div>
              <p className="text-foreground text-sm font-semibold mb-1">
                Awaiting Target Requirements
              </p>
              <p className="text-foreground/70 text-xs font-light max-w-xs leading-relaxed">
                Describe the profile specifications of the talent you require on the left. Our specialized algorithms will immediately map compensation benchmarks and screening logic.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
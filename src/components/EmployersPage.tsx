import React, { useState } from "react";
import EmployerHiringRequestForm from "./EmployerHiringRequestForm";
import EmployerPortal from "./EmployerPortal";
import { Building2, FileText, Cpu } from "lucide-react";

export default function EmployersPage() {
  const [activeTab, setActiveTab] = useState<"request" | "ai_architect">("request");

  return (
    <div className="w-full bg-[#070709] text-white py-12 sm:py-20 px-6 text-left">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Hero */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-slate block">
            Employer & Client Services Portal
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Deploy Top-Tier Talent into Your Enterprise.
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
            Submit your hiring specifications directly to our senior account managers or utilize our AI Job Specification Architect to refine candidate requirements.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-950 border border-zinc-800 w-fit">
          <button
            onClick={() => setActiveTab("request")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
              activeTab === "request"
                ? "bg-zinc-800 text-white shadow-md border border-zinc-700"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Building2 className="size-4 text-brand-slate" />
            Employer Hiring Request Form
          </button>
          <button
            onClick={() => setActiveTab("ai_architect")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
              activeTab === "ai_architect"
                ? "bg-zinc-800 text-white shadow-md border border-zinc-700"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Cpu className="size-4 text-brand-emerald" />
            AI Specification Architect
          </button>
        </div>

        {/* Content Display */}
        {activeTab === "request" ? (
          <EmployerHiringRequestForm />
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
              <span className="text-brand-slate font-mono font-semibold uppercase tracking-wider block mb-1">
                Interactive Spec Generation Tool
              </span>
              Architect rigorous job descriptions, essential screening questions, and market salary benchmarks in seconds.
            </div>
            <EmployerPortal />
          </div>
        )}

      </div>
    </div>
  );
}

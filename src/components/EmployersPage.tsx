import React, { useState } from "react";
import EmployerHiringRequestForm from "./EmployerHiringRequestForm";
import EmployerPortal from "./EmployerPortal";
import { Building2, FileText, Cpu } from "lucide-react";

export default function EmployersPage() {
  const [activeTab, setActiveTab] = useState<"request" | "ai_architect">("request");

  return (
    <div className="w-full bg-background text-foreground py-12 sm:py-20 px-6 text-left">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Hero */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary block">
            Employer & Client Services Portal
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
            Deploy Top-Tier Talent into Your Enterprise.
          </h1>
          <p className="text-foreground/70 text-xs sm:text-sm font-light leading-relaxed">
            Submit your hiring specifications directly to our senior account managers or utilize our AI Job Specification Architect to refine candidate requirements.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/50 border border-border w-fit shadow-sm">
          <button
            onClick={() => setActiveTab("request")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              activeTab === "request"
                ? "bg-white text-foreground shadow-sm border border-border"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <Building2 className={`size-4 ${activeTab === "request" ? "text-primary" : "text-foreground/40"}`} />
            Employer Hiring Request Form
          </button>
          <button
            onClick={() => setActiveTab("ai_architect")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              activeTab === "ai_architect"
                ? "bg-white text-foreground shadow-sm border border-border"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <Cpu className={`size-4 ${activeTab === "ai_architect" ? "text-secondary" : "text-foreground/40"}`} />
            AI Specification Architect
          </button>
        </div>

        {/* Content Display */}
        {activeTab === "request" ? (
          <EmployerHiringRequestForm />
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-muted border border-border text-xs text-foreground/70 shadow-sm">
              <span className="text-primary font-mono font-semibold uppercase tracking-wider block mb-1">
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

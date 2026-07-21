import React, { useState } from "react";
import CandidateRegistrationForm from "./CandidateRegistrationForm";
import CandidatePortal from "./CandidatePortal";
import { Sparkles, FileText, Cpu, CheckCircle2 } from "lucide-react";

interface CandidatesPageProps {
  prefilledJobTitle?: string;
}

export default function CandidatesPage({ prefilledJobTitle }: CandidatesPageProps) {
  const [activeTab, setActiveTab] = useState<"register" | "ai_align">("register");

  return (
    <div className="w-full bg-[#070709] text-white py-12 sm:py-20 px-6 text-left">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Hero */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-emerald block">
            Job Seeker & Candidate Portal
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Accelerate Your Career with Aura Executive Staffing.
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
            Submit your resume directly to our confidential candidate index or use our AI Alignment engine to evaluate your resume against active client positions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-950 border border-zinc-800 w-fit">
          <button
            onClick={() => setActiveTab("register")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
              activeTab === "register"
                ? "bg-zinc-800 text-white shadow-md border border-zinc-700"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FileText className="size-4 text-brand-emerald" />
            Candidate Registration Form
          </button>
          <button
            onClick={() => setActiveTab("ai_align")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
              activeTab === "ai_align"
                ? "bg-zinc-800 text-white shadow-md border border-zinc-700"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Cpu className="size-4 text-brand-slate" />
            AI Resume Alignment Engine
          </button>
        </div>

        {/* Content Display */}
        {activeTab === "register" ? (
          <CandidateRegistrationForm prefilledJobTitle={prefilledJobTitle} />
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
              <span className="text-brand-emerald font-mono font-semibold uppercase tracking-wider block mb-1">
                Interactive Resume Analysis Tool
              </span>
              Test your resume bullet points and experience against current open roles to receive instant match scores and interview preparation guides.
            </div>
            <CandidatePortal activeJobs={[]} />
          </div>
        )}

      </div>
    </div>
  );
}

"use client";
import React, { useState, useRef } from "react";
import CandidateRegistrationForm from "./CandidateRegistrationForm";
import CandidatePortal from "./CandidatePortal";
import { Sparkles, FileText, Cpu, CheckCircle2 } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface CandidatesPageProps {
  prefilledJobTitle?: string;
  jobId?: string;
}

export default function CandidatesPage({ prefilledJobTitle, jobId }: CandidatesPageProps) {
  const [activeTab, setActiveTab] = useState<"register" | "ai_align">("register");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".cand-header > *", {
      opacity: 0,
      y: 15,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    });

    gsap.from(".cand-content", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      delay: 0.2,
      ease: "power2.out"
    });
  }, { scope: containerRef, dependencies: [activeTab] });

  return (
    <div ref={containerRef} className="w-full bg-background text-foreground py-12 sm:py-20 px-6 text-left">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Hero */}
        <div className="cand-header max-w-3xl space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary block">
            Job Seeker & Candidate Portal
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
            Accelerate Your Career with RecruitFlow.
          </h1>
          <p className="text-foreground/70 text-xs sm:text-sm font-light leading-relaxed">
            Submit your resume directly to our confidential candidate index or use our AI Alignment engine to evaluate your resume against active client positions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="cand-header flex items-center gap-2 p-1.5 rounded-2xl bg-muted/50 border border-border w-fit shadow-sm">
          <button
            onClick={() => setActiveTab("register")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              activeTab === "register"
                ? "bg-white text-foreground shadow-sm border border-border"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <FileText className={`size-4 ${activeTab === "register" ? "text-primary" : "text-foreground/40"}`} />
            Candidate Registration Form
          </button>
          <button
            onClick={() => setActiveTab("ai_align")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              activeTab === "ai_align"
                ? "bg-white text-foreground shadow-sm border border-border"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <Cpu className={`size-4 ${activeTab === "ai_align" ? "text-secondary" : "text-foreground/40"}`} />
            AI Resume Alignment Engine
          </button>
        </div>

        {/* Content Display */}
        <div className="cand-content">
          {activeTab === "register" ? (
            <CandidateRegistrationForm prefilledJobTitle={prefilledJobTitle} jobId={jobId} />
          ) : (
            <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-muted border border-border text-xs text-foreground/70 shadow-sm">
              <span className="text-primary font-mono font-semibold uppercase tracking-wider block mb-1">
                Interactive Resume Analysis Tool
              </span>
              Test your resume bullet points and experience against current open roles to receive instant match scores and interview preparation guides.
            </div>
            <CandidatePortal activeJobs={[]} />
          </div>
        )}
        </div>

      </div>
    </div>
  );
}
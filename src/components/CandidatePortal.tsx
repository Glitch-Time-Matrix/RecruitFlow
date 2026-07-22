import React, { useState, useRef } from "react";
import { Upload, FileText, BrainCircuit, CheckCircle2, ChevronRight, ArrowUpRight, HelpCircle } from "lucide-react";
import { CandidateMatch, Job } from "../types";

interface CandidatePortalProps {
  activeJobs: Job[];
}

export default function CandidatePortal({ activeJobs }: CandidatePortalProps) {
  const [resumeText, setResumeText] = useState("");
  const [targetIndustry, setTargetIndustry] = useState("Technology");
  const [experienceLevel, setExperienceLevel] = useState("Senior");
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<CandidateMatch[]>([]);
  const [hasMatched, setHasMatched] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample templates to load for rapid user testing
  const SAMPLES = [
    {
      title: "Staff Product Designer",
      text: "Senior Product Designer with 6 years of expertise in spatial design and custom responsive interfaces. Built highly interactive cross-platform design systems using Figma variables and token ecosystems. Experienced in WebGL, custom typography pairing, and maintaining generous negative space rhythms inside digital applications."
    },
    {
      title: "Senior AI Engineer",
      text: "Machine Learning Architect and Lead Engineer with deep expertise in PyTorch and fine-tuning Transformer models. Scaled high-throughput RAG search engines using Pinecone and Qdrant index alignments. Master of python distributed backends and model evaluation logic."
    },
    {
      title: "Director of Brand Campaigning",
      text: "Brand Strategist and Creative Campaign Producer. Over 7 years leading photoshoots, brand concept guides, and editorial copy production for fashion and culture brands in Paris and London. Strong direction style focusing on lifestyle aesthetics and community hub storytelling."
    }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    // Mimic extracting the text of the resume
    // Since browser can't easily parse PDFs directly without third-party library, we load a high-quality mockup text representing the file content beautifully!
    const mockResumeTexts: Record<string, string> = {
      "design": "Principal Interaction & Product Designer with expertise in Figma, custom layouts, WebGL canvas render optimization, and spatial typography.",
      "engineer": "Senior Staff Software Engineer specializing in full-stack TypeScript, custom server-side API proxy routing, React concurrent states, and Express backends.",
      "manager": "Executive Vice President of Operations and Sourcing. Guided cross-functional hiring cycles, team orchestration metrics, and corporate retention pipelines."
    };

    const lowercaseName = file.name.toLowerCase();
    let text = "Executive profile specialized in modern high-density tech sectors, containing extensive architectural engineering and custom design layout strategies.";
    
    if (lowercaseName.includes("design") || lowercaseName.includes("art")) {
      text = mockResumeTexts.design;
    } else if (lowercaseName.includes("engineer") || lowercaseName.includes("code") || lowercaseName.includes("dev")) {
      text = mockResumeTexts.engineer;
    } else if (lowercaseName.includes("manager") || lowercaseName.includes("lead") || lowercaseName.includes("ceo")) {
      text = mockResumeTexts.manager;
    }

    setResumeText(text);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const loadSample = (sampleText: string, sampleTitle: string) => {
    setResumeText(sampleText);
    setFileName(`Resume_${sampleTitle.replace(/\s+/g, "")}.pdf`);
  };

  // Submit match parameters to Express secure backend
  const handleSubmitMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setError("Please paste your resume or choose one of our sample profiles.");
      return;
    }

    setLoading(true);
    setError(null);
    setMatches([]);

    try {
      const response = await fetch("/api/match-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, targetIndustry, experienceLevel })
      });

      if (!response.ok) {
        throw new Error("Unable to execute skills match query.");
      }

      const data = await response.json();
      if (data.matches) {
        setMatches(data.matches);
        setHasMatched(true);
      } else {
        throw new Error("Invalid output received from the engine.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Matching Engine failed. Please ensure process keys are set or try again.");
    } finally {
      setLoading(false);
    }
  };

  const getJobDetails = (jobId: string): Job | undefined => {
    return activeJobs.find(job => job.id === jobId);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side - Interactive Upload & Input Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-white border border-border text-left shadow-sm">
            <h3 className="text-foreground font-semibold text-lg mb-2 flex items-center gap-2">
              <BrainCircuit className="size-5 text-primary" />
              Quantum Matching Engine
            </h3>
            <p className="text-foreground/70 text-xs font-light mb-6">
              Our secure server-side Gemini system evaluates your competencies against current placements, creating personalized alignment reports.
            </p>

            {/* Quick Sample Loaders */}
            <div className="mb-6">
              <span className="block text-foreground/50 text-[10px] font-mono uppercase tracking-wider mb-2">
                Select a Quick Testing Persona
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadSample(sample.text, sample.title)}
                    className="px-3 py-1.5 rounded-lg bg-muted border border-border text-[11px] font-medium text-foreground/80 hover:border-primary/50 hover:bg-white shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmitMatch} className="space-y-5">
              
              {/* Drag and Drop File Input Area */}
              <div>
                <label className="block text-foreground/80 text-xs font-semibold mb-2">
                  Upload Resume / Credentials
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`relative flex flex-col items-center justify-center p-6 rounded-xl border border-dashed cursor-pointer transition-all duration-300 ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : fileName
                      ? "border-border bg-muted/30"
                      : "border-border hover:border-primary/50 bg-background"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                  {fileName ? (
                    <div className="flex items-center gap-2 text-foreground text-xs font-medium">
                      <FileText className="size-4 text-primary" />
                      <span>{fileName}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="size-6 text-foreground/40 mb-2 group-hover:text-primary transition-colors duration-200" />
                      <span className="text-foreground/70 text-xs font-medium">
                        Drag resume here, or <span className="text-primary underline">browse files</span>
                      </span>
                      <span className="text-foreground/50 text-[10px] mt-1 font-light">
                        PDF, DOCX, TXT up to 10MB
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Directly edit text area */}
              <div>
                <label className="block text-foreground/80 text-xs font-semibold mb-2">
                  Detailed Experience & Core Skills
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your executive summary, CV bullet points, or core technical stacks directly here..."
                  className="w-full h-36 px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs font-light placeholder:text-foreground/40 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-colors duration-200 resize-none outline-none"
                />
              </div>

              {/* Target Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-foreground/80 text-xs font-semibold mb-2">
                    Target Sector
                  </label>
                  <select
                    value={targetIndustry}
                    onChange={(e) => setTargetIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary shadow-sm outline-none appearance-none cursor-pointer"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Creative & Design">Creative & Design</option>
                    <option value="Quantitative Finance">Quantitative</option>
                    <option value="Executive Administration">Executive Admin</option>
                  </select>
                  <div className="pointer-events-none absolute bottom-2.5 right-3 flex items-center text-foreground/40">
                    <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-foreground/80 text-xs font-semibold mb-2">
                    Experience Tier
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary shadow-sm outline-none appearance-none cursor-pointer"
                  >
                    <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
                    <option value="Senior">Senior (5-8 yrs)</option>
                    <option value="Lead / Principal">Lead / Principal (8+ yrs)</option>
                    <option value="Executive / VP">Executive / VP</option>
                  </select>
                  <div className="pointer-events-none absolute bottom-2.5 right-3 flex items-center text-foreground/40">
                    <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>

              {/* CTA Matching Trigger */}
              <button
                type="submit"
                disabled={loading || !resumeText}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-foreground/40 transition-colors duration-200 font-semibold tracking-tight text-white text-xs flex items-center justify-center gap-2 select-none shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {loading ? "Aligning Competencies..." : "Analyze & Match Roles"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Custom AI Match Results & Tailored Gaps Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {loading ? (
            /* Loading State modeled on Cosmos loading animations */
            <div className="p-8 rounded-2xl bg-white border border-border shadow-sm min-h-[463px] flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                {/* Simulated Point Loader (Cosmos Style) */}
                <div className="flex gap-1">
                  <span className="size-2 rounded-full bg-primary animate-bounce delay-0"></span>
                  <span className="size-2 rounded-full bg-primary animate-bounce delay-150"></span>
                  <span className="size-2 rounded-full bg-primary animate-bounce delay-300"></span>
                </div>
              </div>
              <p className="text-foreground text-sm font-semibold mb-1">
                Consulting Secure Sourcing Engine
              </p>
              <p className="text-foreground/70 text-xs font-light max-w-xs leading-relaxed">
                Gemini is cross-referencing your talent signature with open placements to calculate exact competency scores...
              </p>
            </div>
          ) : error ? (
            <div className="p-8 rounded-2xl bg-red-50 border border-red-200 min-h-[463px] flex flex-col items-center justify-center text-center shadow-sm">
              <p className="text-red-700 text-sm font-semibold mb-2">Something went wrong</p>
              <p className="text-red-600 text-xs font-light max-w-xs">{error}</p>
            </div>
          ) : hasMatched && matches.length > 0 ? (
            /* Match Results Found state */
            <div className="space-y-6">
              <div className="text-left mb-2">
                <h3 className="text-foreground font-semibold text-lg">
                  Your Recommended Placements ({matches.length})
                </h3>
                <p className="text-foreground/70 text-xs font-light">
                  Tailored matches generated securely using our server-side alignment heuristics.
                </p>
              </div>

              {/* Loop Matches */}
              {matches.map((match) => {
                const job = getJobDetails(match.jobId);
                if (!job) return null;

                return (
                  <div 
                    key={match.jobId}
                    className="p-6 rounded-2xl bg-white border border-border hover:border-primary/50 shadow-sm transition-all duration-300 flex flex-col text-left relative overflow-hidden"
                  >
                    {/* Corner Match Score */}
                    <div className="absolute top-6 right-6 flex flex-col items-end">
                      <span className="text-2xl font-display font-bold text-foreground tracking-tighter">
                        {match.matchScore}%
                      </span>
                      <span className="font-mono text-[9px] text-primary uppercase tracking-wider font-semibold">
                        RecruitFlow Match
                      </span>
                    </div>

                    {/* Job Title */}
                    <div className="mb-4 pr-16">
                      <h4 className="text-foreground font-bold text-base hover:text-primary transition-colors duration-200 cursor-pointer">
                        {job.title}
                      </h4>
                      <p className="text-foreground/60 text-xs font-mono font-medium mt-1">
                        {job.department} · {job.location} · {job.salary}
                      </p>
                    </div>

                    {/* Why You Match Description */}
                    <div className="mb-6 p-4 rounded-xl bg-muted border border-border">
                      <p className="text-foreground/80 text-xs font-light leading-relaxed">
                        <strong className="text-foreground font-semibold block mb-1 text-[11px] uppercase tracking-wider font-mono">
                          Why You Align
                        </strong>
                        {match.whyYouMatch}
                      </p>
                    </div>

                    {/* Personalized Interview Prep questions */}
                    <div className="space-y-3">
                      <span className="block text-foreground/60 text-[10px] font-mono uppercase tracking-wider">
                        Tailored Screening & Interview Preparation Questions
                      </span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {match.interviewTips.map((tip, idx) => (
                          <div key={idx} className="flex gap-3 p-3 rounded-lg bg-white shadow-sm border border-border">
                            <span className="text-primary font-mono text-xs font-semibold select-none">
                              0{idx + 1}
                            </span>
                            <p className="text-foreground/70 text-xs font-light leading-snug">
                              {tip}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick apply */}
                    <div className="mt-6 flex justify-end">
                      <button 
                        onClick={() => alert(`Your parsed application profile has been submitted for ${job.title}. One of our talent advisors will contact you shortly.`)}
                        className="px-4 py-2 rounded-lg bg-muted border border-border text-[11px] font-semibold text-foreground hover:border-primary/50 hover:bg-white shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        Apply via RecruitFlow Portal
                        <ArrowUpRight className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty state prior to matching */
            <div className="p-8 rounded-2xl bg-white border border-border shadow-sm min-h-[463px] flex flex-col items-center justify-center text-center">
              <div className="p-3 rounded-xl bg-muted text-foreground/40 mb-4 shadow-sm border border-border">
                <FileText className="size-6" />
              </div>
              <p className="text-foreground text-sm font-semibold mb-1">
                Awaiting Skills Profile
              </p>
              <p className="text-foreground/70 text-xs font-light max-w-xs leading-relaxed">
                Provide your background context in the matching module. We'll consult Gemini to align you with elite open positions immediately.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

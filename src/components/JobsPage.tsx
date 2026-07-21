import React, { useState, useMemo, useRef } from "react";
import { Search, MapPin, DollarSign, Briefcase, Filter, Sparkles, Building2, Clock, CheckCircle2, ArrowUpRight, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { INITIAL_JOBS } from "../data";
import { Job } from "../types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface JobsPageProps {
  onApplyForJob: (jobTitle: string) => void;
}

export default function JobsPage({ onApplyForJob }: JobsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments");
  const [selectedType, setSelectedType] = useState<string>("All Types");
  const [selectedJobModal, setSelectedJobModal] = useState<Job | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header reveal
    gsap.from(".jobs-header > *", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });

    // Search & Filter reveal
    gsap.from(".jobs-search", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.2,
      ease: "power2.out"
    });

    // Job cards stagger
    gsap.from(".job-card", {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".jobs-grid",
        start: "top 85%"
      }
    });
  }, { scope: containerRef, dependencies: [filteredJobs] });

  const departmentsList = useMemo(() => {
    const list = Array.from(new Set(INITIAL_JOBS.map((p) => p.department)));
    return ["All Departments", ...list];
  }, []);

  const typesList = ["All Types", "Full-Time", "Contract Staffing", "Executive Search"];

  const filteredJobs = useMemo(() => {
    return INITIAL_JOBS.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = selectedDepartment === "All Departments" || job.department === selectedDepartment;
      const matchesType = selectedType === "All Types" || job.type.toLowerCase().includes(selectedType.toLowerCase());

      return matchesSearch && matchesDept && matchesType;
    });
  }, [searchTerm, selectedDepartment, selectedType]);

  return (
    <div ref={containerRef} className="bg-background min-h-screen text-foreground pb-24 text-left">
      <div className="max-w-7xl mx-auto space-y-12 px-6 pt-24">
        
        {/* Header Hero */}
        <div className="jobs-header max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono font-medium text-primary shadow-sm mb-2">
            <span className="flex size-2 rounded-full bg-accent animate-pulse"></span>
            Executive Job Directory
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground tracking-tight leading-tight">
            Active Client Opportunities & Placements.
          </h1>
          <p className="text-foreground/70 text-base sm:text-lg font-light leading-relaxed">
            Explore verified corporate, healthcare, engineering, and technology openings managed directly by Aura Staffing Agency recruiters.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="jobs-search p-6 rounded-3xl bg-white border border-border space-y-4 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
              <input
                type="text"
                placeholder="Search job title, skills, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-border text-foreground text-xs placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>

            {/* Department Selector */}
            <div className="md:col-span-3 relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none shadow-sm cursor-pointer"
              >
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-foreground/40">
                <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>

            {/* Employment Type Selector */}
            <div className="md:col-span-2 relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none shadow-sm cursor-pointer"
              >
                {typesList.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-foreground/40">
                <svg className="size-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>

            {/* Reset Button */}
            <div className="md:col-span-2">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDepartment("All Departments");
                  setSelectedType("All Types");
                }}
                className="w-full py-3 rounded-xl bg-muted hover:bg-muted/80 border border-border text-foreground/70 hover:text-foreground text-xs font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-foreground/50 pt-2 border-t border-border">
            <span>Showing <strong className="text-foreground font-semibold">{filteredJobs.length}</strong> active openings</span>
            <span className="text-[11px]">All roles actively managed by Aura Client Desk</span>
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="jobs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="job-card p-6 rounded-3xl bg-white border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/20 text-[10px] font-mono font-semibold">
                    {job.department}
                  </span>
                  <span className="text-[10px] font-mono text-foreground/50">
                    Confidential Client
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {job.title}
                </h3>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-foreground/70 pt-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-secondary" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="size-3.5 text-accent" />
                    <span className="truncate">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Briefcase className="size-3.5 text-foreground/40" />
                    <span>{job.type}</span>
                  </div>
                </div>

                <p className="text-xs text-foreground/70 font-light line-clamp-2 pt-2 border-t border-border">
                  {job.description}
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center gap-2">
                <button
                  onClick={() => setSelectedJobModal(job)}
                  className="flex-1 py-2.5 rounded-xl bg-white hover:bg-muted text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  View Job Details
                </button>
                <button
                  onClick={() => onApplyForJob(job.title)}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Apply
                  <ArrowUpRight className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedJobModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-left max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <button
                onClick={() => setSelectedJobModal(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white border border-border text-foreground/50 hover:text-foreground hover:bg-muted cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
              >
                <X className="size-5" />
              </button>

              <div>
                <span className="px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/20 text-xs font-mono font-semibold">
                  {selectedJobModal.department}
                </span>
                <h2 className="font-display font-bold text-2xl text-foreground mt-2">
                  {selectedJobModal.title}
                </h2>
                <p className="text-foreground/60 text-xs font-light mt-1">
                  Confidential Placement Client &bull; {selectedJobModal.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-muted border border-border text-xs">
                <div>
                  <span className="text-foreground/50 block text-[10px] uppercase tracking-wider font-mono mb-1">Salary Range</span>
                  <span className="text-accent font-semibold text-sm">{selectedJobModal.salary}</span>
                </div>
                <div>
                  <span className="text-foreground/50 block text-[10px] uppercase tracking-wider font-mono mb-1">Employment Type</span>
                  <span className="text-foreground font-medium text-sm">{selectedJobModal.type}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-foreground font-semibold text-xs uppercase tracking-wider font-mono">Role Overview</h4>
                <p className="text-foreground/70 text-xs leading-relaxed">{selectedJobModal.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-foreground font-semibold text-xs uppercase tracking-wider font-mono">Candidate Requirements</h4>
                <ul className="space-y-1.5">
                  {selectedJobModal.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-foreground/80">
                      <CheckCircle2 className="size-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button
                  onClick={() => setSelectedJobModal(null)}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-muted border border-border text-foreground text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors shadow-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const title = selectedJobModal.title;
                    setSelectedJobModal(null);
                    onApplyForJob(title);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary/90 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Submit Resume For Position
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

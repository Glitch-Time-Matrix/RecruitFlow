import React, { useState } from "react";
import { Search, Briefcase, MapPin, DollarSign, Calendar, ChevronDown, ChevronUp, Sparkles, Filter, CheckCircle2 } from "lucide-react";
import { Job } from "../types";

interface ActivePositionsProps {
  jobs: Job[];
  onSelectJobForMatching: (jobTitle: string) => void;
}

export default function ActivePositions({ jobs, onSelectJobForMatching }: ActivePositionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // Departments list for filter dropdown
  const DEPARTMENTS = ["All", "Engineering", "Creative & Design", "Executive & Creative", "Executive & Engineering", "Marketing"];
  const TYPES = ["All", "Full-Time", "Contract-to-Hire"];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requirements.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDept = selectedDept === "All" || job.department === selectedDept;
    const matchesType = selectedType === "All" || job.type === selectedType;

    return matchesSearch && matchesDept && matchesType;
  });

  const toggleExpandJob = (jobId: string) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
    }
  };

  return (
    <section id="active-roles" className="py-20 border-b border-border bg-background relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 text-left">
          <div>
            <span className="text-primary font-semibold text-xs tracking-widest uppercase block mb-2 font-mono">
              Live Placement Directory
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
              Explore Active Agency Placements
            </h2>
            <p className="text-foreground/70 text-sm font-light mt-1">
              Select one of our premier placements to align your CV and match your capabilities instantly.
            </p>
          </div>
          
          {/* Total counter */}
          <div className="px-4 py-2 rounded-xl bg-muted border border-border text-xs font-mono text-foreground/70 shadow-sm">
            Total Placements: <span className="text-foreground font-bold">{filteredJobs.length}</span> / {jobs.length}
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          {/* Search bar */}
          <div className="md:col-span-6 relative flex items-center">
            <Search className="absolute left-4 size-4 text-foreground/50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keywords, technical skills, or criteria..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-border text-foreground text-xs placeholder:text-foreground/50 focus:ring-2 focus:ring-accent/50 focus:border-transparent focus:outline-none transition-all duration-200 shadow-sm"
            />
          </div>

          {/* Department Filter */}
          <div className="md:col-span-3 relative flex items-center">
            <Filter className="absolute left-4 size-4 text-foreground/50" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-border text-foreground text-xs focus:ring-2 focus:ring-accent/50 focus:border-transparent focus:outline-none appearance-none cursor-pointer shadow-sm"
            >
              {DEPARTMENTS.map((dept, idx) => (
                <option key={idx} value={dept}>{dept === "All" ? "All Departments" : dept}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-border text-foreground text-xs focus:ring-2 focus:ring-accent/50 focus:border-transparent focus:outline-none appearance-none cursor-pointer text-left shadow-sm"
            >
              {TYPES.map((type, idx) => (
                <option key={idx} value={type}>{type === "All" ? "All Placement Types" : type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Directory Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => {
              const isExpanded = expandedJobId === job.id;

              return (
                <div 
                  key={job.id}
                  className={`p-6 rounded-2xl bg-white border transition-all duration-300 text-left ${
                    isExpanded 
                      ? "border-primary/30 shadow-lg ring-1 ring-primary/10" 
                      : "border-border shadow-sm hover:shadow-md hover:border-primary/20"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    
                    {/* Position Summary */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono text-[9px] font-semibold uppercase tracking-wider">
                          {job.department}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-muted border border-border text-foreground/70 font-mono text-[9px] font-semibold uppercase tracking-wider">
                          {job.type}
                        </span>
                      </div>
                      
                      <h3 className="text-foreground font-bold text-lg mb-2">
                        {job.title}
                      </h3>

                      <p className="text-foreground/70 text-xs font-light leading-relaxed max-w-3xl mb-4">
                        {job.description}
                      </p>

                      {/* Meta pills */}
                      <div className="flex flex-wrap gap-4 text-foreground/60 text-xs font-mono font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-foreground/50" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="size-3.5 text-foreground/50" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick CTAs */}
                    <div className="flex sm:flex-col items-stretch gap-2 shrink-0 max-sm:w-full">
                      <button
                        onClick={() => toggleExpandJob(job.id)}
                        className="px-4 py-2 rounded-xl bg-white border border-border text-foreground/80 hover:bg-muted hover:text-foreground text-xs font-semibold tracking-tight transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer min-h-[40px]"
                      >
                        {isExpanded ? (
                          <>
                            Hide Requirements
                            <ChevronUp className="size-3.5" />
                          </>
                        ) : (
                          <>
                            View Requirements
                            <ChevronDown className="size-3.5" />
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onSelectJobForMatching(job.title)}
                        className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white hover:border-transparent text-xs font-semibold tracking-tight transition-all duration-300 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer min-h-[40px]"
                      >
                        Match My CV
                        <Sparkles className="size-3.5" />
                      </button>
                    </div>

                  </div>

                  {/* Expanded Requirements list */}
                  {isExpanded && (
                    <div className="mt-6 pt-5 border-t border-border animate-enter">
                      <span className="block text-foreground/60 text-[10px] font-mono uppercase tracking-wider mb-3">
                        Ideal Candidate Requirements & Stack Focus
                      </span>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-foreground/80 text-xs font-light">
                            <span className="p-0.5 rounded-full bg-accent/15 text-accent shrink-0 mt-0.5">
                              <CheckCircle2 className="size-3" />
                            </span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search results state */
          <div className="p-12 rounded-2xl bg-muted/50 border border-border text-center shadow-sm">
            <p className="text-foreground font-semibold mb-1 text-sm">No Placements Found</p>
            <p className="text-foreground/70 text-xs font-light">Try expanding your search query or reset your department filters.</p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedDept("All"); setSelectedType("All"); }}
              className="mt-4 px-4 py-2.5 rounded-xl bg-white border border-border text-foreground/80 hover:bg-muted hover:text-foreground text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

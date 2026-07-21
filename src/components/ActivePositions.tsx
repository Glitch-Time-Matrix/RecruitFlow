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
    <section id="active-roles" className="py-20 border-b border-dark-border bg-dark-bg/50 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 text-left">
          <div>
            <span className="text-brand-emerald font-semibold text-xs tracking-widest uppercase block mb-2 font-mono">
              Live Placement Directory
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Explore Active Agency Placements
            </h2>
            <p className="text-zinc-500 text-sm font-light mt-1">
              Select one of our premier placements to align your CV and match your capabilities instantly.
            </p>
          </div>
          
          {/* Total counter */}
          <div className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-900 text-xs font-mono text-zinc-400">
            Total Placements: <span className="text-white font-bold">{filteredJobs.length}</span> / {jobs.length}
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          {/* Search bar */}
          <div className="md:col-span-6 relative flex items-center">
            <Search className="absolute left-4 size-4 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keywords, technical skills, or criteria..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-880 text-white text-xs placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Department Filter */}
          <div className="md:col-span-3 relative flex items-center">
            <Filter className="absolute left-4 size-4 text-zinc-500" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-880 text-white text-xs focus:border-zinc-700 focus:outline-none appearance-none cursor-pointer"
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
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-880 text-white text-xs focus:border-zinc-700 focus:outline-none appearance-none cursor-pointer text-left"
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
                  className={`p-6 rounded-2xl bg-[#0b0b0e] border transition-all duration-300 text-left ${
                    isExpanded 
                      ? "border-zinc-800 shadow-xl" 
                      : "border-zinc-900/60 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    
                    {/* Position Summary */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        <span className="px-2 py-0.5 rounded bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald font-mono text-[9px] font-semibold uppercase tracking-wider">
                          {job.department}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[9px] font-semibold uppercase tracking-wider">
                          {job.type}
                        </span>
                      </div>
                      
                      <h3 className="text-white font-bold text-lg mb-2">
                        {job.title}
                      </h3>

                      <p className="text-zinc-400 text-xs font-light leading-relaxed max-w-3xl mb-4">
                        {job.description}
                      </p>

                      {/* Meta pills */}
                      <div className="flex flex-wrap gap-4 text-zinc-500 text-xs font-mono font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-zinc-600" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="size-3.5 text-zinc-600" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick CTAs */}
                    <div className="flex sm:flex-col items-stretch gap-2 shrink-0 max-sm:w-full">
                      <button
                        onClick={() => toggleExpandJob(job.id)}
                        className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs font-semibold tracking-tight transition-all duration-200 flex items-center justify-center gap-1.5"
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
                        className="px-4 py-2 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald hover:bg-brand-emerald hover:text-black hover:border-transparent text-xs font-semibold tracking-tight transition-all duration-300 flex items-center justify-center gap-1.5"
                      >
                        Match My CV
                        <Sparkles className="size-3.5" />
                      </button>
                    </div>

                  </div>

                  {/* Expanded Requirements list */}
                  {isExpanded && (
                    <div className="mt-6 pt-5 border-t border-zinc-900/60 animate-enter">
                      <span className="block text-zinc-500 text-[10px] font-mono uppercase tracking-wider mb-3">
                        Ideal Candidate Requirements & Stack Focus
                      </span>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-zinc-300 text-xs font-light">
                            <span className="p-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald shrink-0 mt-0.5">
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
          <div className="p-12 rounded-2xl bg-zinc-950 border border-zinc-900 text-center">
            <p className="text-zinc-400 text-sm font-semibold mb-1">No Placements Found</p>
            <p className="text-zinc-600 text-xs font-light">Try expanding your search query or reset your department filters.</p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedDept("All"); setSelectedType("All"); }}
              className="mt-4 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-medium"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

import React, { useState, useMemo } from "react";
import { Search, MapPin, DollarSign, Briefcase, Filter, Sparkles, Building2, Clock, CheckCircle2, ArrowUpRight, X } from "lucide-react";
import { INITIAL_JOBS } from "../data";
import { Job } from "../types";

interface JobsPageProps {
  onApplyForJob: (jobTitle: string) => void;
}

export default function JobsPage({ onApplyForJob }: JobsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments");
  const [selectedType, setSelectedType] = useState<string>("All Types");
  const [selectedJobModal, setSelectedJobModal] = useState<Job | null>(null);

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
    <div className="w-full bg-[#070709] text-white py-16 sm:py-24 px-6 text-left">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Hero */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-emerald block">
            Executive Job Directory
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-tight">
            Active Client Opportunities & Placements.
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed">
            Explore verified corporate, healthcare, engineering, and technology openings managed directly by Aura Staffing Agency recruiters.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-6 rounded-3xl bg-[#09090d] border border-zinc-800/80 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search job title, skills, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-brand-emerald"
              />
            </div>

            {/* Department Selector */}
            <div className="md:col-span-3">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-brand-emerald"
              >
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Employment Type Selector */}
            <div className="md:col-span-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-brand-emerald"
              >
                {typesList.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="md:col-span-2">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDepartment("All Departments");
                  setSelectedType("All Types");
                }}
                className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-900">
            <span>Showing <strong className="text-white font-semibold">{filteredJobs.length}</strong> active openings</span>
            <span className="text-[11px]">All roles actively managed by Aura Client Desk</span>
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-3xl bg-[#09090d] border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 text-[10px] font-mono font-semibold">
                    {job.department}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Confidential Client
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white group-hover:text-brand-emerald transition-colors">
                  {job.title}
                </h3>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-brand-slate" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="size-3.5 text-brand-emerald" />
                    <span className="truncate">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Briefcase className="size-3.5 text-zinc-500" />
                    <span>{job.type}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 font-light line-clamp-2 pt-2 border-t border-zinc-900">
                  {job.description}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex items-center gap-2">
                <button
                  onClick={() => setSelectedJobModal(job)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-800 transition-colors"
                >
                  View Job Details
                </button>
                <button
                  onClick={() => onApplyForJob(job.title)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-slate text-black font-semibold text-xs transition-opacity hover:opacity-90 flex items-center gap-1"
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
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#09090d] border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-left max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <button
                onClick={() => setSelectedJobModal(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="size-5" />
              </button>

              <div>
                <span className="px-3 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 text-xs font-mono font-semibold">
                  {selectedJobModal.department}
                </span>
                <h2 className="font-display font-bold text-2xl text-white mt-2">
                  {selectedJobModal.title}
                </h2>
                <p className="text-zinc-400 text-xs font-light mt-1">
                  Confidential Placement Client &bull; {selectedJobModal.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[10px]">Salary Range</span>
                  <span className="text-brand-emerald font-semibold">{selectedJobModal.salary}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">Employment Type</span>
                  <span className="text-white font-medium">{selectedJobModal.type}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">Role Overview</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">{selectedJobModal.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">Candidate Requirements</h4>
                <ul className="space-y-1.5">
                  {selectedJobModal.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="size-3.5 text-brand-emerald shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedJobModal(null)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const title = selectedJobModal.title;
                    setSelectedJobModal(null);
                    onApplyForJob(title);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-slate text-black font-bold text-xs shadow-lg"
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

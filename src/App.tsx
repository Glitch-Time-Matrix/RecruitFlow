import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SocialProof from "./components/SocialProof";
import ActivePositions from "./components/ActivePositions";
import AboutPage from "./components/AboutPage";
import ServicesPage from "./components/ServicesPage";
import IndustriesPage from "./components/IndustriesPage";
import JobsPage from "./components/JobsPage";
import CandidatesPage from "./components/CandidatesPage";
import EmployersPage from "./components/EmployersPage";
import ContactPage from "./components/ContactPage";

import { PageView, Job } from "./types";
import { INITIAL_JOBS } from "./data";
import { ShieldCheck, ArrowRight, Building2, Globe, Sparkles } from "lucide-react";

export default function App() {
  const [activePage, setActivePage] = useState<PageView>("home");
  const [prefilledJobTitle, setPrefilledJobTitle] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);

  // Safely fetch open positions from backend
  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Backend offline");
      })
      .then((data) => {
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
        }
      })
      .catch(() => {
        console.log("Using static placement fallbacks.");
      });
  }, []);

  const handleApplyForJob = (jobTitle: string) => {
    setPrefilledJobTitle(jobTitle);
    setActivePage("candidates");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#f3f4f6] flex flex-col relative antialiased selection:bg-brand-emerald selection:text-black">
      
      {/* Header with full multi-page navigation */}
      <Header 
        activePage={activePage} 
        setActivePage={setActivePage}
        onNavigateToCandidateForm={() => {
          setPrefilledJobTitle("");
          setActivePage("candidates");
        }}
        onNavigateToEmployerForm={() => setActivePage("employers")}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col items-center">
        {activePage === "home" && (
          <div className="w-full flex flex-col items-center">
            {/* Hero Section */}
            <Hero 
              onNavigateCandidate={() => {
                setPrefilledJobTitle("");
                setActivePage("candidates");
              }}
              onNavigateEmployer={() => setActivePage("employers")}
            />

            {/* Featured Active Positions */}
            <ActivePositions 
              jobs={jobs} 
              onSelectJobForMatching={(title) => handleApplyForJob(title)} 
            />

            {/* Quick Agency Highlights */}
            <section className="py-20 px-6 w-full bg-[#09090d] border-b border-dark-border">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                  <div className="size-10 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-bold">
                    01
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">For Candidates</h3>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed">
                    Submit your resume confidentially to be matched with unlisted executive and technical opportunities across top corporate employers.
                  </p>
                  <button
                    onClick={() => setActivePage("candidates")}
                    className="text-xs text-brand-emerald hover:underline font-semibold pt-2 flex items-center gap-1"
                  >
                    Candidate Portal &rarr;
                  </button>
                </div>

                <div className="p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                  <div className="size-10 rounded-xl bg-brand-slate/10 text-brand-slate flex items-center justify-center font-bold">
                    02
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">For Employers</h3>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed">
                    Request executive headhunting, contract staffing, or bulk volume hiring with an average 48-72 hour vetted shortlist delivery.
                  </p>
                  <button
                    onClick={() => setActivePage("employers")}
                    className="text-xs text-brand-slate hover:underline font-semibold pt-2 flex items-center gap-1"
                  >
                    Employer Portal &rarr;
                  </button>
                </div>

                <div className="p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                  <div className="size-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center font-bold">
                    03
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">Guaranteed Retention</h3>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed">
                    Every permanent placement is backed by our 90-day replacement policy to ensure complete peace of mind for hiring leaders.
                  </p>
                  <button
                    onClick={() => setActivePage("about")}
                    className="text-xs text-zinc-300 hover:underline font-semibold pt-2 flex items-center gap-1"
                  >
                    About Our Agency &rarr;
                  </button>
                </div>
              </div>
            </section>

            {/* Social Proof & Testimonial Carousel */}
            <SocialProof />
          </div>
        )}

        {activePage === "about" && (
          <AboutPage 
            onNavigateCandidate={() => setActivePage("candidates")}
            onNavigateEmployer={() => setActivePage("employers")}
          />
        )}

        {activePage === "services" && (
          <ServicesPage 
            onNavigateEmployer={() => setActivePage("employers")}
          />
        )}

        {activePage === "industries" && (
          <IndustriesPage 
            onNavigateCandidate={() => setActivePage("candidates")}
            onNavigateEmployer={() => setActivePage("employers")}
          />
        )}

        {activePage === "jobs" && (
          <JobsPage 
            onApplyForJob={handleApplyForJob}
          />
        )}

        {activePage === "candidates" && (
          <CandidatesPage prefilledJobTitle={prefilledJobTitle} />
        )}

        {activePage === "employers" && (
          <EmployersPage />
        )}

        {activePage === "contact" && (
          <ContactPage />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#050507] border-t border-dark-border py-16 px-6 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
          
          {/* Logo & Agency Description */}
          <div className="md:col-span-4 flex flex-col items-start gap-4">
            <button
              onClick={() => { setActivePage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="flex items-center gap-3 text-left focus:outline-none"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-900 text-white font-bold text-sm select-none border border-zinc-800">
                Ω
              </div>
              <span className="font-display font-bold text-base tracking-tight text-white uppercase leading-none">
                AURA STAFFING
              </span>
            </button>
            <p className="text-zinc-500 text-xs font-light max-w-sm leading-relaxed">
              Premier executive recruitment and corporate staffing agency. Connecting high-caliber talent with industry-leading enterprises across Healthcare, Technology, Manufacturing, and Finance.
            </p>
            <div className="text-zinc-600 text-[10px] font-mono flex items-center gap-1.5">
              <Globe className="size-3 text-zinc-700" />
              Corporate Desk Active 24/7 &bull; Global Operations
            </div>
          </div>

          {/* Navigation Pages */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="text-white text-xs font-semibold font-mono uppercase tracking-wider">
              Navigation
            </h4>
            <div className="flex flex-col gap-2 text-xs text-zinc-400 font-light">
              <button onClick={() => { setActivePage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white text-left">Home</button>
              <button onClick={() => { setActivePage("about"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white text-left">About Us</button>
              <button onClick={() => { setActivePage("services"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white text-left">Services</button>
              <button onClick={() => { setActivePage("industries"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white text-left">Industries</button>
              <button onClick={() => { setActivePage("jobs"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white text-left">Open Jobs</button>
            </div>
          </div>

          {/* Portals */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-white text-xs font-semibold font-mono uppercase tracking-wider">
              Portals & Services
            </h4>
            <div className="flex flex-col gap-2 text-xs text-zinc-400 font-light">
              <button onClick={() => { setPrefilledJobTitle(""); setActivePage("candidates"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white text-left">Candidate Registration</button>
              <button onClick={() => { setActivePage("employers"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white text-left">Employer Staffing Request</button>
              <button onClick={() => { setActivePage("services"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white text-left">Executive Headhunting</button>
              <button onClick={() => { setActivePage("services"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white text-left">Contract Staffing</button>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-white text-xs font-semibold font-mono uppercase tracking-wider">
              Contact Desk
            </h4>
            <div className="flex flex-col gap-2 text-xs text-zinc-400 font-light">
              <p>Email: <a href="mailto:info@aurastaffing.com" className="text-zinc-300 hover:underline">info@aurastaffing.com</a></p>
              <p>Phone: <a href="tel:+12125550192" className="text-zinc-300 hover:underline">+1 (212) 555-0192</a></p>
              <button onClick={() => { setActivePage("contact"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-brand-emerald hover:underline text-left font-semibold mt-1">
                Contact Form & FAQs &rarr;
              </button>
            </div>
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-600 font-light">
          <p>© {new Date().getFullYear()} Aura Staffing Agency. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-zinc-500">Confidentiality Assured</span>
            <span>·</span>
            <span className="text-zinc-500">90-Day Placement Guarantee</span>
            <span>·</span>
            <span className="text-zinc-500">Equal Opportunity Employer</span>
          </div>
        </div>
      </footer>

    </div>
  );
}


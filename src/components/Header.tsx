import React, { useState } from "react";
import { Sparkles, Building2, Menu, X, ArrowRight } from "lucide-react";
import { PageView } from "../types";

interface HeaderProps {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  onNavigateToCandidateForm?: () => void;
  onNavigateToEmployerForm?: () => void;
}

export default function Header({ 
  activePage, 
  setActivePage,
  onNavigateToCandidateForm,
  onNavigateToEmployerForm
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageView; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "industries", label: "Industries" },
    { id: "jobs", label: "Jobs" },
    { id: "candidates", label: "Candidates" },
    { id: "employers", label: "Employers" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (page: PageView) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-bg/90 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between transition-all duration-300">
      {/* Brand Identity */}
      <button 
        onClick={() => handleNavClick("home")}
        className="flex items-center gap-3 text-left focus:outline-none group"
      >
        <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-emerald to-brand-slate text-white shadow-lg shadow-brand-emerald/10 font-bold text-lg select-none">
          Ω
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-brand-emerald to-brand-slate opacity-20 blur-sm animate-pulse group-hover:opacity-40 transition-opacity"></div>
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white leading-none">
            AURA
          </span>
          <span className="font-mono text-[9px] text-brand-emerald font-semibold uppercase tracking-widest mt-0.5">
            STAFFING AGENCY
          </span>
        </div>
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-1 xl:gap-2 font-medium text-xs xl:text-sm">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-semibold tracking-tight ${
                isActive
                  ? "text-white bg-zinc-800/80 border border-zinc-700/60 shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Action CTA Buttons */}
      <div className="hidden sm:flex items-center gap-2.5">
        <button
          onClick={() => {
            setActivePage("candidates");
            if (onNavigateToCandidateForm) onNavigateToCandidateForm();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 text-xs font-semibold tracking-tight transition-all duration-200"
        >
          <Sparkles className="size-3.5 text-brand-emerald" />
          Submit Resume
        </button>
        <button
          onClick={() => {
            setActivePage("employers");
            if (onNavigateToEmployerForm) onNavigateToEmployerForm();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-slate text-black hover:opacity-95 font-semibold text-xs tracking-tight shadow-md transition-all duration-200"
        >
          <Building2 className="size-3.5" />
          Hire Talent
        </button>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#070709] border-b border-zinc-800 p-6 flex flex-col gap-3 shadow-2xl lg:hidden z-50">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activePage === item.id
                    ? "bg-zinc-800 text-white border border-zinc-700"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-900 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setActivePage("candidates");
                setMobileMenuOpen(false);
                if (onNavigateToCandidateForm) onNavigateToCandidateForm();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 text-white border border-zinc-800 text-xs font-semibold"
            >
              <Sparkles className="size-4 text-brand-emerald" />
              Submit Candidate Resume
            </button>
            <button
              onClick={() => {
                setActivePage("employers");
                setMobileMenuOpen(false);
                if (onNavigateToEmployerForm) onNavigateToEmployerForm();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-slate text-black font-semibold text-xs shadow-md"
            >
              <Building2 className="size-4" />
              Submit Employer Hiring Request
            </button>
          </div>
        </div>
      )}
    </header>
  );
}


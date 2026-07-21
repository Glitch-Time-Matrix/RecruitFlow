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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/90 backdrop-blur-xl px-4 sm:px-6 py-3.5 flex items-center justify-between transition-all duration-300 shadow-sm">
      {/* Brand Identity */}
      <button 
        onClick={() => handleNavClick("home")}
        className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-lg p-1 group cursor-pointer"
      >
        <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-lg shadow-primary/20 font-bold text-lg select-none">
          Ω
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-primary to-secondary opacity-20 blur-sm animate-pulse group-hover:opacity-40 transition-opacity"></div>
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-base sm:text-lg tracking-tight text-foreground leading-none">
            AURA
          </span>
          <span className="font-mono text-[9px] text-accent font-semibold uppercase tracking-widest mt-0.5">
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
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-semibold tracking-tight focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer ${
                isActive
                  ? "text-primary bg-primary/10 border border-primary/20 shadow-sm"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
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
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-muted text-foreground border border-border text-xs font-semibold tracking-tight transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer"
        >
          <Sparkles className="size-3.5 text-accent" />
          Submit Resume
        </button>
        <button
          onClick={() => {
            setActivePage("employers");
            if (onNavigateToEmployerForm) onNavigateToEmployerForm();
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs tracking-tight shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer"
        >
          <Building2 className="size-3.5" />
          Hire Talent
        </button>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden p-2 rounded-lg bg-muted border border-border text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Mobile Drawer Navigation */}
      <div className={`absolute top-full left-0 w-full bg-white border-b border-border p-6 flex flex-col gap-3 shadow-2xl lg:hidden z-50 transition-all duration-300 origin-top ${mobileMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer min-h-[44px] ${
                activePage === item.id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-border flex flex-col gap-2.5">
          <button
            onClick={() => {
              setActivePage("candidates");
              setMobileMenuOpen(false);
              if (onNavigateToCandidateForm) onNavigateToCandidateForm();
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white hover:bg-muted text-foreground border border-border text-xs font-semibold cursor-pointer min-h-[44px]"
          >
            <Sparkles className="size-4 text-accent" />
            Submit Candidate Resume
          </button>
          <button
            onClick={() => {
              setActivePage("employers");
              setMobileMenuOpen(false);
              if (onNavigateToEmployerForm) onNavigateToEmployerForm();
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-white font-semibold text-xs shadow-md hover:bg-primary/90 cursor-pointer min-h-[44px]"
          >
            <Building2 className="size-4" />
            Submit Employer Hiring Request
          </button>
        </div>
      </div>
    </header>
  );
}


import React from "react";
import { Sparkles, Building2, Home, Info, Briefcase, Users, Phone } from "lucide-react";
import { PageView } from "../types";
import { NavBar } from "@/src/components/ui/tubelight-navbar";

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
  const navItems = [
    { name: "Home", id: "home", icon: Home },
    { name: "About", id: "about", icon: Info },
    { name: "Services", id: "services", icon: Briefcase },
    { name: "Candidates", id: "candidates", icon: Users },
    { name: "Employers", id: "employers", icon: Building2 },
    { name: "Contact", id: "contact", icon: Phone },
  ];

  const handleNavClick = (page: string) => {
    setActivePage(page as PageView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl px-4 sm:px-6 py-4 flex items-center justify-between transition-all duration-300">
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
              RECRUITFLOW
            </span>
            <span className="font-mono text-[9px] text-accent font-semibold uppercase tracking-widest mt-0.5">
              STAFFING AGENCY
            </span>
          </div>
        </button>

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
      </header>
      
      {/* Tubelight Floating Navbar */}
      <NavBar 
        items={navItems} 
        activeTab={activePage} 
        setActiveTab={handleNavClick} 
      />
    </>
  );
}

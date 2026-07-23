"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Building2, Home, Info, Briefcase, Users, Phone } from "lucide-react";
import { NavBar } from "@/components/public/ui/tubelight-navbar";
import { BRAND } from "@/lib/brand";

/** Maps a nav item id to its route. */
const ROUTES: Record<string, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  candidates: "/candidates",
  employers: "/employers",
  contact: "/contact",
};

/** Derives the active nav id from the current pathname. */
function activeIdFromPath(pathname: string): string {
  if (pathname === "/") return "home";
  const seg = pathname.split("/")[1];
  return seg in ROUTES ? seg : "";
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Home", id: "home", icon: Home },
    { name: "About", id: "about", icon: Info },
    { name: "Services", id: "services", icon: Briefcase },
    { name: "Candidates", id: "candidates", icon: Users },
    { name: "Employers", id: "employers", icon: Building2 },
    { name: "Contact", id: "contact", icon: Phone },
  ];

  const handleNavClick = (id: string) => {
    router.push(ROUTES[id] ?? "/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl px-4 sm:px-6 py-4 flex items-center justify-between transition-all duration-300">
        {/* Brand Identity */}
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-lg p-1 group cursor-pointer"
        >
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-lg shadow-primary/20 font-bold text-lg select-none overflow-hidden">
            {BRAND.logo.src ? (
              <Image
                src={BRAND.logo.src}
                alt={BRAND.logo.alt}
                width={40}
                height={40}
                className="size-full object-contain"
              />
            ) : (
              BRAND.logo.glyph
            )}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-primary to-secondary opacity-20 blur-sm animate-pulse group-hover:opacity-40 transition-opacity"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm sm:text-base md:text-lg tracking-tight text-foreground leading-none">
              {BRAND.wordmark}
            </span>
            <span className="font-mono text-[9px] text-accent font-semibold uppercase tracking-widest mt-0.5">
              {BRAND.tagline}
            </span>
          </div>
        </button>
      </header>

      {/* Tubelight Floating Navbar */}
      <NavBar
        items={navItems}
        activeTab={activeIdFromPath(pathname)}
        setActiveTab={handleNavClick}
      />
    </>
  );
}

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Globe } from "lucide-react";
import { BRAND } from "@/lib/brand";

const linkClass =
  "hover:text-primary hover:translate-x-1 transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-accent/50 rounded cursor-pointer";

export default function Footer() {
  return (
    <footer className="w-full bg-muted border-t border-border py-16 px-6 text-left relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
        {/* Logo & Agency Description */}
        <div className="md:col-span-4 flex flex-col items-start gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-lg p-1 -ml-1 cursor-pointer"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm select-none shadow-sm overflow-hidden">
              {BRAND.logo.src ? (
                <Image
                  src={BRAND.logo.src}
                  alt={BRAND.logo.alt}
                  width={36}
                  height={36}
                  className="size-full object-contain"
                />
              ) : (
                BRAND.logo.glyph
              )}
            </div>
            <span className="font-display font-bold text-base tracking-tight text-foreground uppercase leading-none">
              {BRAND.wordmark} {BRAND.tagline.split(" ")[0]}
            </span>
          </Link>
          <p className="text-foreground/70 text-xs font-light max-w-sm leading-relaxed">
            {BRAND.description}
          </p>
          <div className="text-foreground/60 text-[10px] font-mono flex items-center gap-1.5">
            <Globe className="size-3 text-primary" />
            Corporate Desk Active 24/7 &bull; Global Operations
          </div>
        </div>

        {/* Navigation Pages */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <h4 className="text-foreground text-xs font-semibold font-mono uppercase tracking-wider">
            Navigation
          </h4>
          <div className="flex flex-col gap-2 text-xs text-foreground/70 font-light">
            <Link href="/" className={linkClass}>Home</Link>
            <Link href="/about" className={linkClass}>About Us</Link>
            <Link href="/services" className={linkClass}>Services</Link>
            <Link href="/industries" className={linkClass}>Industries</Link>
            <Link href="/jobs" className={linkClass}>Open Jobs</Link>
          </div>
        </div>

        {/* Portals */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <h4 className="text-foreground text-xs font-semibold font-mono uppercase tracking-wider">
            Portals & Services
          </h4>
          <div className="flex flex-col gap-2 text-xs text-foreground/70 font-light">
            <Link href="/candidates" className={linkClass}>Candidate Registration</Link>
            <Link href="/employers" className={linkClass}>Employer Staffing Request</Link>
            <Link href="/services" className={linkClass}>Executive Headhunting</Link>
            <Link href="/services" className={linkClass}>Contract Staffing</Link>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <h4 className="text-foreground text-xs font-semibold font-mono uppercase tracking-wider">
            Contact Desk
          </h4>
          <div className="flex flex-col gap-2 text-xs text-foreground/70 font-light">
            <p>
              Email:{" "}
              <a
                href={`mailto:${BRAND.contact.email}`}
                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-accent/50 rounded cursor-pointer"
              >
                {BRAND.contact.email}
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href={`tel:${BRAND.contact.phoneHref}`}
                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-accent/50 rounded cursor-pointer"
              >
                {BRAND.contact.phone}
              </a>
            </p>
            <Link
              href="/contact"
              className="text-accent hover:underline text-left font-semibold mt-1 focus:outline-none focus:ring-2 focus:ring-accent/50 rounded cursor-pointer flex items-center gap-1 group"
            >
              Contact Form & FAQs{" "}
              <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer bottom bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-foreground/60 font-light">
        <p>© {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {BRAND.assurances.map((item) => (
            <span key={item} className="text-foreground/60">{item}</span>
          ))}
          <span className="text-foreground/30">·</span>
          <Link href="/login" className="text-foreground/50 hover:text-primary hover:underline">
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}

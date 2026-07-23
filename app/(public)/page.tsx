"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, UserCheck, Building2, ShieldCheck } from "lucide-react";
import Hero from "@/components/public/Hero";
import Features from "@/components/public/Features";
import ActivePositions from "@/components/public/ActivePositions";
import SocialProof from "@/components/public/SocialProof";
import { INITIAL_JOBS } from "@/lib/data";

export default function HomePage() {
  const router = useRouter();

  const goCandidateForJob = (jobTitle: string) => {
    router.push(`/candidates?role=${encodeURIComponent(jobTitle)}`);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <Hero
        onNavigateCandidate={() => router.push("/candidates")}
        onNavigateEmployer={() => router.push("/employers")}
      />

      {/* Features */}
      <div className="w-full">
        <Features />
      </div>

      {/* Featured Active Positions */}
      <ActivePositions jobs={INITIAL_JOBS} onSelectJobForMatching={goCandidateForJob} />

      {/* Quick Agency Highlights */}
      <section className="py-20 px-6 w-full bg-white border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div
            className="p-8 rounded-3xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow duration-300 space-y-3 group cursor-pointer"
            onClick={() => router.push("/candidates")}
          >
            <div className="size-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <UserCheck className="size-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">For Candidates</h3>
            <p className="text-foreground/70 text-xs font-light leading-relaxed">
              Submit your resume confidentially to be matched with unlisted executive and technical opportunities across top corporate employers.
            </p>
            <button className="text-xs text-accent hover:underline font-semibold pt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
              Candidate Portal <ArrowRight className="size-3" />
            </button>
          </div>

          <div
            className="p-8 rounded-3xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow duration-300 space-y-3 group cursor-pointer"
            onClick={() => router.push("/employers")}
          >
            <div className="size-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Building2 className="size-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">For Employers</h3>
            <p className="text-foreground/70 text-xs font-light leading-relaxed">
              Request executive headhunting, contract staffing, or bulk volume hiring with an average 48-72 hour vetted shortlist delivery.
            </p>
            <button className="text-xs text-secondary hover:underline font-semibold pt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
              Employer Portal <ArrowRight className="size-3" />
            </button>
          </div>

          <div
            className="p-8 rounded-3xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow duration-300 space-y-3 group cursor-pointer"
            onClick={() => router.push("/about")}
          >
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">Guaranteed Retention</h3>
            <p className="text-foreground/70 text-xs font-light leading-relaxed">
              Every permanent placement is backed by our 90-day replacement policy to ensure complete peace of mind for hiring leaders.
            </p>
            <button className="text-xs text-primary hover:underline font-semibold pt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
              About Our Agency <ArrowRight className="size-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonial Carousel */}
      <SocialProof />
    </div>
  );
}

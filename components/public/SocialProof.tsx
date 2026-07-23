"use client";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CLIENT_LOGOS } from "@/lib/data";
import { TestimonialsColumn } from "@/components/public/ui/testimonials-columns-1";
import { motion } from "framer-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const testimonials = [
  {
    text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function SocialProof() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header reveal
    gsap.fromTo(".sp-header > *", 
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".sp-header",
          start: "top 85%"
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="testimonials" className="py-24 bg-muted border-t border-border relative overflow-hidden">
      <div className="sp-header max-w-7xl mx-auto px-6 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border text-xs font-mono font-medium text-foreground/80 mb-6 shadow-sm">
          <span className="flex size-2 rounded-full bg-accent animate-pulse"></span>
          Trusted by Industry Leaders
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight max-w-2xl mx-auto">
          Powering the workforce of <span className="text-primary">Fortune 500s</span> & high-growth innovators.
        </h2>
        <p className="text-foreground/70 text-sm font-light mt-4 max-w-xl mx-auto">
          Over 450 corporate partners rely on RecruitFlow for critical talent acquisition and executive search.
        </p>
      </div>

      {/* Client Logos Infinite Loop Banner */}
      <div className="relative w-full py-8 mb-20 overflow-hidden select-none border-y border-border bg-white">
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
        
        <div className="animate-marquee flex items-center gap-12 sm:gap-24">
          {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, idx) => (
            <div key={idx} className="flex items-center gap-3 text-foreground/40 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tighter uppercase whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="container z-10 mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border border-border bg-white py-1 px-4 rounded-lg text-xs font-mono font-medium tracking-wide uppercase text-foreground/70">Testimonials</div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-bold tracking-tighter mt-5 text-foreground">
            What our clients say
          </h2>
          <p className="text-center mt-5 text-foreground/70 font-light text-lg">
            See what companies and professionals have to say about partnering with us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}
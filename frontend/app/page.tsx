"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, FileText, Target, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-label", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".hero-title span", {
        opacity: 0,
        y: 100,
        stagger: 0.2,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      });

      gsap.from(".hero-description", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        delay: 0.8,
      });

      gsap.from(".hero-cta", {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 1.2,
      });

      gsap.from(".feature-card", {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 80%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 section-container overflow-hidden">
        <div className="max-w-5xl">
          <p className="hero-label text-minimal text-white/40 mb-8 flex items-center gap-4">
            <span className="w-12 h-px bg-white/20"></span>
            NEURAL_MARKET_ANALYSIS_V1.0
          </p>
          
          <h1 className="hero-title text-5xl md:text-7xl font-tech font-bold tracking-tighter mb-12 uppercase italic leading-[0.85]">
            <span className="inline-block">ANALYSE_THE</span> <br />
            <span className="inline-block text-white/20">GAP_IN_YOUR</span> <br />
            <span className="inline-block">CAREER_PATH</span>
          </h1>

          <p className="hero-description text-xl md:text-2xl text-white/60 mb-12 max-w-2xl font-light leading-relaxed">
            A high-precision diagnostic tool for modern professionals. Map your technical profile against real-time industry demands.
          </p>

          <div className="hero-cta flex flex-wrap gap-6">
            <Link href="/dashboard" className="btn-minimal px-12 py-5 text-base flex items-center gap-3 group">
              INITIALIZE_SCAN
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about" className="px-12 py-5 border border-white/10 hover:border-white/40 transition-all text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center">
              VIEW_PROTOCOL
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none hidden lg:block">
          <div className="text-[20vw] font-tech font-black select-none tracking-tighter">GAP</div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 border-t border-white/5 bg-white/[0.02]">
        <div className="section-container">
          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: FileText,
                title: "RESUME_PARSING",
                desc: "Deep-layer extraction of technical skills and experience nodes."
              },
              {
                icon: Target,
                title: "ROLE_MAPPING",
                desc: "Precise alignment with target market requirements."
              },
              {
                icon: BarChart3,
                title: "GAP_DIAGNOSTICS",
                desc: "Identification of critical missing skill clusters."
              },
              {
                icon: Zap,
                title: "ACTION_PLAN",
                desc: "Instant generation of educational and project roadmaps."
              }
            ].map((feature, i) => (
              <div key={i} className="feature-card card-minimal group">
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-minimal mb-4">{feature.title}</h3>
                <p className="text-xs text-white/40 font-light leading-relaxed italic">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer System Info */}
      <footer className="py-12 border-t border-white/5">
        <div className="section-container flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">
            <span>SYS_READY</span>
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="ml-4">LOCAL_TIME: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="text-[10px] text-white/20 uppercase tracking-widest">
            © 2024 CAREER_GAP_ANALYSER // ALL_SYSTEMS_OPERATIONAL
          </div>
        </div>
      </footer>
    </div>
  );
}

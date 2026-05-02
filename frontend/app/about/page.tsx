"use client";

import { useEffect, useRef } from "react";
import { Cpu, Globe, Lock, Zap } from "lucide-react";
import gsap from "gsap";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".manifesto-label", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".about-title span", {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: "power4.out",
        delay: 0.2,
      });

      gsap.from(".about-content", {
        opacity: 0,
        y: 30,
        stagger: 0.3,
        duration: 1,
        ease: "power3.out",
        delay: 0.6,
      });

      gsap.from(".tech-card", {
        opacity: 0,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white section-container py-20">
      <div className="max-w-4xl">
        <p className="text-minimal text-white/40 mb-8 manifesto-label">MANIFESTO</p>
        <h1 className="text-6xl md:text-8xl font-tech font-bold tracking-tighter mb-12 uppercase italic about-title overflow-hidden">
          <span className="inline-block">BRIDGING_THE</span> <br />
          <span className="inline-block">INTELLIGENCE_GAP</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 about-content">
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight">OUR_MISSION</h2>
            <p className="text-white/60 leading-relaxed font-light">
              Career Gap Analyser was born from a simple observation: the distance between educational output and industry demand is widening. We use advanced NLP to map this territory and provide actionable bridges for professionals.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight">THE_TECH</h2>
            <p className="text-white/60 leading-relaxed font-light">
              Built on a stack of FastAPI, Next.js, and custom-trained Transformers, our system processes thousands of job postings daily to provide the most accurate skill-market fit analysis available.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-20">
          {[
            { icon: Cpu, label: "NEURAL_ENGINE" },
            { icon: Globe, label: "GLOBAL_DATA" },
            { icon: Lock, label: "SECURE_VAULT" },
            { icon: Zap, label: "INSTANT_ROADMAP" },
          ].map((item, i) => (
            <div key={i} className="card-minimal flex flex-col items-center justify-center text-center py-12 tech-card">
              <item.icon className="w-6 h-6 mb-4 text-white/40" />
              <p className="text-[8px] tracking-[0.4em] uppercase">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="h-px w-full bg-white/5 mb-12" />
        
        <p className="text-sm text-white/40 font-mono tracking-widest uppercase about-content">
          Version 1.0.4 // System Status: Optimal
        </p>
      </div>
    </div>
  );
}

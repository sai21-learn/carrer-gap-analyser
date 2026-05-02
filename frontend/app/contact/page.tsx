"use client";

import { useEffect, useRef } from "react";
import { Mail, Github, Twitter, MapPin } from "lucide-react";
import gsap from "gsap";

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-label", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".contact-title span", {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: "power4.out",
        delay: 0.2,
      });

      gsap.from(".contact-item", {
        opacity: 0,
        x: -30,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.6,
      });

      gsap.from(".contact-form", {
        opacity: 0,
        x: 30,
        duration: 1,
        ease: "power3.out",
        delay: 0.8,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white section-container py-20">
      <div className="max-w-4xl">
        <p className="text-minimal text-white/40 mb-8 contact-label">CONTACT_INTERFACE</p>
        <h1 className="text-6xl md:text-8xl font-tech font-bold tracking-tighter mb-12 uppercase italic contact-title overflow-hidden">
          <span className="inline-block">CONNECT_WITH</span> <br />
          <span className="inline-block">THE_SYSTEM</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="text-minimal text-white/40 contact-item">DIRECT_CHANNELS</p>
              <div className="space-y-6">
                <a href="mailto:system@career-gap.ai" className="flex items-center gap-6 group contact-item">
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-light tracking-tight group-hover:pl-2 transition-all">system@career-gap.ai</span>
                </a>
                <a href="#" className="flex items-center gap-6 group contact-item">
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <Github className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-light tracking-tight group-hover:pl-2 transition-all">github.com/career-gap</span>
                </a>
                <a href="#" className="flex items-center gap-6 group contact-item">
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <Twitter className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-light tracking-tight group-hover:pl-2 transition-all">@careergap_ai</span>
                </a>
              </div>
            </div>

            <div className="space-y-4 contact-item">
              <p className="text-minimal text-white/40">NODE_LOCATION</p>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-xl font-light tracking-tight italic uppercase">Distributed_Neural_Network</span>
              </div>
            </div>
          </div>

          <div className="card-minimal h-full flex flex-col justify-between contact-form">
            <div>
              <p className="text-minimal text-white/40 mb-8">ENCRYPTED_MESSAGE</p>
              <form className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[8px] tracking-[0.4em] text-white/20 uppercase">SENDER_ID</label>
                  <input type="text" className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-white transition-all font-light" placeholder="NAME / EMAIL" />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] tracking-[0.4em] text-white/20 uppercase">PAYLOAD</label>
                  <textarea className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-white transition-all font-light min-h-[120px]" placeholder="YOUR_MESSAGE_HERE" />
                </div>
                <button type="submit" className="btn-minimal w-full">SEND_PAYLOAD</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

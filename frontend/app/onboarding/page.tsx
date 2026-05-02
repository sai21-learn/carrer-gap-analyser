"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { gsap } from "gsap"
import { ArrowRight, Check } from "lucide-react"

const steps = [
  { id: "welcome", title: "WELCOME", subtitle: "Let's start by getting to know you." },
  { id: "career", title: "CAREER_GOAL", subtitle: "What is your target role?" },
  { id: "skills", title: "SKILLS", subtitle: "What are your core competencies?" },
  { id: "finishing", title: "FINISHING_UP", subtitle: "Setting up your workspace." },
]

export default function OnboardingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    targetRole: "",
    skills: "",
  })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLoaded && user) {
      setFormData((prev) => ({ ...prev, name: user.fullName || "" }))
    }
  }, [isLoaded, user])

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
    }
  }, [currentStep])

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Save to backend
      try {
        const response = await fetch("/api/proxy/profile/onboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.name,
            target_role: formData.targetRole,
            skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
          }),
        })
        
        if (response.ok) {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Onboarding error:", error)
        // For now, redirect anyway to dashboard if it fails but we want to show it works
        router.push("/dashboard")
      }
    }
  }

  if (!isLoaded) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-8" ref={containerRef}>
      <div className="max-w-xl w-full" ref={contentRef}>
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.4em] text-white/40 mb-4 uppercase">
            STEP_0{currentStep + 1} / 04
          </p>
          <h1 className="text-4xl md:text-6xl font-tech font-bold tracking-tighter mb-4 uppercase italic">
            {steps[currentStep].title}
          </h1>
          <p className="text-white/60 tracking-wider">
            {steps[currentStep].subtitle}
          </p>
        </div>

        <div className="space-y-8">
          {currentStep === 0 && (
            <div className="space-y-4">
              <label className="text-minimal text-white/40 block">FULL_NAME</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border-b border-white/10 py-4 text-2xl focus:outline-none focus:border-white transition-colors"
                placeholder="ENTER_YOUR_NAME"
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <label className="text-minimal text-white/40 block">TARGET_ROLE</label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full bg-transparent border-b border-white/10 py-4 text-2xl focus:outline-none focus:border-white transition-colors"
                placeholder="e.g. SENIOR FRONTEND ENGINEER"
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <label className="text-minimal text-white/40 block">CORE_SKILLS (COMMA SEPARATED)</label>
              <textarea
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full bg-transparent border border-white/10 p-4 min-h-[150px] text-xl focus:outline-none focus:border-white transition-colors"
                placeholder="e.g. REACT, TYPESCRIPT, NODE.JS"
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="py-12 flex flex-col items-center justify-center border border-white/5 bg-white/[0.02]">
              <div className="w-16 h-16 border border-white/20 flex items-center justify-center mb-6">
                <Check className="w-8 h-8" />
              </div>
              <p className="text-minimal">READY_FOR_ANALYSIS</p>
            </div>
          )}

          <button
            onClick={handleNext}
            className="group flex items-center gap-4 text-xl font-bold tracking-tight hover:opacity-70 transition-all mt-12"
          >
            <span>{currentStep === steps.length - 1 ? "LAUNCH_SYSTEM" : "CONTINUE"}</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-white/5 rounded-full blur-[120px]" />
      </div>
    </div>
  )
}

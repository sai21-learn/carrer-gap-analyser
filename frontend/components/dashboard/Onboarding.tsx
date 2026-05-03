"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Target, 
  Cpu, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Plus, 
  X,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

const COMMON_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Architect",
  "Software Engineer",
  "Mobile Developer",
  "UI/UX Designer"
];

const ROLE_SUGGESTIONS: Record<string, string[]> = {
  "Frontend Developer": ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "Jest", "Framer Motion"],
  "Backend Developer": ["Node.js", "Python", "PostgreSQL", "Redis", "Docker", "FastAPI", "GraphQL"],
  "Fullstack Developer": ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS", "Next.js"],
  "Data Scientist": ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "SQL"],
  "Machine Learning Engineer": ["Python", "TensorFlow", "PyTorch", "Miri", "Docker", "C++", "CUDA"],
  "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "Terraform", "Ansible", "Jenkins", "CI/CD"],
  "Cloud Architect": ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "Microservices", "Security"],
  "Software Engineer": ["Java", "Python", "C++", "Data Structures", "Algorithms", "System Design", "Git"],
  "Mobile Developer": ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "Mobile UI", "Native APIs"],
  "UI/UX Designer": ["Figma", "Adobe XD", "User Research", "Prototyping", "Visual Design", "Design Systems"]
};

const CSE_CORE_SKILLS = [
  "Algorithms", "Data Structures", "Operating Systems", "Computer Networks", "DBMS", 
  "System Design", "Object Oriented Programming", "Microprocessors", "Theory of Computation", 
  "Software Engineering", "Compiler Design", "Distributed Systems", "Cryptography"
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [targetRole, setTargetRole] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill && !skills.includes(customSkill)) {
      setSkills([...skills, customSkill.toUpperCase()]);
      setCustomSkill("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      try {
        const response = await fetch("/api/proxy/profile/resume", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          // The backend now returns { extracted_skills: [], all_skills: [] }
          setSkills(data.all_skills);
          setStep(2); // Move to skills step if not already there
        }
      } catch (error) {
        console.error("Resume extraction failed", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/proxy/profile/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_roles: [targetRole],
          current_skills: skills
        })
      });

      if (res.ok) {
        onComplete();
      }
    } catch (error) {
      console.error("Onboarding failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestions = targetRole ? (ROLE_SUGGESTIONS[targetRole] || []) : [];

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-4xl w-full py-12 space-y-12 animate-in fade-in zoom-in duration-500">
        <div className="space-y-4">
          <p className="text-minimal text-white/40">PROTOCOL_INITIALIZATION_V2</p>
          <h1 className="text-4xl md:text-6xl font-tech font-bold tracking-tighter uppercase italic leading-none">
            {step === 1 ? "DEFINE_TARGET_IDENTITY" : "MAPPING_COMPETENCIES"}
          </h1>
          <p className="text-xs text-white/20 tracking-[0.2em] uppercase">
            Step {step} of 2 // Secure Connection Established
          </p>
        </div>

        <div className="h-px w-full bg-white/10" />

        {step === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-minimal text-white/40">SELECT_TARGET_ROLE</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_ROLES.map(role => (
                    <button
                      key={role}
                      onClick={() => setTargetRole(role)}
                      className={cn(
                        "px-4 py-3 border text-[10px] font-bold uppercase tracking-widest text-left transition-all",
                        targetRole === role 
                          ? "bg-white text-black border-white" 
                          : "border-white/10 text-white/40 hover:border-white/40 hover:text-white"
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-minimal text-white/40">OR_CUSTOM_DEFINITION</h2>
                <div className="relative group">
                  <Target className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="ENTER_CUSTOM_ROLE..."
                    className="w-full bg-white/5 border border-white/10 p-6 pl-16 text-sm font-tech uppercase tracking-widest outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="card-minimal border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center p-12 text-center group hover:border-white/40 transition-all">
                <div className="w-16 h-16 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all">
                  {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Infect_System_Data</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-8 leading-relaxed">
                  Upload your Resume/CV to automatically <br /> extract skills and experience.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf"
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black transition-all text-[10px] font-bold uppercase tracking-widest"
                >
                  {isUploading ? "PROCESS_RUNNING..." : "SELECT_PDF_FILE"}
                </button>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!targetRole}
                className={cn(
                  "w-full btn-minimal p-6 text-sm flex items-center justify-center gap-4",
                  !targetRole && "opacity-20 cursor-not-allowed"
                )}
              >
                MANUAL_CONTINUE
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in slide-in-from-right duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                {suggestions.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <h2 className="text-minimal text-white/40 uppercase">Recommended_For_{targetRole}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map(skill => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={cn(
                            "px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all",
                            skills.includes(skill)
                              ? "bg-emerald-500 border-emerald-500 text-black"
                              : "border-white/10 text-white/40 hover:border-white/40 hover:text-white"
                          )}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <h2 className="text-minimal text-white/40 uppercase">CSE_Core_Competencies</h2>
                  <div className="flex flex-wrap gap-2">
                    {CSE_CORE_SKILLS.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={cn(
                          "px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all",
                          skills.includes(skill)
                            ? "bg-blue-500 border-blue-500 text-black"
                            : "border-white/10 text-white/40 hover:border-white/40 hover:text-white"
                        )}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-minimal text-white/40 uppercase">Direct_Skill_Injection</h2>
                  <form onSubmit={addCustomSkill} className="relative group">
                    <Plus className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-white transition-colors" />
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="ENTER_SKILL_NAME (ENTER TO ADD)"
                      className="w-full bg-white/5 border border-white/10 p-6 pl-16 text-sm font-tech uppercase tracking-widest outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                    />
                  </form>
                </div>
              </div>

              <div className="space-y-8">
                <div className="card-minimal h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <h2 className="text-minimal text-white/40 uppercase">Inventory_Manifest</h2>
                  </div>
                  
                  <div className="flex-grow space-y-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                    {skills.length > 0 ? (
                      skills.map(skill => (
                        <div key={skill} className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.02] group">
                          <span className="text-[10px] font-bold uppercase tracking-widest">{skill}</span>
                          <button onClick={() => toggleSkill(skill)} className="text-white/20 hover:text-red-500 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center opacity-20 text-center">
                        <Cpu className="w-8 h-8 mb-4" />
                        <p className="text-[10px] uppercase tracking-widest italic">Inventory_Empty</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-8 space-y-4">
                    <button
                      onClick={() => setStep(1)}
                      className="w-full px-8 py-4 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                    >
                      RETURN_TO_ROLE_DEFINITION
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || skills.length === 0}
                      className={cn(
                        "w-full btn-minimal p-6 text-sm flex items-center justify-center gap-4",
                        (isSubmitting || skills.length === 0) && "opacity-20 cursor-not-allowed"
                      )}
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "FINALIZE_ONBOARDING"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

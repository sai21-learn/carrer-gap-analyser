"use client";

import { useState, useEffect } from "react";
import { User, Shield, Bell, Database, Trash2, Save, RefreshCw, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [targetRole, setTargetRole] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [supportedRoles, setSupportedRoles] = useState<string[]>([
    "Data Analyst", "Data Scientist", "Machine Learning Engineer",
    "Software Engineer", "Frontend Developer", "Backend Developer",
    "DevOps Engineer", "UI/UX Designer", "Cybersecurity Analyst", "Cloud Engineer"
  ]);

  useEffect(() => {
    fetch("/api/proxy/profile/me")
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          setProfile(data.profile);
          setTargetRole(data.profile.target_role || "");
          try {
            setSkills(JSON.parse(data.profile.current_skills || "[]"));
          } catch(e) {
            setSkills([]);
          }
        }
      });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/proxy/profile/onboard", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_role: targetRole,
          current_skills: skills
        })
      });
      router.refresh();
    } catch(e) {
      console.error(e);
    }
    setTimeout(() => setIsSaving(false), 500);
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const clearAllSkills = () => {
    setSkills([]);
  };

  const purgeHistory = async () => {
    if (confirm("Are you sure you want to purge all analysis history?")) {
      // In a real app, you would call a DELETE /api/proxy/analysis/history endpoint
      alert("This would delete history in a full implementation.");
    }
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
      <div className="space-y-4">
        <p className="text-minimal text-white/40">SYSTEM_CONFIG</p>
        <h1 className="text-5xl md:text-7xl font-tech font-bold tracking-tighter uppercase italic">
          SETTINGS
        </h1>
      </div>

      <div className="h-px w-full bg-white/5" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-4 px-6 py-4 bg-white/5 border-l-2 border-white text-xs font-bold uppercase tracking-widest">
            <User className="w-4 h-4" />
            Profile
          </button>
          <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 border-l-2 border-transparent text-white/40 text-xs font-bold uppercase tracking-widest transition-all cursor-not-allowed opacity-50">
            <Shield className="w-4 h-4" />
            Security (N/A)
          </button>
          <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 border-l-2 border-transparent text-white/40 text-xs font-bold uppercase tracking-widest transition-all cursor-not-allowed opacity-50">
            <Bell className="w-4 h-4" />
            Notifications (N/A)
          </button>
          <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 border-l-2 border-transparent text-white/40 text-xs font-bold uppercase tracking-widest transition-all">
            <Database className="w-4 h-4" />
            Data Management
          </button>
        </div>

        <div className="lg:col-span-3 space-y-12">
          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">PROFILE_CONFIGURATION</h3>
            
            <div className="space-y-6">
              <div className="p-6 border border-white/5 bg-white/[0.02]">
                <label className="block text-xs font-bold uppercase mb-4 text-white/80">Target Role</label>
                <select 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:outline-none focus:border-white transition-colors uppercase tracking-widest"
                >
                  <option value="">SELECT A ROLE</option>
                  {supportedRoles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="p-6 border border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-6">
                  <label className="block text-xs font-bold uppercase text-white/80">Extracted Skills Inventory ({skills.length})</label>
                  <button onClick={clearAllSkills} className="text-[10px] text-red-500 hover:text-red-400 uppercase tracking-widest border border-red-500/20 px-3 py-1">
                    Clear All
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? skills.map(skill => (
                    <div key={skill} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 group hover:bg-white/10 transition-colors">
                      <span className="text-[10px] uppercase tracking-widest">{skill}</span>
                      <button onClick={() => removeSkill(skill)} className="text-white/20 hover:text-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )) : (
                    <p className="text-xs text-white/20 uppercase tracking-widest">No skills in inventory. Upload resume to populate.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">DANGER_ZONE</h3>
            <div className="p-6 border border-red-500/20 bg-red-500/[0.02] flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase text-red-500">Purge Analysis History</p>
                <p className="text-[10px] text-red-500/40">Permanently delete all previous roadmap generations</p>
              </div>
              <button onClick={purgeHistory} className="px-6 py-2 border border-red-500/40 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
                <Trash2 className="w-3 h-3" />
                PURGE_ALL
              </button>
            </div>
          </section>

          <div className="pt-12 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-12 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 disabled:opacity-50 hover:bg-white/80 transition-colors"
            >
              {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              {isSaving ? "SAVING_CONFIG..." : "COMMIT_CHANGES"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

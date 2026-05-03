"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Briefcase,
  Target,
  ChevronRight,
  BrainCircuit,
  ArrowUpRight,
  Loader2,
  Cpu,
  Activity
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import ResumeUpload from "@/components/dashboard/ResumeUpload";
import AnalysisRunner from "@/components/dashboard/AnalysisRunner";
import Onboarding from "@/components/dashboard/Onboarding";
import RoleEditor from "@/components/dashboard/RoleEditor";
import { Edit2 } from "lucide-react";

interface ProfileData {
  id: number;
  full_name: string;
  email: string;
  analysis_count: number;
  profile: {
    target_roles: string[];
    skills: string[];
  } | null;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showRoleEditor, setShowRoleEditor] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/proxy/profile/me");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        if (!data.profile || !data.profile.target_roles || data.profile.target_roles.length === 0) {
          setShowOnboarding(true);
        } else {
          setShowOnboarding(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile();
    }
  }, [isLoaded, user]);

  if (!isLoaded) return null;

  return (
    <div className="section-container pb-20 space-y-16">
      {showOnboarding && <Onboarding onComplete={fetchProfile} />}
      {showRoleEditor && profile && (
        <RoleEditor 
          currentRoles={profile.profile?.target_roles || []} 
          onSave={fetchProfile} 
          onClose={() => setShowRoleEditor(false)} 
        />
      )}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <p className="text-minimal text-white/40">SYSTEM_DASHBOARD</p>
          <h1 className="text-5xl md:text-7xl font-tech font-bold tracking-tighter uppercase italic">
            OPERATOR_{user?.firstName || "UNKNOWN"}
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-minimal">STATUS_OPTIMAL</span>
        </div>
      </div>

      <div className="h-px w-full bg-white/5" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        <div className="card-minimal border-l-0 border-r-0 md:border-l border-white/5 relative group">
          <button 
            onClick={() => setShowRoleEditor(true)}
            className="absolute top-6 right-6 p-2 opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            title="EDIT_TARGETS"
          >
            <Edit2 className="w-3 h-3 text-white/40" />
          </button>
          <Target className="w-5 h-5 mb-8 text-white/40" />
          <p className="text-minimal text-white/40 mb-2">TARGET_TRAJECTORY</p>
          <p className="text-xl font-bold tracking-tight uppercase truncate">
            {profile?.profile?.target_roles?.[0] || "NOT_DEFINED"}
          </p>
          {profile?.profile?.target_roles && profile.profile.target_roles.length > 1 && (
            <p className="text-[8px] text-white/20 mt-1 uppercase tracking-widest">
              + {profile.profile.target_roles.length - 1} OTHER_TARGETS
            </p>
          )}
        </div>
        <div className="card-minimal border-l-0 border-r-0 border-white/5">
          <Cpu className="w-5 h-5 mb-8 text-white/40" />
          <p className="text-minimal text-white/40 mb-2">DETECTED_SKILLS</p>
          <p className="text-4xl font-tech font-bold tracking-tighter">
            {profile?.profile?.skills?.length || 0}
          </p>
        </div>
        <div className="card-minimal border-l-0 border-r-0 md:border-r border-white/5">
          <Briefcase className="w-5 h-5 mb-8 text-white/40" />
          <p className="text-minimal text-white/40 mb-2">JOBS_ANALYZED</p>
          <p className="text-4xl font-tech font-bold tracking-tighter">
            {profile?.analysis_count || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-12">
          <div className="space-y-6">
            <h2 className="text-minimal text-white/40">SYSTEM_ACTIONS</h2>
            <div className="space-y-4">
              <ResumeUpload onUploadSuccess={fetchProfile} />
              <AnalysisRunner />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-minimal text-white/40">SKILL_INVENTORY</h2>
              <p className="text-[10px] text-white/20">TOTAL_{profile?.profile?.skills?.length || 0}</p>
            </div>
            
            <div className="card-minimal min-h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-6 w-6 animate-spin text-white/20" />
                </div>
              ) : profile?.profile?.skills && profile.profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {profile.profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 border border-white/10 text-[10px] tracking-[0.2em] font-medium uppercase hover:border-white/30 transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                  <BrainCircuit className="h-12 w-12 mb-6" />
                  <p className="text-minimal">NO_DATA_EXTRACTED</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { User, Mail, Shield, Calendar, Loader2, Edit3, Target, Cpu } from "lucide-react";

interface ProfileData {
  id: number;
  full_name: string;
  email: string;
  profile: {
    target_roles: string[];
    target_role: string;
    skills: string[];
  } | null;
}

export default function ProfilePage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/proxy/profile/me");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isUserLoaded && user) {
      fetchProfile();
    }
  }, [isUserLoaded, user]);

  if (!isUserLoaded || isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <p className="text-minimal text-white/40">USER_PROFILE</p>
          <h1 className="text-5xl md:text-7xl font-tech font-bold tracking-tighter uppercase italic">
            {user?.firstName || "PLAYER"}
          </h1>
        </div>
        <button className="px-8 py-3 border border-white/10 hover:border-white/40 transition-all text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3">
          <Edit3 className="w-3 h-3" />
          UPDATE_IDENTITY
        </button>
      </div>

      <div className="h-px w-full bg-white/5" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="card-minimal space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border border-white/10 flex items-center justify-center">
                <User className="w-6 h-6 text-white/40" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Full Name</p>
                <p className="text-sm font-bold uppercase">{user?.fullName || "Not Set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border border-white/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-white/40" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Email Address</p>
                <p className="text-sm font-bold uppercase">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border border-white/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white/40" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Security Level</p>
                <p className="text-sm font-bold uppercase">AUTHORIZED_USER</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border border-white/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white/40" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Member Since</p>
                <p className="text-sm font-bold uppercase">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-minimal">
              <div className="flex items-center gap-3 mb-6">
                 <Target className="w-4 h-4 text-white/40" />
                 <h2 className="text-minimal text-white/40">TARGET_TRAJECTORIES</h2>
              </div>
              <div className="space-y-2">
                {profile?.profile?.target_roles && profile.profile.target_roles.length > 0 ? (
                  profile.profile.target_roles.map((role, idx) => (
                    <p key={idx} className="text-xl font-tech font-bold uppercase tracking-tight">
                      {role}
                    </p>
                  ))
                ) : (
                  <p className="text-xl font-tech font-bold uppercase tracking-tight">
                    {profile?.profile?.target_role || "NOT_DEFINED"}
                  </p>
                )}
              </div>
            </div>

            <div className="card-minimal">
              <div className="flex items-center gap-3 mb-6">
                 <Cpu className="w-4 h-4 text-white/40" />
                 <h2 className="text-minimal text-white/40">SKILL_METRICS</h2>
              </div>
              <p className="text-2xl font-tech font-bold tracking-tighter">
                {profile?.profile?.skills?.length || 0} <span className="text-sm text-white/20 font-sans tracking-widest ml-2">SKILLS_DETECTED</span>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-minimal text-white/40">TECHNICAL_COMPETENCIES</h2>
            <div className="card-minimal min-h-[200px]">
              {profile?.profile?.skills && profile.profile.skills.length > 0 ? (
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
                <div className="flex items-center justify-center py-12 opacity-20">
                  <p className="text-[10px] uppercase tracking-widest">No Competencies Mapped</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

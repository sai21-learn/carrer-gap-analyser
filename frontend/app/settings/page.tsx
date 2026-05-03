"use client"

import { useState, useEffect } from "react"
import { useUser, SignOutButton } from "@clerk/nextjs"
import { User, Shield, Bell, CreditCard, LogOut, Save, Plus, X } from "lucide-react"

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const [profile, setProfile] = useState({
    fullName: "",
    targetRoles: [] as string[],
    email: "",
  })
  const [newRole, setNewRole] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      // Fetch profile from backend
      fetch("/api/proxy/profile/me")
        .then(res => res.json())
        .then(data => {
          setProfile({
            fullName: data.full_name || user.fullName || "",
            targetRoles: data.profile?.target_roles || (data.profile?.target_role ? [data.profile.target_role] : []),
            email: user.primaryEmailAddress?.emailAddress || "",
          })
        })
    }
  }, [isLoaded, user])

  const addRole = () => {
    if (newRole && !profile.targetRoles.includes(newRole)) {
      setProfile({
        ...profile,
        targetRoles: [...profile.targetRoles, newRole]
      })
      setNewRole("")
    }
  }

  const removeRole = (roleToRemove: string) => {
    setProfile({
      ...profile,
      targetRoles: profile.targetRoles.filter(role => role !== roleToRemove)
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/proxy/profile/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: profile.fullName,
          target_roles: profile.targetRoles,
        })
      })
      if (res.ok) {
        // Success notification?
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isLoaded) return null

  return (
    <div className="min-h-screen bg-black text-white section-container py-20">
      <div className="max-w-4xl">
        <p className="text-minimal text-white/40 mb-8">SYSTEM_PREFERENCES</p>
        <h1 className="text-6xl md:text-8xl font-tech font-bold tracking-tighter mb-12 uppercase italic">
          SETTINGS_INIT
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Sidebar Nav */}
          <div className="md:col-span-1 space-y-4">
            {[
              { icon: User, label: "PROFILE", active: true },
              { icon: Shield, label: "SECURITY", active: false },
              { icon: Bell, label: "NOTIFS", active: false },
              { icon: CreditCard, label: "BILLING", active: false },
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center gap-4 p-4 border ${item.active ? "border-white/20 bg-white/5" : "border-transparent text-white/40"} hover:border-white/10 hover:bg-white/[0.02] transition-all`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-[10px] tracking-[0.2em] font-medium uppercase">{item.label}</span>
              </button>
            ))}
            
            <div className="pt-8">
              <SignOutButton>
                <button className="w-full flex items-center gap-4 p-4 border border-red-900/20 text-red-500/60 hover:bg-red-900/10 transition-all">
                  <LogOut className="w-4 h-4" />
                  <span className="text-[10px] tracking-[0.2em] font-medium uppercase">TERMINATE_SESSION</span>
                </button>
              </SignOutButton>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 card-minimal space-y-12">
            <div className="space-y-8">
              <h2 className="text-minimal text-white/40">USER_PROFILE_DATA</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[8px] tracking-[0.4em] text-white/20 uppercase">IDENTITY_LABEL</label>
                  <input 
                    type="text" 
                    value={profile.fullName}
                    onChange={e => setProfile({...profile, fullName: e.target.value})}
                    className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-white transition-all font-light font-mono text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] tracking-[0.4em] text-white/20 uppercase">COMM_CHANNEL</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    disabled
                    className="w-full bg-transparent border-b border-white/10 py-2 text-white/40 font-light cursor-not-allowed font-mono text-sm" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[8px] tracking-[0.4em] text-white/20 uppercase">TARGET_TRAJECTORIES</label>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.targetRoles.map(role => (
                    <div key={role} className="flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 text-[10px] font-mono uppercase">
                      {role}
                      <button onClick={() => removeRole(role)} className="hover:text-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {profile.targetRoles.length === 0 && (
                    <p className="text-[10px] text-white/20 uppercase italic">NO_ROLES_DEFINED</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addRole()}
                    className="flex-grow bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-white transition-all font-light font-mono text-sm" 
                    placeholder="ADD_NEW_ROLE (e.g. SYSTEMS_ARCHITECT)"
                  />
                  <button 
                    onClick={addRole}
                    className="px-4 border border-white/10 hover:bg-white hover:text-black transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="btn-minimal flex items-center gap-4 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "SAVING_DATA..." : "COMMIT_CHANGES"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

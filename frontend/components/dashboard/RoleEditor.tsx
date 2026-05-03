"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Plus, 
  Target, 
  Loader2,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleEditorProps {
  currentRoles: string[];
  onSave: (roles: string[]) => void;
  onClose: () => void;
}

export default function RoleEditor({ currentRoles, onSave, onClose }: RoleEditorProps) {
  const [roles, setRoles] = useState<string[]>(currentRoles);
  const [supportedRoles, setSupportedRoles] = useState<string[]>([]);
  const [customRole, setCustomRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/proxy/profile/supported-roles");
        if (res.ok) {
          const data = await res.json();
          setSupportedRoles(data);
        }
      } catch (error) {
        console.error("Failed to fetch supported roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const toggleRole = (role: string) => {
    if (roles.includes(role)) {
      setRoles(roles.filter(r => r !== role));
    } else {
      setRoles([...roles, role]);
    }
  };

  const addCustomRole = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (customRole && !roles.includes(customRole)) {
      setRoles([...roles, customRole]);
      setCustomRole("");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/proxy/profile/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles })
      });
      if (res.ok) {
        onSave(roles);
        onClose();
      }
    } catch (error) {
      console.error("Failed to save roles:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-black border border-white/10 p-8 md:p-12 space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-minimal text-white/40">SYSTEM_CONFIGURATION</p>
            <h2 className="text-3xl font-tech font-bold uppercase italic tracking-tighter">REDEFINE_TARGETS</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 transition-colors">
            <X className="w-6 h-6 text-white/40 hover:text-white" />
          </button>
        </div>

        <div className="h-px w-full bg-white/5" />

        <div className="space-y-6">
          <h3 className="text-minimal text-white/40 uppercase">Predefined_Templates</h3>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-white/20" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {supportedRoles.map(role => (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={cn(
                    "px-4 py-3 border text-[10px] font-bold uppercase tracking-widest text-left transition-all flex justify-between items-center",
                    roles.includes(role) 
                      ? "bg-white text-black border-white" 
                      : "border-white/10 text-white/40 hover:border-white/40 hover:text-white"
                  )}
                >
                  {role}
                  {roles.includes(role) && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-minimal text-white/40 uppercase">Custom_Definition</h3>
          <div className="relative group">
            <Plus className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomRole()}
              placeholder="ENTER_NEW_TARGET..."
              className="w-full bg-white/5 border border-white/10 p-5 pl-14 text-xs font-tech uppercase tracking-widest outline-none focus:border-white/40 transition-all"
            />
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-8 py-4 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            DISCARD_CHANGES
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 btn-minimal p-4 text-xs flex items-center justify-center gap-3"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "SYCHRONIZE_PROFILE"}
          </button>
        </div>
      </div>
    </div>
  );
}

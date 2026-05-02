"use client";

import { useState } from "react";
import { X, Check, Edit, Plus, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillNormalizationProps {
  initialSkills: string[];
  onSave: (normalizedSkills: string[]) => void;
  onCancel: () => void;
}

export default function SkillNormalization({
  initialSkills,
  onSave,
  onCancel,
}: SkillNormalizationProps) {
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditText(skills[index]);
  };

  const handleUpdateSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = editText;
    setSkills(updatedSkills);
    setEditIndex(null);
    setEditText("");
  };

  return (
    <div className="border border-white/10 bg-white/5 p-8">
      <div className="flex items-center gap-3 mb-8">
        <BrainCircuit className="h-4 w-4 text-white" />
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">Data_Review_Terminal</h2>
      </div>

      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-10 leading-relaxed">
        Verify and normalize extracted skill data before system synchronization.
      </p>

      <div className="space-y-3 mb-8">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center justify-between border border-white/5 bg-white/5 p-4 group hover:border-white/20 transition-all"
          >
            {editIndex === index ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="bg-transparent focus:outline-none flex-grow text-[10px] font-bold uppercase tracking-widest text-white"
                onBlur={() => handleUpdateSkill(index)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdateSkill(index)}
                autoFocus
              />
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-white transition-colors">
                {skill}
              </span>
            )}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleEdit(index)}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <Edit className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleRemoveSkill(index)}
                className="text-muted-foreground hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-10">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="ADD_MANUAL_NODE"
          className="flex-grow bg-white/5 border border-white/10 px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-white/30"
        />
        <button
          onClick={handleAddSkill}
          className="aspect-square flex items-center justify-center border border-white/10 hover:bg-white hover:text-black transition-all p-3"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex justify-end gap-6 border-t border-white/10 pt-8">
        <button
          onClick={onCancel}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors"
        >
          ABORT_PROCESS
        </button>
        <button
          onClick={() => onSave(skills)}
          className="bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all"
        >
          COMMIT_CHANGES
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { X, Check, Edit, Plus } from "lucide-react";

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
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-950">
      <h2 className="text-lg font-semibold mb-4">Review Your Skills</h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        Edit, add, or remove skills to ensure your profile is accurate.
      </p>

      <div className="space-y-2 mb-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800"
          >
            {editIndex === index ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="bg-transparent focus:outline-none flex-grow"
                onBlur={() => handleUpdateSkill(index)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdateSkill(index)}
                autoFocus
              />
            ) : (
              <span>{skill}</span>
            )}
            <div className="flex items-center">
              <button
                onClick={() => handleEdit(index)}
                className="p-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleRemoveSkill(index)}
                className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a new skill"
          className="flex-grow rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800"
        />
        <button
          onClick={handleAddSkill}
          className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(skills)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Save Skills
        </button>
      </div>
    </div>
  );
}

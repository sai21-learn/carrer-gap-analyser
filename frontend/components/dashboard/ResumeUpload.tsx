"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import SkillNormalization from "./SkillNormalization";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ResumeUploadProps {
  onUploadSuccess?: () => void;
}

export default function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error" | "review"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setUploadStatus("error");
        setErrorMessage("Please upload a PDF file.");
        return;
      }
      setFile(selectedFile);
      setUploadStatus("idle");
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type !== "application/pdf") {
        setUploadStatus("error");
        setErrorMessage("Please upload a PDF file.");
        return;
      }
      setFile(selectedFile);
      setUploadStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setUploadStatus("idle");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/proxy/profile/resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed");
      }

      const data = await response.json();
      setExtractedSkills(data.skills);
      setUploadStatus("review");
    } catch (err) {
      setUploadStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSkills = async (normalizedSkills: string[]) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/proxy/profile/skills", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills: normalizedSkills }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save skills");
      }

      setUploadStatus("success");
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setUploadStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReview = () => {
    setFile(null);
    setUploadStatus("idle");
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus("idle");
  };

  if (uploadStatus === "review") {
    return (
      <SkillNormalization
        initialSkills={extractedSkills}
        onSave={handleSaveSkills}
        onCancel={handleCancelReview}
      />
    );
  }


  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-950">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Update Your Resume</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Upload your latest resume (PDF) to analyze your skills and get better
          recommendations.
        </p>
      </div>

      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={cn(
          "relative mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          file
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
            : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700",
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />

        {file ? (
          <div className="flex w-full flex-col items-center">
            <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="mb-1 text-sm font-medium">{file.name}</p>
            <p className="text-xs text-zinc-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={removeFile}
              className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="mb-4 rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
              <Upload className="h-8 w-8 text-zinc-500" />
            </div>
            <p className="mb-1 text-sm font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-zinc-500">PDF only (max 5MB)</p>
          </div>
        )}
      </div>

      {uploadStatus === "success" && (
        <div className="mt-4 flex items-center space-x-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>
            Resume successfully analyzed! Your skills are being updated.
          </span>
        </div>
      )}

      {uploadStatus === "error" && (
        <div className="mt-4 flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={cn(
          "mt-6 w-full flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
          !file || isUploading
            ? "bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800"
            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
        )}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze Resume"
        )}
      </button>
    </div>
  );
}

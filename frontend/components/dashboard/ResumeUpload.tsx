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
import { cn } from "@/lib/utils";

import SkillNormalization from "./SkillNormalization";

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
        setErrorMessage("INVALID_FORMAT: PDF_REQUIRED");
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
        setErrorMessage("INVALID_FORMAT: PDF_REQUIRED");
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
        throw new Error(errorData.detail || "UPLOAD_FAILED");
      }

      const data = await response.json();
      setExtractedSkills(data.extracted_skills);
      setUploadStatus("review");
    } catch (err) {
      setUploadStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "SYSTEM_ERROR",
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
        throw new Error(errorData.detail || "SAVE_FAILED");
      }

      setUploadStatus("success");
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setUploadStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "SYSTEM_ERROR",
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
    <div className="card-minimal">
      <div className="mb-8">
        <h2 className="text-minimal text-white/40">RESUME_INJECTION</h2>
        <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">
          Sync profile with system data.
        </p>
      </div>

      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={cn(
          "relative mt-2 flex flex-col items-center justify-center border border-dashed transition-all",
          file
            ? "border-white/40 bg-white/5"
            : "border-white/5 hover:border-white/20 bg-white/2",
          "p-12"
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
            <div className="mb-4 text-white/40">
              <FileText className="h-8 w-8" />
            </div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest">{file.name}</p>
            <p className="text-[10px] text-white/20">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={removeFile}
              className="absolute right-4 top-4 text-white/20 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="mb-4 text-white/20 group-hover:text-white/40 transition-colors">
              <Upload className="h-8 w-8" />
            </div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
              SELECT_FILE
            </p>
            <p className="text-[10px] text-white/20 uppercase tracking-widest opacity-50">PDF_ONLY</p>
          </div>
        )}
      </div>

      {uploadStatus === "success" && (
        <div className="mt-6 flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-emerald-500/60">
          <CheckCircle2 className="h-3 w-3" />
          <span>DATA_INJECTED</span>
        </div>
      )}

      {uploadStatus === "error" && (
        <div className="mt-6 flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-red-500/60">
          <AlertCircle className="h-3 w-3" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={cn(
          "mt-8 w-full btn-minimal",
          (!file || isUploading) && "opacity-20 cursor-not-allowed"
        )}
      >
        {isUploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>EXTRACTING...</span>
          </div>
        ) : (
          "EXECUTE_EXTRACTION"
        )}
      </button>
    </div>
  );
}

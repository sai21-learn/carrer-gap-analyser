"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function AnalysisRunner() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [progress, setProgress] = useState(0);

  const startAnalysis = async () => {
    setTaskId(null);
    setStatus("STARTING");
    setResult(null);
    setProgress(0);

    const response = await fetch("/api/analysis/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_role: "Software Engineer" }), // Example role
    });

    if (response.ok) {
      const data = await response.json();
      setTaskId(data.task_id);
    } else {
      setStatus("ERROR");
      setResult({ error: "Failed to start analysis." });
    }
  };

  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      const response = await fetch(`/api/analysis/status/${taskId}`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data.state);
        if (data.state === "SUCCESS") {
          setResult(data.result);
          setTaskId(null);
          clearInterval(interval);
        } else if (data.state === "FAILURE") {
          setResult({ error: "Analysis failed." });
          setTaskId(null);
          clearInterval(interval);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [taskId]);

  useEffect(() => {
    if (status === "PENDING" || status === "STARTING") {
      const timer = setTimeout(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === "SUCCESS" || status === "FAILURE") {
      setProgress(100);
    }
  }, [status, progress]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Gap Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={startAnalysis} disabled={!!taskId}>
            Start New Analysis
          </Button>

          {status && (
            <div>
              <p>Status: {status}</p>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {result && (
            <div>
              <h3 className="text-lg font-semibold">Analysis Report</h3>
              {result.error ? (
                <p className="text-red-500">{result.error}</p>
              ) : (
                <pre className="p-4 bg-gray-100 rounded-md">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

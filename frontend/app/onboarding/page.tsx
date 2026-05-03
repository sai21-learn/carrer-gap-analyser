"use client";

import Onboarding from "@/components/dashboard/Onboarding";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black">
      <Onboarding onComplete={handleComplete} />
    </div>
  );
}

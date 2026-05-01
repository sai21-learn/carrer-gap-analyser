import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="flex items-center gap-2 mb-6">
        <Compass className="w-12 h-12 text-blue-600" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">CareerCompass AI</h1>
      </div>
      <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mb-8">
        Navigate your professional journey. Identify skill gaps, find matching roles, and get personalized learning resources.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
      >
        Get Started
        <ArrowRight className="ml-2 h-5 w-5" />
      </Link>
    </div>
  );
}

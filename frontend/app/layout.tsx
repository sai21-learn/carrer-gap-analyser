import type { Metadata } from "next";
import { Tomorrow } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const tomorrow = Tomorrow({ 
  subsets: ["latin"], 
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: "--font-tomorrow" 
});

export const metadata: Metadata = {
  title: "Career Gap Analyzer | AI-Powered Skill Detection",
  description: "Identify and bridge your career skill gaps with AI",
};

import Navigation from "@/components/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${tomorrow.variable} dark`}>
      <body className="bg-black text-white antialiased font-sans selection:bg-white selection:text-black">
        <Providers>
          <Navigation />
          <main className="min-h-screen relative pt-24">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

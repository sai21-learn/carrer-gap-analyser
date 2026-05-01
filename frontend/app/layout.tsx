import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerCompass AI",
  description: "Identify and bridge your career skill gaps with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

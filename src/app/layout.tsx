import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/layout/providers";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { getStreakStats } from "@/db/queries/streaks";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FounderOS — Adaptive Self-Development Dashboard",
  description: "A daily operating system for the AI-native founder's mind",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let currentStreak = 0;
  try {
    const stats = await getStreakStats();
    currentStreak = stats.currentStreak;
  } catch {
    // DB not connected yet — that's fine
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header currentStreak={currentStreak} />
              <main className="flex-1 overflow-y-auto p-6">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

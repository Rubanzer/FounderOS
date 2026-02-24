"use client";

import { Moon, Sun, Flame } from "lucide-react";
import { useTheme } from "./theme-provider";

interface HeaderProps {
  currentStreak: number;
}

export function Header({ currentStreak }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border bg-surface/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        {currentStreak > 0 && (
          <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
            <Flame className="w-4 h-4" />
            <span>{currentStreak} day streak</span>
          </div>
        )}
      </div>

      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-foreground"
        aria-label="Toggle theme"
      >
        {resolvedTheme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </header>
  );
}

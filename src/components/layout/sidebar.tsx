"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Brain, BookOpen, PenLine, BarChart3 } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  brain: Brain,
  "book-open": BookOpen,
  "pen-line": PenLine,
  "bar-chart-3": BarChart3,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col shrink-0">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-semibold text-lg">FounderOS</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-600/10 text-brand-600 dark:text-brand-400"
                      : "text-muted hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted text-center">
          Build your mind daily.
        </p>
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";
import { ShieldAlert, Send } from "lucide-react";

interface ResponseInputProps {
  onSubmit: (response: string) => void;
  isLoading?: boolean;
}

export function ResponseInput({ onSubmit, isLoading }: ResponseInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSubmit(value.trim());
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-500/10 px-3 py-2 rounded-lg">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
        <span>This is your brain&apos;s gym. No AI allowed. Paste is disabled.</span>
      </div>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPaste={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder="Type your answer here..."
        className="w-full min-h-[120px] p-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted resize-y focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
        disabled={isLoading}
      />

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {isLoading ? "Evaluating..." : "Submit Answer"}
        </button>
      </div>
    </div>
  );
}

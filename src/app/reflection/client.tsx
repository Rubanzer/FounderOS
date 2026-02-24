"use client";

import { useState } from "react";
import { PenLine, Sparkles, Loader2, Send, Calendar } from "lucide-react";
import { saveJournalEntry } from "@/actions/journal-actions";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface JournalEntry {
  id: number;
  date: string;
  type: string;
  prompt: string | null;
  response: string;
  createdAt: Date;
}

interface ReflectionPageClientProps {
  entries: JournalEntry[];
  todayReflection: JournalEntry | null;
}

export function ReflectionPageClient({ entries, todayReflection }: ReflectionPageClientProps) {
  const [prompt, setPrompt] = useState<string | null>(todayReflection?.prompt || null);
  const [response, setResponse] = useState(todayReflection?.response || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(!!todayReflection);
  const router = useRouter();

  const generatePrompt = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/reflection/generate", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      setPrompt(data.prompt);
    } catch {
      setPrompt("What did you learn today that challenged your existing assumptions?");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!response.trim()) return;
    setIsSaving(true);
    try {
      await saveJournalEntry({
        prompt,
        response: response.trim(),
        type: "daily_reflection",
      });
      setSaved(true);
      router.refresh();
    } catch {
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-brand-600/10">
          <PenLine className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Daily Reflection</h1>
          <p className="text-sm text-muted">
            {formatDate(new Date())}
          </p>
        </div>
      </div>

      {/* Reflection form */}
      <div className="p-6 rounded-xl border border-border bg-surface space-y-4">
        {/* Prompt */}
        {prompt ? (
          <div className="p-4 rounded-lg bg-brand-500/5 border border-brand-500/20">
            <p className="text-sm font-medium">{prompt}</p>
          </div>
        ) : (
          <button
            onClick={generatePrompt}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border hover:border-brand-500/30 hover:bg-surface-hover transition-all w-full justify-center"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
            ) : (
              <Sparkles className="w-4 h-4 text-brand-500" />
            )}
            <span className="text-sm text-muted">
              {isGenerating ? "Generating prompt..." : "Generate today's reflection prompt"}
            </span>
          </button>
        )}

        {/* Response */}
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write your reflection... (3-5 sentences)"
          rows={6}
          disabled={saved}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted resize-y focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-60"
        />

        {/* Save */}
        {!saved ? (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={!response.trim() || isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : "Save Reflection"}
            </button>
          </div>
        ) : (
          <p className="text-xs text-success text-center">Saved for today</p>
        )}
      </div>

      {/* Past entries */}
      {entries.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted">Past Reflections</h2>
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-xl border border-border bg-surface space-y-2"
            >
              <div className="flex items-center gap-2 text-xs text-muted">
                <Calendar className="w-3 h-3" />
                {formatDate(entry.date)}
              </div>
              {entry.prompt && (
                <p className="text-xs text-muted italic">{entry.prompt}</p>
              )}
              <p className="text-sm">{entry.response}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

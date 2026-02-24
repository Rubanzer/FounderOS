"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { LearningItemCard } from "./learning-item-card";
import { TIER_LABELS, SKILL_AREA_LABELS, type SkillArea } from "@/types/learning";

interface LearningItem {
  id: number;
  title: string;
  type: string;
  tier: number;
  skillArea: string;
  status: string;
  timeSpentMinutes: number | null;
  estimatedMinutes: number | null;
}

interface CurriculumListProps {
  items: LearningItem[];
  onLogSession: (itemId: number) => void;
  onUpdateStatus: (itemId: number, status: string) => void;
}

export function CurriculumList({ items, onLogSession, onUpdateStatus }: CurriculumListProps) {
  const [expandedTiers, setExpandedTiers] = useState<Record<number, boolean>>({ 1: true });
  const [filterSkill, setFilterSkill] = useState<string>("all");

  const tiers = [1, 2, 3];
  const skillAreas = [...new Set(items.map((i) => i.skillArea))].sort();

  const filteredItems = filterSkill === "all"
    ? items
    : items.filter((i) => i.skillArea === filterSkill);

  const toggleTier = (tier: number) => {
    setExpandedTiers((prev) => ({ ...prev, [tier]: !prev[tier] }));
  };

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted">Filter:</span>
        <select
          value={filterSkill}
          onChange={(e) => setFilterSkill(e.target.value)}
          className="text-xs border border-border rounded-lg px-2 py-1 bg-background text-foreground"
        >
          <option value="all">All Skills</option>
          {skillAreas.map((sa) => (
            <option key={sa} value={sa}>
              {SKILL_AREA_LABELS[sa as SkillArea] || sa}
            </option>
          ))}
        </select>
      </div>

      {/* Tier accordions */}
      {tiers.map((tier) => {
        const tierItems = filteredItems.filter((i) => i.tier === tier);
        if (tierItems.length === 0) return null;

        const completed = tierItems.filter((i) => i.status === "completed").length;
        const isExpanded = expandedTiers[tier];

        return (
          <div key={tier} className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleTier(tier)}
              className="w-full flex items-center justify-between px-5 py-3 bg-surface hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted" />
                )}
                <span className="font-medium text-sm">
                  {TIER_LABELS[tier] || `Tier ${tier}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">
                  {completed}/{tierItems.length}
                </span>
                <div className="w-20 h-1.5 bg-border rounded-full">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all"
                    style={{
                      width: `${tierItems.length > 0 ? (completed / tierItems.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </button>

            {isExpanded && (
              <div className="divide-y divide-border">
                {tierItems.map((item) => (
                  <LearningItemCard
                    key={item.id}
                    item={item}
                    onLogSession={() => onLogSession(item.id)}
                    onUpdateStatus={(status) => onUpdateStatus(item.id, status)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

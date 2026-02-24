"use client";

interface HeatmapDay {
  date: string;
  blocksCompleted: string[] | null;
  isRestDay: boolean;
  isComplete: boolean;
}

interface HeatmapCalendarProps {
  data: HeatmapDay[];
  months?: number;
}

export function HeatmapCalendar({ data, months = 6 }: HeatmapCalendarProps) {
  // Generate dates for the heatmap
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - months);
  // Start from the beginning of the week
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days: { date: string; data?: HeatmapDay }[] = [];
  const current = new Date(startDate);

  while (current <= today) {
    const dateStr = current.toISOString().split("T")[0];
    const dayData = data.find((d) => d.date === dateStr);
    days.push({ date: dateStr, data: dayData });
    current.setDate(current.getDate() + 1);
  }

  // Group into weeks
  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Month labels
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstDay = new Date(week[0].date);
    if (firstDay.getMonth() !== lastMonth) {
      lastMonth = firstDay.getMonth();
      monthLabels.push({
        label: firstDay.toLocaleString("default", { month: "short" }),
        col: i,
      });
    }
  });

  const getCellColor = (day: { date: string; data?: HeatmapDay }) => {
    if (!day.data) return "bg-border/50";
    if (day.data.isRestDay) return "bg-muted/30";
    if (day.data.isComplete) {
      const blocks = day.data.blocksCompleted?.length || 0;
      if (blocks >= 3) return "bg-emerald-500";
      if (blocks >= 2) return "bg-emerald-400";
      return "bg-emerald-300 dark:bg-emerald-600";
    }
    if ((day.data.blocksCompleted?.length || 0) > 0) {
      return "bg-emerald-200 dark:bg-emerald-800";
    }
    return "bg-border/50";
  };

  return (
    <div className="space-y-2">
      {/* Month labels */}
      <div className="flex gap-[3px] pl-8 text-xs text-muted">
        {monthLabels.map(({ label, col }) => (
          <span
            key={`${label}-${col}`}
            style={{
              position: "relative",
              left: `${col * 13}px`,
            }}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex gap-0.5">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] text-xs text-muted pr-2 pt-0">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
            <div key={i} className="h-[11px] flex items-center text-[10px]">
              {label}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={day.date}
                  className={`w-[11px] h-[11px] rounded-sm ${getCellColor(day)} transition-colors`}
                  title={`${day.date}${
                    day.data?.isComplete
                      ? " (Complete)"
                      : day.data?.isRestDay
                      ? " (Rest Day)"
                      : day.data?.blocksCompleted?.length
                      ? ` (${day.data.blocksCompleted.length} blocks)`
                      : ""
                  }`}
                />
              ))}
              {/* Pad if week is incomplete */}
              {week.length < 7 &&
                Array.from({ length: 7 - week.length }).map((_, i) => (
                  <div key={`pad-${i}`} className="w-[11px] h-[11px]" />
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-muted pl-8">
        <span>Less</span>
        <div className="w-[11px] h-[11px] rounded-sm bg-border/50" />
        <div className="w-[11px] h-[11px] rounded-sm bg-emerald-200 dark:bg-emerald-800" />
        <div className="w-[11px] h-[11px] rounded-sm bg-emerald-300 dark:bg-emerald-600" />
        <div className="w-[11px] h-[11px] rounded-sm bg-emerald-400" />
        <div className="w-[11px] h-[11px] rounded-sm bg-emerald-500" />
        <span>More</span>
        <span className="ml-2">|</span>
        <div className="w-[11px] h-[11px] rounded-sm bg-muted/30" />
        <span>Rest</span>
      </div>
    </div>
  );
}

import {
  CalendarCheck,
  Circle,
} from "lucide-react";

import {
  Card,
} from "@/components/launchly/AppShell";

import type {
  DashboardWeeklyPlanItem,
} from "@/features/dashboard/types/dashboard";

type WeeklyActionPlanProps = {
  items: DashboardWeeklyPlanItem[];
};

export function WeeklyActionPlan({
  items,
}: WeeklyActionPlanProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CalendarCheck className="size-4 text-cyan-300" />
          Weekly action plan
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-white/50">
          {items.length} tasks
        </span>
      </div>

      <div className="relative space-y-3">
        {items.length === 0 && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm text-white/50">
            Run an AI review to generate your weekly career action plan.
          </div>
        )}

        {items.map((item, index) => (
          <div
            key={`${item.day}-${item.title}-${index}`}
            className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-cyan-300/20 hover:bg-white/[0.05]"
          >
            <div className="flex items-start gap-3">
              <Circle className="mt-0.5 size-4 shrink-0 text-cyan-300/70" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-[10px] font-semibold text-cyan-200">
                    {item.day}
                  </span>

                  <div className="text-sm font-semibold text-white/90">
                    {item.title}
                  </div>
                </div>

                <div className="mt-2 text-xs leading-5 text-muted-foreground">
                  {item.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

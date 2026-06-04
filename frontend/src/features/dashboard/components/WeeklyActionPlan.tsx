import { CalendarCheck, Target } from "lucide-react";

import { Card } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";

import type { DashboardWeeklyPlanItem } from "@/features/dashboard/types/dashboard";

type WeeklyActionPlanProps = {
  items: DashboardWeeklyPlanItem[];
};

export function WeeklyActionPlan({ items }: WeeklyActionPlanProps) {
  const { t } = useI18n();

  return (
    <Card className="relative overflow-hidden border-white/[0.08] bg-[radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.10),transparent_34%),rgba(255,255,255,0.028)] p-0">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
      <div className="relative p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-cyan-100/60">
              <CalendarCheck className="size-3.5" />
              {t("dashboard.weeklyMission")}
            </div>
            <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-white">{t("dashboard.weeklyActionPlanTitle")}</h2>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-center">
            <div className="text-lg font-semibold text-white">{items.length}</div>
            <div className="text-[0.6rem] uppercase tracking-[0.14em] text-white/35">
              {t("dashboard.tasksLabel")}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {items.length === 0 && <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4 text-sm text-white/50">{t("dashboard.weeklyActionPlanEmpty")}</div>}
          {items.slice(0, 5).map((item, index) => (
            <div key={`${item.day}-${item.title}-${index}`} className="rounded-xl border border-white/[0.08] bg-black/20 p-3 transition hover:border-cyan-300/20 hover:bg-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04]">
                  <Target className="size-3.5 text-cyan-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-cyan-300/10 bg-cyan-300/[0.06] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-cyan-100">{item.day}</span>
                    <div className="truncate text-[13px] font-semibold text-white">{item.title}</div>
                  </div>
                  <div className="mt-1 line-clamp-2 text-[11px] leading-4 text-muted-foreground">{item.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

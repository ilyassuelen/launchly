import { Radar, Sparkles } from "lucide-react";

import { Card } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";

import type { DashboardMissingSkill } from "@/features/dashboard/types/dashboard";

type SkillGapRadarProps = {
  skills: DashboardMissingSkill[];
};

function getPriorityClass(priority?: string) {
  if (priority === "high") return "border-violet-300/20 bg-violet-400/15 text-violet-100";
  if (priority === "medium") return "border-cyan-300/15 bg-cyan-400/10 text-cyan-100";
  return "border-white/10 bg-white/[0.04] text-white/60";
}

export function SkillGapRadar({ skills }: SkillGapRadarProps) {
  const { t } = useI18n();
  const highPriorityCount = skills.filter((skill) => skill.priority === "high").length;

  return (
    <Card className="relative overflow-hidden border-white/[0.08] bg-[radial-gradient(circle_at_0%_0%,rgba(124,92,255,0.10),transparent_32%),rgba(255,255,255,0.028)] p-0">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/22 to-transparent" />
      <div className="relative p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-violet-100/60">
              <Radar className="size-3.5" />
              {t("dashboard.skillIntelligence")}
            </div>
            <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-white">{t("dashboard.skillGapRadarTitle")}</h2>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-center">
            <div className="text-lg font-semibold text-white">{highPriorityCount}</div>
            <div className="text-[0.6rem] uppercase tracking-[0.14em] text-white/35">
              {t("dashboard.urgentLabel")}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {skills.length === 0 && <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4 text-sm text-white/50">{t("dashboard.skillGapRadarEmpty")}</div>}
          {skills.map((skill) => (
            <span key={`${skill.skill}-${skill.priority}`} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${getPriorityClass(skill.priority)}`}>
              <Sparkles className="size-2.5" />
              {skill.skill}
            </span>
          ))}
        </div>

        {skills.length > 0 && (
          <div className="mt-3 rounded-xl border border-white/[0.08] bg-black/20 p-3">
            <div className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/45">
              <Sparkles className="size-3 text-cyan-200" />
              {t("dashboard.suggestedLearning")}
            </div>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              {skills.slice(0, 3).map((skill) => (
                <li key={`learn-${skill.skill}`} className="rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-2">
                  {t("dashboard.improveSkill", { skill: skill.skill })}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}

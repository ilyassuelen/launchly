import {
  Radar,
  Sparkles,
} from "lucide-react";

import {
  Card,
} from "@/components/launchly/AppShell";

import { useI18n } from "@/i18n/I18nContext";

import type {
  DashboardMissingSkill,
} from "@/features/dashboard/types/dashboard";

type SkillGapRadarProps = {
  skills: DashboardMissingSkill[];
};

function getPriorityClass(priority?: string) {
  if (priority === "high") {
    return "border-violet-300/20 bg-violet-400/15 text-violet-100";
  }

  if (priority === "medium") {
    return "border-cyan-300/15 bg-cyan-400/10 text-cyan-100";
  }

  return "border-white/10 bg-white/[0.04] text-white/60";
}

export function SkillGapRadar({
  skills,
}: SkillGapRadarProps) {
  const { t } = useI18n();
  const highPriorityCount =
    skills.filter((skill) => skill.priority === "high").length;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Radar className="size-4 text-violet-300" />
            {t("dashboard.skillGapRadarTitle")}
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            {t("dashboard.skillGapRadarDescription")}
          </div>
        </div>

        <div className="rounded-full border border-violet-300/10 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-100">
          {t("dashboard.urgent", {
            count: highPriorityCount,
          })}
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {skills.length === 0 && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-sm text-white/50">
            {t("dashboard.skillGapRadarEmpty")}
          </div>
        )}

        {skills.map((skill) => (
          <span
            key={`${skill.skill}-${skill.priority}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold ${getPriorityClass(skill.priority)}`}
          >
            <Sparkles className="size-3" />
            {skill.skill}
          </span>
        ))}
      </div>

      {skills.length > 0 && (
        <div className="relative mt-5 rounded-2xl border border-white/5 bg-black/10 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            {t("dashboard.suggestedLearning")}
          </div>

          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {skills.slice(0, 3).map((skill) => (
              <li key={`learn-${skill.skill}`}>
                • {t("dashboard.improveSkill", {
                  skill: skill.skill,
                })}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

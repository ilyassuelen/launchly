import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Layers3,
  ShieldAlert,
  Target,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";

import type { CareerPathSkillGap } from "../types/careerPath";

type CareerPathSkillGapsProps = {
  skillGaps: CareerPathSkillGap[];
};

function getPriorityLabel(
  priority: string,
  t: (key: string) => string,
) {
  const normalized = priority.toLowerCase();

  if (normalized === "high") {
    return t("careerPath.priorityHigh");
  }

  if (normalized === "medium") {
    return t("careerPath.priorityMedium");
  }

  if (normalized === "low") {
    return t("careerPath.priorityLow");
  }

  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function getPriorityStrength(priority: string) {
  const normalized = priority.toLowerCase();

  if (normalized === "high") return 88;
  if (normalized === "medium") return 62;

  return 38;
}

function getPriorityClassName(priority: string) {
  const normalized = priority.toLowerCase();

  if (normalized === "high") {
    return "border-orange-400/15 bg-orange-400/[0.08] text-orange-100";
  }

  if (normalized === "medium") {
    return "border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-100";
  }

  return "border-white/10 bg-white/[0.04] text-white/55";
}

function getProgressClassName(priority: string) {
  const normalized = priority.toLowerCase();

  if (normalized === "high") {
    return "from-orange-400 via-violet-400 to-cyan-300 shadow-[0_0_24px_rgba(249,115,22,0.18)]";
  }

  if (normalized === "medium") {
    return "from-cyan-300 via-violet-300 to-emerald-300 shadow-[0_0_22px_rgba(34,211,238,0.16)]";
  }

  return "from-white/40 to-white/20";
}

export function CareerPathSkillGaps({
  skillGaps,
}: CareerPathSkillGapsProps) {
  const { t } = useI18n();

  const highPriorityCount = skillGaps.filter(
    (gap) => gap.priority.toLowerCase() === "high",
  ).length;

  const nextFocus = skillGaps[0]?.skill || t("careerPath.noFocusSelected");

  return (
    <Card className="relative overflow-hidden border-cyan-300/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.94),rgba(8,13,24,0.98)_52%,rgba(22,38,48,0.62))] shadow-[0_24px_80px_rgba(6,182,212,0.05)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_38%)]" />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent" />

      <div className="relative">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/10 bg-cyan-400/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/70">
              <Layers3 className="size-3.5 text-cyan-300" />
              {t("careerPath.skillGapMatrix")}
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
              {t("careerPath.skillGapsTitle")}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
              {t("careerPath.skillGapsDescription")}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[420px]">
            <div className="rounded-2xl border border-white/7 bg-black/20 px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                {t("careerPath.gapsFound")}
              </div>

              <div className="mt-1 text-xl font-semibold text-white">
                {skillGaps.length}
              </div>
            </div>

            <div className="rounded-2xl border border-orange-300/10 bg-orange-400/[0.045] px-4 py-3">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-100/55">
                <ShieldAlert className="size-3.5" />
                {t("careerPath.highPriority")}
              </div>

              <div className="mt-1 text-xl font-semibold text-orange-100">
                {highPriorityCount}
              </div>
            </div>


          </div>
        </div>

        {skillGaps.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">
            {t("careerPath.noSkillGaps")}
          </div>
        ) : (
          <div className="overflow-hidden rounded-[2rem] border border-white/7 bg-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)_180px] border-b border-white/5 bg-white/[0.025] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35 lg:grid">
              <div>{t("careerPath.skill")}</div>
              <div>{t("careerPath.currentToTarget")}</div>
              <div className="text-right">{t("careerPath.focusIntensity")}</div>
            </div>

            <div className="divide-y divide-white/[0.055]">
              {skillGaps.map((gap, index) => {
                const strength = getPriorityStrength(gap.priority);

                return (
                  <div
                    key={`${gap.skill}-${index}`}
                    className="group relative grid gap-4 px-5 py-5 transition duration-300 hover:bg-white/[0.035] lg:grid-cols-[minmax(0,1.0fr)_minmax(0,1.3fr)_180px] lg:items-center"
                  >
                    <div className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-transparent transition group-hover:bg-cyan-300/35" />

                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <div className="grid size-8 place-items-center rounded-xl border border-cyan-300/10 bg-cyan-400/[0.055] text-cyan-100">
                          <AlertTriangle className="size-4" />
                        </div>

                        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                          {t("careerPath.gapNumber", {
                            number: index + 1,
                          })}
                        </div>

                        <div className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getPriorityClassName(gap.priority)}`}>
                          {getPriorityLabel(gap.priority, t)}
                        </div>
                      </div>

                      <h3 className="truncate text-base font-semibold tracking-tight text-white/92">
                        {gap.skill}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/45">
                        {gap.reason}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1 rounded-xl border border-white/5 bg-black/20 px-3 py-2">
                          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                            <Target className="size-3" />
                            {t("careerPath.current")}
                          </div>

                          <div className="truncate text-sm font-medium text-white/70">
                            {gap.current_level}
                          </div>
                        </div>

                        <ArrowRight className="hidden size-4 shrink-0 text-white/25 sm:block" />

                        <div className="min-w-0 flex-1 rounded-xl border border-cyan-300/10 bg-cyan-400/[0.055] px-3 py-2">
                          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100/50">
                            <CheckCircle2 className="size-3" />
                            {t("careerPath.target")}
                          </div>

                          <div className="truncate text-sm font-medium text-cyan-50/85">
                            {gap.target_level}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-semibold uppercase tracking-[0.14em] text-white/35">
                          {t("careerPath.focus")}
                        </span>

                        <span className="font-semibold text-white/65">
                          {strength}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getProgressClassName(gap.priority)}`}
                          style={{ width: `${strength}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
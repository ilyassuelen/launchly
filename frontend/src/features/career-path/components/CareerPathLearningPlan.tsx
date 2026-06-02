import {
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Layers3,
  Sparkles,
  Target,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";

import type { CareerPathLearningItem } from "../types/careerPath";

type CareerPathLearningPlanProps = {
  learningPlan: CareerPathLearningItem[];
};

function getLabel(
  value: string,
  t: (key: string) => string,
) {
  const normalized = value.toLowerCase();

  if (normalized === "high") {
    return t("careerPath.priorityHigh");
  }

  if (normalized === "medium") {
    return t("careerPath.priorityMedium");
  }

  if (normalized === "low") {
    return t("careerPath.priorityLow");
  }

  if (normalized === "course") {
    return t("careerPath.learningTypeCourse");
  }

  if (normalized === "project") {
    return t("careerPath.learningTypeProject");
  }

  if (normalized === "practice") {
    return t("careerPath.learningTypePractice");
  }

  if (normalized === "reading") {
    return t("careerPath.learningTypeReading");
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
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

function getMissionIntensity(priority: string) {
  const normalized = priority.toLowerCase();

  if (normalized === "high") return 88;
  if (normalized === "medium") return 64;

  return 42;
}

function getMissionGradient(priority: string) {
  const normalized = priority.toLowerCase();

  if (normalized === "high") {
    return "from-orange-400 via-violet-400 to-cyan-300 shadow-[0_0_24px_rgba(249,115,22,0.16)]";
  }

  if (normalized === "medium") {
    return "from-cyan-300 via-violet-300 to-emerald-300 shadow-[0_0_22px_rgba(34,211,238,0.15)]";
  }

  return "from-white/40 to-white/20";
}

export function CareerPathLearningPlan({
  learningPlan,
}: CareerPathLearningPlanProps) {
  const { t } = useI18n();

  const highPriorityCount = learningPlan.filter(
    (item) => item.priority.toLowerCase() === "high",
  ).length;

  const nextMission = learningPlan[0]?.title || t("careerPath.noMissionSelected");

  return (
    <Card className="relative overflow-hidden border-cyan-300/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.94),rgba(8,13,24,0.98)_52%,rgba(24,18,54,0.62))] shadow-[0_24px_80px_rgba(6,182,212,0.05)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.11),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_38%)]" />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent" />

      <div className="relative">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/10 bg-cyan-400/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/70">
              <GraduationCap className="size-3.5 text-cyan-300" />
              {t("careerPath.learningMissions")}
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
              {t("careerPath.focusedLearningTrack")}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
              {t("careerPath.focusedLearningTrackDescription")}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[460px]">
            <div className="rounded-2xl border border-white/7 bg-black/20 px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                {t("careerPath.missions")}
              </div>

              <div className="mt-1 text-xl font-semibold text-white">
                {learningPlan.length}
              </div>
            </div>

            <div className="rounded-2xl border border-orange-300/10 bg-orange-400/[0.045] px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-100/55">
                {t("careerPath.highPriority")}
              </div>

              <div className="mt-1 text-xl font-semibold text-orange-100">
                {highPriorityCount}
              </div>
            </div>


          </div>
        </div>

        {learningPlan.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">
            {t("careerPath.noLearningItems")}
          </div>
        ) : (
          <div className="overflow-hidden rounded-[2rem] border border-white/7 bg-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="hidden grid-cols-[130px_minmax(0,1.4fr)_minmax(260px,0.75fr)] border-b border-white/5 bg-white/[0.025] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35 lg:grid">
              <div>{t("careerPath.mission")}</div>
              <div>{t("careerPath.learningFocus")}</div>
              <div className="text-right">{t("careerPath.executionDetails")}</div>
            </div>

            <div className="divide-y divide-white/[0.055]">
              {learningPlan.map((item, index) => {
                const intensity = getMissionIntensity(item.priority);

                return (
                  <div
                    key={`${item.title}-${index}`}
                    className="group relative grid gap-4 px-5 py-5 transition duration-300 hover:bg-white/[0.035] lg:grid-cols-[130px_minmax(0,1.4fr)_minmax(260px,0.75fr)] lg:items-center"
                  >
                    <div className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-transparent transition group-hover:bg-cyan-300/35" />

                    <div className="flex items-center gap-3 lg:block">
                      <div className="grid size-12 place-items-center rounded-2xl border border-cyan-300/15 bg-cyan-400/[0.08] text-cyan-100 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
                        <BookOpen className="size-5" />
                      </div>

                      <div className="lg:mt-3">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                          {t("careerPath.mission")}
                        </div>

                        <div className="mt-1 text-2xl font-semibold tracking-tight text-white">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                          <Sparkles className="size-3" />
                          {t("careerPath.stepNumber", {
                            number: index + 1,
                          })}
                        </div>

                        <div className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getPriorityClassName(item.priority)}`}>
                          {t("careerPath.priorityLabel", {
                            priority: getLabel(item.priority, t),
                          })}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold tracking-tight text-white/92">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-white/55">
                        {item.description}
                      </p>

                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="font-semibold uppercase tracking-[0.14em] text-white/35">
                            {t("careerPath.missionIntensity")}
                          </span>

                          <span className="font-semibold text-white/65">
                            {intensity}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getMissionGradient(item.priority)}`}
                            style={{ width: `${intensity}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      <div className="rounded-2xl border border-cyan-300/10 bg-cyan-400/[0.055] p-4">
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/55">
                          <Target className="size-3.5" />
                          {t("careerPath.learningType")}
                        </div>

                        <div className="text-sm font-medium leading-6 text-cyan-50/85">
                          {getLabel(item.type, t)}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                          <Clock3 className="size-3.5" />
                          {t("careerPath.estimatedTime")}
                        </div>

                        <div className="text-sm font-medium leading-6 text-white/70">
                          {item.estimated_time}
                        </div>
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
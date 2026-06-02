import {
  CheckCircle2,
  Code2,
  Gauge,
  Layers3,
  Sparkles,
  Star,
  Target,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";

import type { CareerPathProjectItem } from "../types/careerPath";

type CareerPathProjectsProps = {
  projectPlan: CareerPathProjectItem[];
};

function getDifficultyScore(difficulty: string) {
  const normalized = difficulty.toLowerCase();

  if (normalized === "hard") return 90;
  if (normalized === "medium") return 65;

  return 40;
}

function getDifficultyClassName(difficulty: string) {
  const normalized = difficulty.toLowerCase();

  if (normalized === "hard") {
    return "border-orange-400/15 bg-orange-400/[0.08] text-orange-100";
  }

  if (normalized === "medium") {
    return "border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-100";
  }

  return "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-100";
}

function getBuildGradient(difficulty: string) {
  const normalized = difficulty.toLowerCase();

  if (normalized === "hard") {
    return "from-orange-400 via-violet-400 to-cyan-300 shadow-[0_0_24px_rgba(249,115,22,0.16)]";
  }

  if (normalized === "medium") {
    return "from-emerald-300 via-cyan-300 to-violet-300 shadow-[0_0_24px_rgba(52,211,153,0.16)]";
  }

  return "from-emerald-300 to-cyan-300 shadow-[0_0_22px_rgba(52,211,153,0.14)]";
}

function getDifficultyLabel(
  difficulty: string,
  t: (key: string) => string,
) {
  const normalized = difficulty.toLowerCase();

  if (normalized === "hard") {
    return t("careerPath.difficultyHard");
  }

  if (normalized === "medium") {
    return t("careerPath.difficultyMedium");
  }

  return t("careerPath.difficultyEasy");
}

export function CareerPathProjects({
  projectPlan,
}: CareerPathProjectsProps) {
  const { t } = useI18n();
  const nextProject = projectPlan[0]?.title || t("careerPath.noProjectSelected");
  const hardProjects = projectPlan.filter(
    (project) => project.difficulty.toLowerCase() === "hard",
  ).length;

  return (
    <Card className="relative overflow-hidden border-emerald-400/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.94),rgba(8,13,24,0.98)_52%,rgba(18,55,42,0.58))] shadow-[0_24px_80px_rgba(52,211,153,0.05)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.11),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.09),transparent_38%)]" />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/55 to-transparent" />

      <div className="relative">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/10 bg-emerald-400/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/70">
              <Code2 className="size-3.5 text-emerald-300" />
              {t("careerPath.portfolioProofLab")}
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
              {t("careerPath.projectsTitle")}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
              {t("careerPath.projectsDescription")}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[460px]">
            <div className="rounded-2xl border border-white/7 bg-black/20 px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                {t("careerPath.builds")}
              </div>

              <div className="mt-1 text-xl font-semibold text-white">
                {projectPlan.length}
              </div>
            </div>

            <div className="rounded-2xl border border-orange-300/10 bg-orange-400/[0.045] px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-100/55">
                {t("careerPath.hardBuilds")}
              </div>

              <div className="mt-1 text-xl font-semibold text-orange-100">
                {hardProjects}
              </div>
            </div>


          </div>
        </div>

        {projectPlan.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">
            {t("careerPath.noProjectRecommendations")}
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {projectPlan.map((project, index) => {
              const score = getDifficultyScore(project.difficulty);

              return (
                <div
                  key={`${project.title}-${index}`}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-white/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(52,211,153,0.06)]"
                >
                  <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.10),transparent_30%)]" />
                  <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent" />

                  <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
                    <div className="min-w-0">
                      <div className="mb-4 flex items-start gap-3">


                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                              <Sparkles className="size-3" />
                              {t("careerPath.proofProjectNumber", {
                                number: String(index + 1).padStart(2, "0"),
                              })}
                            </div>

                            <div className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getDifficultyClassName(project.difficulty)}`}>
                              {t("careerPath.difficultyLabel", {
                                difficulty: getDifficultyLabel(project.difficulty, t),
                              })}
                            </div>
                          </div>

                          <h3 className="text-lg font-semibold tracking-tight text-white/92">
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm leading-7 text-white/55">
                        {project.description}
                      </p>

                      {project.skills_practiced.length > 0 && (
                        <div className="mt-5">
                          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                            <CheckCircle2 className="size-3.5 text-emerald-300" />
                            {t("careerPath.skillsPracticed")}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {project.skills_practiced.slice(0, 6).map((skill, skillIndex) => (
                              <span
                                key={`${skill}-${skillIndex}`}
                                className="rounded-full border border-emerald-300/10 bg-emerald-400/[0.055] px-2.5 py-1 text-xs text-emerald-50/75"
                              >
                                {skill}
                              </span>
                            ))}

                            {project.skills_practiced.length > 6 && (
                              <span className="rounded-full border border-white/5 bg-white/[0.025] px-2.5 py-1 text-xs text-white/35">
                                {t("careerPath.moreCount", {
                                  count: project.skills_practiced.length - 6,
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl border border-emerald-300/10 bg-emerald-400/[0.055] p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/55">
                            <Star className="size-3.5" />
                            {t("careerPath.portfolioValue")}
                          </div>

                          <p className="line-clamp-5 text-sm leading-7 text-white/62">
                            {project.portfolio_value}
                          </p>
                        </div>

                        <Gauge className="mt-0.5 size-4 shrink-0 text-emerald-200/65" />
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/5 bg-black/20 p-3">
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="font-semibold uppercase tracking-[0.16em] text-white/35">
                            {t("careerPath.buildIntensity")}
                          </span>

                          <span className="font-semibold text-white/65">
                            {score}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getBuildGradient(project.difficulty)}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/5 bg-black/15 px-3 py-2 text-xs text-white/45">
                        <Target className="size-3.5 text-emerald-300" />
                        {t("careerPath.turnsGapsIntoEvidence")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
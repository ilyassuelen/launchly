import { useEffect, type ReactNode } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Map,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  AppShell,
  Card,
  Progress,
} from "@/components/launchly/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";

import { useCareerPath } from "@/features/career-path/hooks/useCareerPath";

import { CareerPathForm } from "@/features/career-path/components/CareerPathForm";
import { CareerPathTimeline } from "@/features/career-path/components/CareerPathTimeline";
import { CareerPathSkillGaps } from "@/features/career-path/components/CareerPathSkillGaps";
import { CareerPathLearningPlan } from "@/features/career-path/components/CareerPathLearningPlan";
import { CareerPathProjects } from "@/features/career-path/components/CareerPathProjects";
import { CareerPathApplicationStrategy } from "@/features/career-path/components/CareerPathApplicationStrategy";

import type { CareerPathGenerateRequest } from "@/features/career-path/types/careerPath";

function getRoleFitLabel(
  roleFit: string | null | undefined,
  t: (key: string) => string,
) {
  const normalized = roleFit?.toLowerCase();

  if (normalized === "very_low") {
    return t("careerPath.roleFitVeryLow");
  }

  if (normalized === "low") {
    return t("careerPath.roleFitLow");
  }

  if (normalized === "medium") {
    return t("careerPath.roleFitMedium");
  }

  if (normalized === "high") {
    return t("careerPath.roleFitHigh");
  }

  return t("careerPath.roleFitNotAssessed");
}

function getRoleFitClassName(roleFit?: string | null) {
  const normalized = roleFit?.toLowerCase();

  if (normalized === "high") {
    return "border-emerald-400/15 bg-emerald-400/[0.10] text-emerald-100";
  }

  if (normalized === "medium") {
    return "border-cyan-400/15 bg-cyan-400/[0.10] text-cyan-100";
  }

  if (normalized === "low") {
    return "border-amber-400/15 bg-amber-400/[0.10] text-amber-100";
  }

  if (normalized === "very_low") {
    return "border-red-400/15 bg-red-400/[0.10] text-red-100";
  }

  return "border-white/10 bg-white/[0.05] text-white/60";
}


function getConfidenceLabel(
  confidence: number,
  t: (key: string) => string,
) {
  if (confidence >= 85) {
    return t("careerPath.jobReadySignal");
  }

  if (confidence >= 70) {
    return t("careerPath.strongDirection");
  }

  if (confidence >= 45) {
    return t("careerPath.developingPath");
  }

  if (confidence > 0) {
    return t("careerPath.needsFoundation");
  }

  return t("careerPath.awaitingRoadmap");
}

type CareerFlowTone = "cyan" | "violet" | "emerald";

type CareerFlowSectionProps = {
  stage: string;
  title: string;
  tone?: CareerFlowTone;
  children: ReactNode;
};

function getCareerFlowToneClassName(tone: CareerFlowTone) {
  if (tone === "emerald") {
    return {
      dot: "border-emerald-300/25 bg-emerald-400/[0.12] shadow-[0_0_28px_rgba(52,211,153,0.22)]",
      line: "from-emerald-300/70 via-cyan-300/30 to-transparent",
      label: "border-emerald-300/15 bg-emerald-400/[0.06] text-emerald-100/70",
    };
  }

  if (tone === "violet") {
    return {
      dot: "border-violet-300/25 bg-violet-400/[0.12] shadow-[0_0_28px_rgba(168,85,247,0.22)]",
      line: "from-violet-300/70 via-cyan-300/30 to-transparent",
      label: "border-violet-300/15 bg-violet-400/[0.06] text-violet-100/70",
    };
  }

  return {
    dot: "border-cyan-300/25 bg-cyan-400/[0.12] shadow-[0_0_28px_rgba(34,211,238,0.22)]",
    line: "from-cyan-300/70 via-violet-300/30 to-transparent",
    label: "border-cyan-300/15 bg-cyan-400/[0.06] text-cyan-100/70",
  };
}

function CareerFlowSection({
  stage,
  title,
  tone = "cyan",
  children,
}: CareerFlowSectionProps) {
  const toneClassName = getCareerFlowToneClassName(tone);

  return (
    <section className="relative pl-7 md:pl-10">
      <div className={`pointer-events-none absolute left-[9px] top-7 bottom-[-1.5rem] w-px bg-gradient-to-b ${toneClassName.line}`} />
      <div className={`absolute left-0 top-5 z-10 grid size-5 place-items-center rounded-full border ${toneClassName.dot}`}>
        <div className="size-1.5 rounded-full bg-white/80" />
      </div>

      <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${toneClassName.label}`}>
        <span>{stage}</span>
        <span className="size-1 rounded-full bg-current opacity-40" />
        <span>{title}</span>
      </div>

      {children}
    </section>
  );
}

export const Route = createFileRoute("/career-path")({
  head: () => ({
    meta: [
      {
        title: "Career Path — Launchly",
      },
      {
        name: "description",
        content:
          "AI-generated career roadmap based on your saved resume, applications, interviews, LinkedIn and portfolio insights.",
      },
    ],
  }),
  component: CareerPath,
});

function CareerPath() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  const {
    selectedCareerPath,
    latestCareerPath,
    isLoading,
    isGenerating,
    error,
    createCareerPath,
    loadCareerPaths,
    clearError,
  } = useCareerPath();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user) {
      void loadCareerPaths();
    }
  }, [user, loading, loadCareerPaths]);

  const handleGenerateCareerPath = async (
    payload: CareerPathGenerateRequest,
  ) => {
    clearError();
    await createCareerPath(payload);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("careerPath.loading")}
        </div>
      </div>
    );
  }

  const careerPath = selectedCareerPath || latestCareerPath;
  const confidence = careerPath?.confidence_score ?? 0;
  const roleFitLabel = getRoleFitLabel(careerPath?.role_fit, t);
  const roleFitClassName = getRoleFitClassName(careerPath?.role_fit);
  const confidenceLabel = getConfidenceLabel(confidence, t);

  return (
    <AppShell
    >
      <div className="space-y-6">
        <Card className="relative min-h-[450px] overflow-hidden border-cyan-300/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(8,13,24,0.98)_55%,rgba(18,24,46,0.9))] p-0 shadow-[0_24px_80px_rgba(6,182,212,0.06)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(139,92,246,0.10),transparent_32%)]" />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_80%_45%,rgba(168,85,247,0.16),transparent_38%),linear-gradient(135deg,rgba(9,12,28,0.82),rgba(10,8,24,0.92))]" />
            <div className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle,rgba(255,255,255,0.34)_1px,transparent_1.5px)] [background-size:42px_42px]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,182,212,0.08),rgba(8,13,24,0.42)_34%,rgba(8,13,24,0.14)_62%,rgba(168,85,247,0.10))]" />

            <svg
              className="absolute inset-x-0 top-[5px] h-[390px] w-full opacity-85"
              viewBox="0 0 900 260"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M -20 220 C 130 120 185 110 295 142 C 395 171 430 52 535 75 C 640 98 650 180 760 132 C 825 104 870 76 930 68"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                className="career-road-glow"
                d="M -20 220 C 130 120 185 110 295 142 C 395 171 430 52 535 75 C 640 98 650 180 760 132 C 825 104 870 76 930 68"
                stroke="url(#careerRoadGradientHero)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                className="career-road-trace"
                d="M -20 220 C 130 120 185 110 295 142 C 395 171 430 52 535 75 C 640 98 650 180 760 132 C 825 104 870 76 930 68"
                stroke="rgba(255,255,255,0.92)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="careerRoadGradientHero" x1="0" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="rgb(34,211,238)" />
                  <stop offset="0.48" stopColor="rgb(168,85,247)" />
                  <stop offset="1" stopColor="rgb(52,211,153)" />
                </linearGradient>
              </defs>
            </svg>

            <div className="career-phase career-phase-one left-[12.5%] top-[223px]">
              <div className="career-phase-ring" />
              <div className="career-phase-core">
                <CheckCircle2 className="size-5 text-white" />
              </div>
            </div>

            <div className="career-phase career-phase-two left-[46%] top-[170px]">
              <div className="career-phase-ring" />
              <div className="career-phase-core">
                <Sparkles className="size-5 text-white" />
              </div>
            </div>

            <div className="career-phase career-phase-three left-[85.5%] top-[198px]">
              <div className="career-phase-ring" />
              <div className="career-phase-core">
                <Target className="size-5 text-white" />
              </div>
            </div>

            <div className="absolute left-[7%] top-[325px] hidden md:block">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100/55">
                {t("careerPath.phase01")}
              </div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-white/75">
                {t("careerPath.profileSignal")}
              </div>
            </div>

            <div className="absolute left-[42%] top-[325px] hidden md:block">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-100/55">
                {t("careerPath.phase02")}
              </div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-white/75">
                {t("careerPath.skillGaps")}
              </div>
            </div>

            <div className="absolute right-[7%] top-[325px] hidden lg:block text-right">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100/55">
                {t("careerPath.phase03")}
              </div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-white/75">
                {t("careerPath.jobReadyProof")}
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,24,0.42),rgba(8,13,24,0.18)_42%,rgba(8,13,24,0.46))]" />

          <div className="relative p-7 lg:p-9">


            <div className="mt-[400px]">
                <CareerPathForm
                    isGenerating={isGenerating}
                    onSubmit={handleGenerateCareerPath}
                />
            </div>
          </div>
        </Card>


        {error && (
          <div className="flex items-start gap-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-red-100">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <div className="text-sm font-semibold">
                {t("careerPath.failedToLoad")}
              </div>

              <div className="mt-1 text-sm text-red-100/75">
                {error}
              </div>
            </div>
          </div>
        )}

        {isLoading && !careerPath ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-white/10 bg-black/20">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("careerPath.loadingLatestRoadmap")}
            </div>
          </div>
        ) : careerPath ? (
          <>
            <CareerFlowSection
              stage={t("careerPath.stage01")}
              title={t("careerPath.careerReadiness")}
              tone="cyan"
            >
            <Card className="relative overflow-hidden border-cyan-300/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(8,13,24,0.98)_50%,rgba(20,18,48,0.82))] p-0 shadow-[0_28px_90px_rgba(6,182,212,0.08)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_88%_8%,rgba(168,85,247,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_38%)]" />
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

              <div className="relative p-6 lg:p-8">
                <div className="mb-7 flex flex-col gap-5 border-b border-white/5 pb-6 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/10 bg-cyan-400/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/70">
                      <TrendingUp className="size-3.5 text-cyan-300" />
                      {t("careerPath.careerReadinessJourney")}
                    </div>

                    <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-white lg:text-4xl">
                      {t("careerPath.yourPathToward")}{" "}
                      <span className="bg-gradient-to-r from-violet-200 via-cyan-100 to-emerald-200 bg-clip-text text-transparent">
                        {careerPath.target_role}
                      </span>
                    </h2>

                    <p className="mt-4 max-w-4xl text-sm leading-7 text-white/58 lg:text-[15px]">
                      {careerPath.summary ||
                        t("careerPath.profileRoadmapReady")}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70">
                        {t("careerPath.monthsCount", {
                          count: careerPath.timeframe_months ?? 6,
                        })}
                      </div>

                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70">
                        {careerPath.current_level || t("careerPath.notSpecified")}
                      </div>

                      <div className={`rounded-full border px-3 py-1.5 text-xs font-medium ${roleFitClassName}`}>
                        {t("careerPath.roleFitLabel", {
                          roleFit: roleFitLabel,
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-black/25 p-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_70px_rgba(0,0,0,0.24)] xl:min-w-[260px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_58%)]" />

                    <div className="relative">
                      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/75">
                        {t("careerPath.estimatedRoleReadiness")}
                      </div>

                      <div className="relative isolate mx-auto mt-5 grid size-32 place-items-center overflow-hidden rounded-full border border-cyan-300/20 bg-white/[0.045] shadow-[0_28px_85px_rgba(34,211,238,0.16)]">
                        <div className="pointer-events-none absolute inset-3 rounded-full border border-violet-300/10" />
                        <div className="pointer-events-none absolute inset-7 rounded-full bg-black/20" />

                        <div className="relative z-10 text-center">
                          <div className="text-5xl font-semibold tracking-[-0.04em] text-white">
                            {confidence}
                          </div>

                          <div className="mt-1 text-[10px] uppercase tracking-[0.24em] text-cyan-100/70">
                            /100
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Progress value={confidence} />
                      </div>

                      <div className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100">
                        <CheckCircle2 className="size-3.5 text-emerald-300" />
                        {confidenceLabel}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">

                  <div className="relative overflow-hidden rounded-[2rem] border border-white/7 bg-black/20 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_88%_20%,rgba(168,85,247,0.16),transparent_36%)]" />
                    <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle,rgba(255,255,255,0.28)_1px,transparent_1.5px)] [background-size:36px_36px]" />

                    <div className="relative">
                      <div className="mb-8 flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                            {t("careerPath.progressionPath")}
                          </div>
                          <div className="mt-1 text-sm text-white/55">
                            {t("careerPath.progressionPathDescription")}
                          </div>
                        </div>

                        <div className="rounded-full border border-cyan-300/10 bg-cyan-400/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100/65">
                          {t("careerPath.completePercent", {
                            percent: confidence,
                          })}
                        </div>
                      </div>

                      <div className="relative py-8">
                        <div className="absolute left-[6%] right-[6%] top-[4rem] h-2 -translate-y-1/2 rounded-full bg-white/[0.07]" />
                        <div
                          className="absolute left-[6%] top-[4rem] h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-emerald-300 shadow-[0_0_34px_rgba(34,211,238,0.26)]"
                          style={{ width: `calc(${Math.min(confidence, 100)}% * 0.88)` }}
                        />

                        <div className="relative grid grid-cols-4 gap-4">
                          {[
                            [t("careerPath.current"), t("careerPath.savedProfileSignals"), 0, "cyan"],
                            [t("careerPath.developing"), t("careerPath.skillGapsInFocus"), 35, "violet"],
                            [t("careerPath.intermediate"), t("careerPath.portfolioProofGrowing"), 70, "violet"],
                            [t("careerPath.jobReady"), t("careerPath.recruiterReadyEvidence"), 100, "emerald"],
                          ].map(([label, description, threshold, tone], index) => {
                            const active = confidence >= Number(threshold);
                            const toneClass =
                              tone === "emerald"
                                ? "border-emerald-300/25 bg-emerald-400/[0.10] text-emerald-100 shadow-[0_0_34px_rgba(52,211,153,0.18)]"
                                : tone === "violet"
                                  ? "border-violet-300/25 bg-violet-400/[0.10] text-violet-100 shadow-[0_0_34px_rgba(168,85,247,0.18)]"
                                  : "border-cyan-300/25 bg-cyan-400/[0.10] text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.18)]";

                            return (
                              <div
                                key={label}
                                className="flex flex-col items-center text-center"
                              >
                                <div
                                  className={`relative z-10 grid size-16 place-items-center rounded-3xl border transition ${
                                    active
                                      ? toneClass
                                      : "border-white/10 bg-black/45 text-white/28"
                                  }`}
                                >
                                  {active ? (
                                    <CheckCircle2 className="size-6" />
                                  ) : (
                                    <span className="size-2.5 rounded-full bg-white/30" />
                                  )}
                                </div>

                                <div
                                  className={`mt-4 rounded-2xl border px-3 py-3 ${
                                    active
                                      ? "border-white/8 bg-white/[0.045]"
                                      : "border-white/5 bg-white/[0.025]"
                                  }`}
                                >
                                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                                    {t("careerPath.stageNumber", {
                                      number: index + 1,
                                    })}
                                  </div>

                                  <div className="mt-1 text-sm font-semibold text-white/85">
                                    {label}
                                  </div>

                                  <div className="mt-1 text-xs leading-5 text-white/45">
                                    {description}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {careerPath.role_fit_summary && (
                        <div className="mt-7 rounded-[1.5rem] border border-white/7 bg-black/25 p-5">
                          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                            <Target className="size-3.5 text-violet-300" />
                            {t("careerPath.fitAnalysis")}
                          </div>

                          <p className="text-sm leading-7 text-white/55">
                            {careerPath.role_fit_summary}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </Card>
            </CareerFlowSection>

            <CareerFlowSection
              stage={t("careerPath.stage02")}
              title={t("careerPath.strategicRoadmap")}
              tone="violet"
            >
              <CareerPathTimeline roadmap={careerPath.roadmap} />
            </CareerFlowSection>

            <CareerFlowSection
              stage={t("careerPath.stage03")}
              title={t("careerPath.skillGaps")}
              tone="cyan"
            >
              <CareerPathSkillGaps skillGaps={careerPath.skill_gaps} />
            </CareerFlowSection>

            <CareerFlowSection
              stage={t("careerPath.stage04")}
              title={t("careerPath.learningTrack")}
              tone="violet"
            >
              <CareerPathLearningPlan
                learningPlan={careerPath.learning_plan}
              />
            </CareerFlowSection>

            <CareerFlowSection
              stage={t("careerPath.stage05")}
              title={t("careerPath.portfolioProof")}
              tone="emerald"
            >
              <CareerPathProjects projectPlan={careerPath.project_plan} />
            </CareerFlowSection>

            <CareerFlowSection
              stage={t("careerPath.stage06")}
              title={t("careerPath.applicationLaunch")}
              tone="violet"
            >
              <CareerPathApplicationStrategy
                applicationStrategy={careerPath.application_strategy}
              />
            </CareerFlowSection>
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
              <Sparkles className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              {t("careerPath.noRoadmapYet")}
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/55">
              {t("careerPath.noRoadmapDescription")}
            </p>
          </div>
        )}
      </div>
      <style>{`
        .career-road-glow {
          filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.72)) drop-shadow(0 0 26px rgba(34, 211, 238, 0.22));
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: career-road-draw 7.5s linear infinite;
        }

        .career-road-trace {
          opacity: 0;
          stroke-dasharray: 120 1120;
          animation: career-road-comet 7.5s linear infinite;
          filter: drop-shadow(0 0 14px rgba(255, 255, 255, 0.65));
        }

        .career-phase {
          position: absolute;
          width: 4.75rem;
          height: 4.75rem;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
        }

        .career-phase-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: radial-gradient(circle, rgba(168, 85, 247, 0.20), rgba(10, 8, 24, 0.36));
          box-shadow: 0 0 0 rgba(168, 85, 247, 0);
        }

        .career-phase-core {
          position: relative;
          width: 2.55rem;
          height: 2.55rem;
          border-radius: 9999px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.20);
          background: linear-gradient(135deg, rgba(34, 211, 238, 0.34), rgba(168, 85, 247, 0.54));
          box-shadow: 0 0 28px rgba(168, 85, 247, 0.35);
        }

        .career-phase-one .career-phase-ring,
        .career-phase-one .career-phase-core,
        .career-phase-two .career-phase-ring,
        .career-phase-two .career-phase-core,
        .career-phase-three .career-phase-ring,
        .career-phase-three .career-phase-core {
          animation: career-phase-breathe 4.8s ease-in-out infinite;
        }

        @keyframes career-road-draw {
          0% {
            stroke-dashoffset: 1200;
            opacity: 0.28;
          }

          8% {
            opacity: 1;
          }

          92% {
            opacity: 1;
          }

          100% {
            stroke-dashoffset: -120;
            opacity: 0;
          }
        }

        @keyframes career-road-comet {
          0% {
            opacity: 0;
            stroke-dashoffset: 1220;
          }

          8% {
            opacity: 1;
          }

          92% {
            opacity: 1;
          }

          100% {
            stroke-dashoffset: -140;
            opacity: 0;
          }
        }

        @keyframes career-phase-breathe {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 24px rgba(34, 211, 238, 0.22);
          }

          50% {
            transform: scale(1.06);
            box-shadow: 0 0 0 10px rgba(168, 85, 247, 0.08), 0 0 42px rgba(34, 211, 238, 0.42);
          }
        }
      `}</style>
    </AppShell>
  );
}
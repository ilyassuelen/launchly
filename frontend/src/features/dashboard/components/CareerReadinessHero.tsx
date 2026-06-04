import {
  Brain,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import {
  Card,
} from "@/components/launchly/AppShell";

import { useI18n } from "@/i18n/I18nContext";

import type {
  DashboardSummaryResponse,
} from "@/features/dashboard/types/dashboard";

type CareerReadinessHeroProps = {
  summary: DashboardSummaryResponse | null;
  isReviewing: boolean;
  onRunReview: () => void;
};

function clampScore(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function getReadinessLabel(
  score: number,
  t: (key: string) => string,
) {
  if (score >= 85) return t("dashboard.careerReady");
  if (score >= 75) return t("dashboard.strongMomentum");
  if (score >= 60) return t("dashboard.buildingProfile");
  if (score > 0) return t("dashboard.needsFocus");
  return t("dashboard.startReview");
}

function getScoreAccent(score: number) {
  if (score >= 80) {
    return {
      ring: "rgba(52,211,153,0.82)",
      glow: "rgba(52,211,153,0.18)",
      text: "text-emerald-200",
    };
  }

  if (score >= 60) {
    return {
      ring: "rgba(34,211,238,0.82)",
      glow: "rgba(34,211,238,0.18)",
      text: "text-cyan-200",
    };
  }

  if (score >= 40) {
    return {
      ring: "rgba(251,191,36,0.82)",
      glow: "rgba(251,191,36,0.18)",
      text: "text-amber-200",
    };
  }

  return {
    ring: "rgba(248,113,113,0.82)",
    glow: "rgba(248,113,113,0.18)",
    text: "text-red-200",
  };
}

function getReadinessStage(score: number, t: (key: string) => string) {
  if (score >= 85) {
    return {
      current: t("dashboard.stageJobReady"),
      next: t("dashboard.stageLaunchMode"),
      activeIndex: 3,
    };
  }

  if (score >= 70) {
    return {
      current: t("dashboard.stageIntermediate"),
      next: t("dashboard.stageJobReady"),
      activeIndex: 2,
    };
  }

  if (score >= 45) {
    return {
      current: t("dashboard.stageDeveloping"),
      next: t("dashboard.stageIntermediate"),
      activeIndex: 1,
    };
  }

  return {
    current: t("dashboard.stageCurrent"),
    next: t("dashboard.stageDeveloping"),
    activeIndex: 0,
  };
}

export function CareerReadinessHero({
  summary,
  isReviewing,
  onRunReview,
}: CareerReadinessHeroProps) {
  const { t } = useI18n();

  const careerScore = clampScore(
    summary?.career_score?.value,
  );

  const label =
    summary?.career_score?.label ||
    getReadinessLabel(careerScore, t);

  const delta =
    summary?.career_score?.delta ||
    t("dashboard.runReviewRefresh");

  const accent = getScoreAccent(careerScore);
  const stage = getReadinessStage(careerScore, t);
  const stages = [
    t("dashboard.stageCurrent"),
    t("dashboard.stageDeveloping"),
    t("dashboard.stageIntermediate"),
    t("dashboard.stageJobReady"),
  ];

  return (
    <Card className="relative overflow-hidden border-cyan-300/15 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(8,13,24,0.98)_48%,rgba(18,32,58,0.88))] p-0 shadow-[0_28px_90px_rgba(6,182,212,0.10),0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_88%_8%,rgba(139,92,246,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.045),transparent_34%)]" />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl" />

      {isReviewing && (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.08),transparent)] animate-[heroSweep_1.8s_ease-in-out_infinite]" />
      )}

      <div className="relative grid gap-8 p-5 md:p-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-stretch">
        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.08] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cyan-100/78">
              <Sparkles className="size-3.5 text-cyan-300" />
              {t("dashboard.careerCommandCenter")}
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.72rem] font-medium text-white/60">
              {stage.current} → {stage.next}
            </div>
          </div>

          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-white md:text-4xl">
            {t("dashboard.heroReadinessPrefix")}
            <span className="mx-2 bg-gradient-to-r from-violet-200 via-sky-200 to-cyan-200 bg-clip-text text-transparent">
              {careerScore}% {t("dashboard.readyShort")}
            </span>
            {t("dashboard.heroReadinessSuffix")}
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/58">
            {delta}
          </p>

          <div className="mt-6 max-w-[760px] rounded-[1.25rem] border border-white/[0.08] bg-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-white/42">
                  {t("dashboard.careerReadinessTrajectory")}
                </div>
                <div className="mt-1 text-xs text-white/58">
                  {t("dashboard.currentStage")}:{" "}
                  <span className="font-semibold text-white/85">
                    {stage.current}
                  </span>
                </div>
              </div>

              <div className={`text-sm font-semibold ${accent.text}`}>
                {careerScore}/100
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 right-4 top-3.5 h-px bg-white/10" />
              <div
                className="absolute left-4 top-3.5 h-px bg-gradient-to-r from-violet-400 via-sky-400 to-cyan-300 transition-all duration-700"
                style={{
                  width: `${Math.max(8, Math.min(100, careerScore))}%`,
                  maxWidth: "calc(100% - 2rem)",
                }}
              />

              <div className="relative grid grid-cols-4 gap-2">
                {stages.map((item, index) => {
                  const complete = index < stage.activeIndex;
                  const active = index === stage.activeIndex;

                  return (
                    <div key={item} className="min-w-0 text-center">
                      <div
                        className={`mx-auto grid size-7 place-items-center rounded-full border transition ${
                          active
                            ? "border-cyan-300/60 bg-cyan-300/14 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.16)]"
                            : complete
                              ? "border-emerald-300/32 bg-emerald-300/10 text-emerald-200"
                              : "border-white/10 bg-white/[0.03] text-white/30"
                        }`}
                      >
                        {complete ? (
                          <CheckCircle2 className="size-3.5" />
                        ) : (
                          <span className="size-1.5 rounded-full bg-current" />
                        )}
                      </div>

                      <div
                        className={`mt-1.5 truncate text-[0.64rem] font-semibold ${
                          active
                            ? "text-white/90"
                            : complete
                              ? "text-white/55"
                              : "text-white/30"
                        }`}
                      >
                        {item}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={onRunReview}
              disabled={isReviewing}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_14px_36px_rgba(34,211,238,0.16)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isReviewing ? (
                <Brain className="size-4 animate-pulse" />
              ) : (
                <Zap className="size-4" />
              )}

              {isReviewing
                ? t("dashboard.reviewingProfile")
                : t("dashboard.runAiReview")}
            </button>

            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white/68">
              <TrendingUp className="size-4 text-cyan-300" />
              {label}
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-black/25 p-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_80px_rgba(0,0,0,0.26)] xl:justify-self-end">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_58%)]" />

          <div className="relative flex h-full flex-col justify-between gap-4">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/75">
              <Sparkles className="size-3.5 text-cyan-300" />
              {t("dashboard.careerScore")}
            </div>

            <div className="relative isolate mx-auto mt-3 grid size-44 place-items-center overflow-hidden rounded-full border border-cyan-300/20 bg-white/[0.045] shadow-[0_28px_85px_rgba(34,211,238,0.16)]">
              <div
                className="absolute inset-0 rounded-full opacity-75"
                style={{
                  background: `conic-gradient(${accent.ring} ${careerScore * 3.6}deg, rgba(255,255,255,0.07) 0deg)`,
                }}
              />
              <div className="pointer-events-none absolute inset-4 rounded-full border border-violet-300/10" />
              <div className="pointer-events-none absolute inset-8 rounded-full bg-black/25" />

              {isReviewing && (
                <div className="absolute inset-[-8px] rounded-full border border-cyan-300/20 animate-ping" />
              )}

              <div className="relative z-10 text-center">
                <div className="text-6xl font-semibold tracking-[-0.04em] text-white">
                  {careerScore}
                </div>

                <div className={`mt-1 text-[10px] uppercase tracking-[0.24em] ${accent.text}`}>
                  /100
                </div>
              </div>
            </div>

            <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-brand shadow-[0_0_24px_rgba(34,211,238,0.30)] transition-all duration-700"
                style={{ width: `${careerScore}%` }}
              />
            </div>

            <div className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/[0.08] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100">
              <CheckCircle2 className="size-3.5 text-emerald-300" />
              {label}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scorePulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }

          50% {
            transform: scale(1.035);
            filter: brightness(1.18);
          }
        }

        @keyframes heroSweep {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }

          35% {
            opacity: 1;
          }

          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </Card>
  );
}

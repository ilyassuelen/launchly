import {
  Brain,
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
      ring: "rgba(52,211,153,0.75)",
      glow: "rgba(52,211,153,0.18)",
      text: "text-emerald-200",
    };
  }

  if (score >= 60) {
    return {
      ring: "rgba(34,211,238,0.78)",
      glow: "rgba(34,211,238,0.16)",
      text: "text-cyan-200",
    };
  }

  if (score >= 40) {
    return {
      ring: "rgba(251,191,36,0.78)",
      glow: "rgba(251,191,36,0.16)",
      text: "text-amber-200",
    };
  }

  return {
    ring: "rgba(248,113,113,0.78)",
    glow: "rgba(248,113,113,0.16)",
    text: "text-red-200",
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
  const progressWidth = `${careerScore}%`;

  return (
    <Card className="relative overflow-hidden border-white/5 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.18),transparent_35%)] lg:col-span-2">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%)]" />

      {isReviewing && (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.06),transparent)] animate-[heroSweep_1.8s_ease-in-out_infinite]" />
      )}

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-100">
            <Sparkles className="size-3.5" />
            {t("dashboard.careerCommandCenter")}
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {t("dashboard.careerReadinessIs")} {" "}
            <span className="text-gradient">
              {careerScore}/100
            </span>
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
            {delta}
          </p>

          <div className="mt-6 max-w-md">
            <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full bg-gradient-to-r from-violet-400 via-sky-400 to-cyan-300 transition-all duration-700 ease-out ${
                  isReviewing
                    ? "animate-[reviewProgress_1.35s_ease-in-out_infinite]"
                    : ""
                }`}
                style={{
                  width: isReviewing
                    ? "72%"
                    : progressWidth,
                }}
              />

              {isReviewing && (
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] animate-[progressShimmer_1.1s_linear_infinite]" />
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onRunReview}
              disabled={isReviewing}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground glow transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
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

            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
              <TrendingUp className="size-4 text-cyan-300" />
              {label}
            </div>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div
            className={`relative flex size-52 items-center justify-center rounded-full border bg-white/[0.04] shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-500 ${
              isReviewing
                ? "animate-[scorePulse_1.6s_ease-in-out_infinite]"
                : ""
            }`}
            style={{
              borderColor: accent.ring,
              boxShadow: `0 30px 120px rgba(0,0,0,0.35), 0 0 70px ${accent.glow}`,
            }}
          >
            <div
              className="absolute inset-0 rounded-full opacity-70"
              style={{
                background: `conic-gradient(${accent.ring} ${careerScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
              }}
            />

            <div className="absolute inset-[6px] rounded-full bg-[oklch(0.16_0.025_270)]" />
            <div className="absolute inset-4 rounded-full border border-white/10" />
            <div
              className="absolute inset-8 rounded-full blur-2xl"
              style={{
                backgroundColor: accent.glow,
              }}
            />

            {isReviewing && (
              <div className="absolute inset-[-8px] rounded-full border border-cyan-300/20 animate-ping" />
            )}

            <div className="relative text-center">
              <div className="text-6xl font-semibold tracking-tight text-white">
                {careerScore}
              </div>

              <div className={`mt-2 text-xs uppercase tracking-[0.25em] ${accent.text}`}>
                {t("dashboard.readinessLower")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
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

          @keyframes reviewProgress {
            0% {
              width: 18%;
              transform: translateX(-10%);
            }

            50% {
              width: 76%;
              transform: translateX(8%);
            }

            100% {
              width: 38%;
              transform: translateX(62%);
            }
          }

          @keyframes progressShimmer {
            0% {
              transform: translateX(-100%);
            }

            100% {
              transform: translateX(100%);
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
        `}
      </style>
    </Card>
  );
}

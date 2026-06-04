import { useEffect } from "react";
import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import {
  AppShell,
  Card,
} from "@/components/launchly/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import logo from "../../static/logo.png";
import {
  AlertTriangle,
  Loader2,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { CareerReadinessHero } from "@/features/dashboard/components/CareerReadinessHero";
import { NextBestActions } from "@/features/dashboard/components/NextBestActions";
import { CareerSystemHealth } from "@/features/dashboard/components/CareerSystemHealth";
import { WeakestLinkCard } from "@/features/dashboard/components/WeakestLinkCard";
import { MarketFitPanel } from "@/features/dashboard/components/MarketFitPanel";
import { ApplicationMomentum } from "@/features/dashboard/components/ApplicationMomentum";
import { SkillGapRadar } from "@/features/dashboard/components/SkillGapRadar";
import { CareerGrowthTimeline } from "@/features/dashboard/components/CareerGrowthTimeline";
import { AICoachFeed } from "@/features/dashboard/components/AICoachFeed";
import { WeeklyActionPlan } from "@/features/dashboard/components/WeeklyActionPlan";

import type { DashboardInsight } from "@/features/dashboard/types/dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Launchly" },
      {
        name: "description",
        content:
          "Your AI career command center: scores, growth and recommendations.",
      },
    ],
  }),
  component: Dashboard,
});

function clampScore(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getGeneratedAt(updatedAt?: string | null, createdAt?: string | null) {
  return updatedAt || createdAt || null;
}

function buildFallbackInsights(
  profileStrength: Record<string, number>,
  t: (key: string, params?: Record<string, string | number>) => string,
): DashboardInsight[] {
  const fallback: DashboardInsight[] = [];

  if (clampScore(profileStrength?.Resume) < 75) {
    fallback.push({
      title: t("dashboard.improveResumeScore"),
      description: t("dashboard.improveResumeScoreDescription"),
      action_label: t("dashboard.improve"),
      target_path: "/resumes",
      type: "resume",
    });
  }

  if (clampScore(profileStrength?.LinkedIn) < 75) {
    fallback.push({
      title: t("dashboard.optimizeLinkedInProfile"),
      description: t("dashboard.optimizeLinkedInProfileDescription"),
      action_label: t("dashboard.optimize"),
      target_path: "/linkedin",
      type: "linkedin",
    });
  }

  if (clampScore(profileStrength?.Portfolio) < 75) {
    fallback.push({
      title: t("dashboard.strengthenPortfolioProof"),
      description: t("dashboard.strengthenPortfolioProofDescription"),
      action_label: t("dashboard.review"),
      target_path: "/portfolio",
      type: "portfolio",
    });
  }

  if (clampScore(profileStrength?.Applications) < 70) {
    fallback.push({
      title: t("dashboard.buildApplicationMomentum"),
      description: t("dashboard.buildApplicationMomentumDescription"),
      action_label: t("dashboard.openBoard"),
      target_path: "/applications",
      type: "applications",
    });
  }

  return fallback.slice(0, 4);
}

function getWeakestScore(profileStrength: Record<string, number>) {
  const values = Object.values(profileStrength).map((score) => clampScore(score));
  return values.length ? Math.min(...values) : 0;
}

function Dashboard() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const {
    summary,
    isLoadingDashboard,
    isReviewingDashboard,
    error,
    loadSummary,
    reviewDashboard,
  } = useDashboard();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user) loadSummary();
  }, [user, loading]);

  const handleRunReview = async () => {
    await reviewDashboard();
  };

  if (loading || isLoadingDashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="flex items-center gap-3 text-sm text-white/60">
          <Loader2 className="size-4 animate-spin text-cyan-300" />
          {t("dashboard.loading")}
        </div>
      </div>
    );
  }

  if (!user) return null;

  const firstName = user?.first_name || user?.username || t("dashboard.userFallback");
  const profileStrength = summary?.profile_strength || {};
  const insights = summary?.insights?.length
    ? summary.insights
    : buildFallbackInsights(profileStrength, t);
  const nextBestActions = summary?.next_best_actions?.length
    ? summary.next_best_actions
    : insights;

  const generatedAt = getGeneratedAt(summary?.updated_at, summary?.created_at);
  const careerScore = clampScore(summary?.career_score?.value);
  const marketScore = clampScore(summary?.market_fit?.score);
  const weakestScore = getWeakestScore(profileStrength);
  const applicationsCount = summary?.application_pipeline?.length || 0;

  return (
    <AppShell
      logo={
        <img src={logo} alt="Launchly logo" className="h-8 w-auto object-contain" />
      }
      title={
        <div className="relative max-w-5xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-300/10 bg-cyan-300/[0.045] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-cyan-100/75">
            <Sparkles className="size-3.5" />
            {t("dashboard.heroBadge")}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {t("dashboard.heroTitle")}
            <span className="ml-2 bg-gradient-to-r from-violet-200 via-sky-200 to-cyan-200 bg-clip-text text-transparent">
              {firstName}
            </span>
          </h1>
        </div>
      }
      subtitle={t("dashboard.heroSubtitle")}
    >
      <div className="relative space-y-5 pb-10">
        <div className="pointer-events-none absolute -top-28 left-1/2 h-[26rem] w-[58rem] -translate-x-1/2 rounded-full bg-cyan-400/[0.055] blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-[28rem] h-[30rem] w-[30rem] rounded-full bg-violet-500/[0.045] blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-[52rem] h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/[0.035] blur-3xl" />

        {error && (
          <Card className="relative overflow-hidden border-orange-400/10 bg-orange-400/[0.06]">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-orange-400/10 blur-2xl" />
            <div className="relative flex items-start gap-3 text-sm text-orange-200">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div>{error}</div>
            </div>
          </Card>
        )}

        <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_10%_0%,rgba(34,211,238,0.11),transparent_28%),radial-gradient(circle_at_88%_10%,rgba(124,92,255,0.16),transparent_32%),rgba(255,255,255,0.022)] p-3 shadow-[0_30px_140px_rgba(0,0,0,0.32)] md:p-4">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.055),transparent_42%)]" />
          <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
            <CareerReadinessHero
              summary={summary}
              isReviewing={isReviewingDashboard}
              onRunReview={handleRunReview}
            />

            <div className="grid gap-3 rounded-[1.5rem] border border-white/[0.08] bg-black/20 p-4 backdrop-blur-xl">
              <div>
                <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-cyan-100/55">
                  {t("dashboard.liveCommandPulse")}
                </div>
                <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-white">
                  {t("dashboard.todaysCareerStatus")}
                </h2>
              </div>

              <PulseMetric label={t("dashboard.readiness")} value={careerScore} suffix="/100" tone="cyan" />
              <PulseMetric label={t("dashboard.marketFit")} value={marketScore} suffix="/100" tone="violet" />
              <PulseMetric label={t("dashboard.weakestSignalLabel")} value={weakestScore} suffix="%" tone="orange" />
              <PulseMetric label={t("dashboard.applications")} value={applicationsCount} suffix={` ${t("dashboard.activeLabel")}`} tone="white" />

              <button
                type="button"
                onClick={handleRunReview}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-3 py-2.5 text-xs font-semibold text-primary-foreground shadow-[0_16px_42px_rgba(34,211,238,0.16)] transition hover:scale-[1.01]"
              >
                <Zap className="size-3.5" />
                {t("dashboard.refreshIntelligence")}
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <NextBestActions
            insights={nextBestActions}
            onNavigate={(path) => navigate({ to: path })}
          />

          <AICoachFeed
            insights={insights}
            generatedAt={generatedAt}
            onNavigate={(path) => navigate({ to: path })}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <WeakestLinkCard
            profileStrength={profileStrength}
            onOpen={(path) => navigate({ to: path })}
          />

          <MarketFitPanel marketFit={summary?.market_fit || null} />
        </section>

        <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.74fr)]">
          <CareerSystemHealth
            profileStrength={profileStrength}
            interviewReadiness={clampScore(summary?.interview_readiness?.value)}
          />

          <ApplicationMomentum applications={summary?.application_pipeline || []} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.74fr)]">
          <Card className="relative self-start overflow-hidden border-white/[0.08] bg-[radial-gradient(circle_at_0%_0%,rgba(124,92,255,0.10),transparent_32%),radial-gradient(circle_at_100%_100%,rgba(34,211,238,0.08),transparent_34%),rgba(255,255,255,0.024)] p-0">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/35 to-transparent" />
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/[0.055] blur-3xl" />

            <div className="relative p-4 md:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-violet-100/60">
                    <Target className="size-3.5" />
                    {t("dashboard.growthAndActivity")}
                  </div>
                  <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-white">
                    {t("dashboard.progressIntelligence")}
                  </h2>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-right">
                  <div className="text-lg font-semibold text-white">
                    {careerScore}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {t("dashboard.readinessLower")}
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <CareerGrowthTimeline growth={summary?.career_growth || []} />

                <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-black/20 p-3.5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(124,92,255,0.10),transparent_38%)]" />

                  <div className="relative mb-2.5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/42">
                        {t("dashboard.activitySignal")}
                      </div>
                      <h3 className="mt-1 text-base font-semibold tracking-tight text-white">
                        {t("dashboard.consistencyHeatmap")}
                      </h3>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-center">
                      <div className="text-lg font-semibold text-white">
                        {summary?.activity?.streak_days || 0}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {t("dashboard.dayStreakLabel")}
                      </div>
                    </div>
                  </div>

                  <ActivityHeatmap cells={summary?.activity?.heatmap || []} t={t} />

                  <div className="relative mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{t("dashboard.dayStreak", { count: summary?.activity?.streak_days || 0 })}</span>
                    <span>{t("dashboard.last13Weeks")}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid content-start gap-5">
            <SkillGapRadar skills={summary?.missing_skills || []} />
            <WeeklyActionPlan items={summary?.weekly_plan || []} />
          </div>
        </section>


      </div>
    </AppShell>
  );
}

function PulseMetric({
  label,
  value,
  suffix,
  tone,
}: {
  label: string;
  value: number;
  suffix: string;
  tone: "cyan" | "violet" | "orange" | "white";
}) {
  const toneClass =
    tone === "cyan"
      ? "text-cyan-200"
      : tone === "violet"
        ? "text-violet-200"
        : tone === "orange"
          ? "text-orange-200"
          : "text-white";

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2.5">
      <div className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white/38">
        {label}
      </div>
      <div className={`mt-1 text-lg font-semibold ${toneClass}`}>
        {value}
        <span className="text-xs text-white/35">{suffix}</span>
      </div>
    </div>
  );
}

function ActivityHeatmap({
  cells,
  t,
}: {
  cells: number[];
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const normalizedCells = cells.length > 0 ? cells : Array.from({ length: 13 * 7 }).map(() => 0);
  const colors = [
    "bg-white/5",
    "bg-[oklch(0.72_0.20_295)]/20",
    "bg-[oklch(0.72_0.20_295)]/40",
    "bg-[oklch(0.72_0.20_295)]/70 shadow-[0_0_12px_rgba(168,85,247,0.25)]",
    "bg-[oklch(0.72_0.20_295)] shadow-[0_0_16px_rgba(168,85,247,0.4)]",
  ];

  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto rounded-[1.1rem] border border-white/5 bg-black/20 px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {normalizedCells.slice(0, 13 * 7).map((rawValue, index) => {
        const value = Math.max(0, Math.min(4, Math.round(rawValue || 0)));
        return (
          <div
            key={`activity-${index}`}
            title={t("dashboard.activityLevel", { value })}
            className={`size-2.5 rounded-[4px] transition hover:scale-125 ${colors[value]}`}
          />
        );
      })}
    </div>
  );
}

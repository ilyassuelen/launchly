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
import logo from "../../static/logo.png";
import {
  AlertTriangle,
  Loader2,
} from "lucide-react";

import {
  useDashboard,
} from "@/features/dashboard/hooks/useDashboard";

import {
  CareerReadinessHero,
} from "@/features/dashboard/components/CareerReadinessHero";
import {
  NextBestActions,
} from "@/features/dashboard/components/NextBestActions";
import {
  CareerSystemHealth,
} from "@/features/dashboard/components/CareerSystemHealth";
import {
  WeakestLinkCard,
} from "@/features/dashboard/components/WeakestLinkCard";
import {
  MarketFitPanel,
} from "@/features/dashboard/components/MarketFitPanel";
import {
  ApplicationMomentum,
} from "@/features/dashboard/components/ApplicationMomentum";
import {
  SkillGapRadar,
} from "@/features/dashboard/components/SkillGapRadar";
import {
  CareerGrowthTimeline,
} from "@/features/dashboard/components/CareerGrowthTimeline";
import {
  AICoachFeed,
} from "@/features/dashboard/components/AICoachFeed";
import {
  WeeklyActionPlan,
} from "@/features/dashboard/components/WeeklyActionPlan";

import type {
  DashboardInsight,
} from "@/features/dashboard/types/dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      {
        title: "Dashboard — Launchly",
      },
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
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function getGeneratedAt(
  updatedAt?: string | null,
  createdAt?: string | null,
) {
  return updatedAt || createdAt || null;
}

function buildFallbackInsights(
  profileStrength: Record<string, number>,
): DashboardInsight[] {
  const fallback: DashboardInsight[] = [];

  if (clampScore(profileStrength?.Resume) < 75) {
    fallback.push({
      title: "Improve your resume score",
      description:
        "Run the Resume Builder analysis and strengthen weak resume sections before sending more applications.",
      action_label: "Improve",
      target_path: "/resumes",
      type: "resume",
    });
  }

  if (clampScore(profileStrength?.LinkedIn) < 75) {
    fallback.push({
      title: "Optimize your LinkedIn profile",
      description:
        "Improve your headline, About section and searchable keywords to increase recruiter visibility.",
      action_label: "Optimize",
      target_path: "/linkedin",
      type: "linkedin",
    });
  }

  if (clampScore(profileStrength?.Portfolio) < 75) {
    fallback.push({
      title: "Strengthen your portfolio proof",
      description:
        "Add clearer project outcomes, technical proof and README improvements to raise your portfolio signal.",
      action_label: "Review",
      target_path: "/portfolio",
      type: "portfolio",
    });
  }

  if (clampScore(profileStrength?.Applications) < 70) {
    fallback.push({
      title: "Build application momentum",
      description:
        "Send a few focused applications this week to create a stronger pipeline.",
      action_label: "Open Board",
      target_path: "/applications",
      type: "applications",
    });
  }

  return fallback.slice(0, 4);
}

function Dashboard() {
  const { user, loading } = useAuth();
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
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user) {
      loadSummary();
    }
  }, [user, loading]);

  const handleRunReview = async () => {
    await reviewDashboard();
  };

  if (loading || isLoadingDashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="flex items-center gap-3 text-sm text-white/60">
          <Loader2 className="size-4 animate-spin text-cyan-300" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const firstName =
    user?.first_name ||
    user?.username ||
    "User";

  const profileStrength =
    summary?.profile_strength || {};

  const insights =
    summary?.insights?.length
      ? summary.insights
      : buildFallbackInsights(profileStrength);

  const nextBestActions =
    summary?.next_best_actions?.length
      ? summary.next_best_actions
      : insights;

  const generatedAt = getGeneratedAt(
    summary?.updated_at,
    summary?.created_at,
  );

  return (
    <AppShell
      logo={
        <img
          src={logo}
          alt="Launchly logo"
          className="h-8 w-auto object-contain"
        />
      }
      title={`Welcome back, ${firstName} 👋`}
      subtitle="Your AI career command center based on your saved resume, recruiter, LinkedIn, portfolio and application data."
    >
      <div className="space-y-4">
        {error && (
          <Card className="border-orange-400/10 bg-orange-400/[0.06]">
            <div className="flex items-start gap-3 text-sm text-orange-200">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div>{error}</div>
            </div>
          </Card>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          <CareerReadinessHero
            summary={summary}
            isReviewing={isReviewingDashboard}
            onRunReview={handleRunReview}
          />

          <WeakestLinkCard
            profileStrength={profileStrength}
            onOpen={(path) => navigate({ to: path })}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <NextBestActions
            insights={nextBestActions}
            onNavigate={(path) => navigate({ to: path })}
          />

          <CareerSystemHealth
            profileStrength={profileStrength}
            interviewReadiness={clampScore(
              summary?.interview_readiness?.value,
            )}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <CareerGrowthTimeline
            growth={summary?.career_growth || []}
          />

          <MarketFitPanel
            marketFit={summary?.market_fit || null}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <AICoachFeed
            insights={insights}
            generatedAt={generatedAt}
            onNavigate={(path) => navigate({ to: path })}
          />

          <WeeklyActionPlan
            items={summary?.weekly_plan || []}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SkillGapRadar
            skills={summary?.missing_skills || []}
          />

          <ApplicationMomentum
            applications={summary?.application_pipeline || []}
          />

          <Card className="relative overflow-hidden">
            <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative mb-3 text-sm font-semibold">
              Activity heatmap
            </div>

            <ActivityHeatmap
              cells={summary?.activity?.heatmap || []}
            />

            <div className="relative mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {summary?.activity?.streak_days || 0}-day streak
              </span>
              <span>Last 13 weeks</span>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function ActivityHeatmap({
  cells,
}: {
  cells: number[];
}) {
  const normalizedCells =
    cells.length > 0
      ? cells
      : Array.from({ length: 13 * 7 }).map(() => 0);

  const colors = [
    "bg-white/5",
    "bg-[oklch(0.72_0.20_295)]/20",
    "bg-[oklch(0.72_0.20_295)]/40",
    "bg-[oklch(0.72_0.20_295)]/70 shadow-[0_0_12px_rgba(168,85,247,0.25)]",
    "bg-[oklch(0.72_0.20_295)] shadow-[0_0_16px_rgba(168,85,247,0.4)]",
  ];

  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1">
      {normalizedCells.slice(0, 13 * 7).map((rawValue, index) => {
        const value = Math.max(
          0,
          Math.min(4, Math.round(rawValue || 0)),
        );

        return (
          <div
            key={`activity-${index}`}
            title={`Activity level ${value}`}
            className={`size-3 rounded-[4px] transition hover:scale-125 ${colors[value]}`}
          />
        );
      })}
    </div>
  );
}
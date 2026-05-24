import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Github,
  Linkedin,
  Target,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";

import type {
  DashboardActionItem,
  DashboardInsight,
} from "@/features/dashboard/types/dashboard";

type NextBestActionItem =
  | DashboardInsight
  | DashboardActionItem;

type NextBestActionsProps = {
  insights: NextBestActionItem[];
  onNavigate: (path: string) => void;
};

function getInsightIcon(type?: string | null) {
  const key = (type || "").toLowerCase();

  if (key.includes("linkedin")) return Linkedin;
  if (key.includes("portfolio")) return Github;
  if (key.includes("recruiter")) return Eye;
  if (key.includes("success")) return CheckCircle2;

  return Target;
}

export function NextBestActions({
  insights,
  onNavigate,
}: NextBestActionsProps) {
  const visibleInsights = insights.slice(0, 3);

  return (
    <Card className="relative overflow-hidden lg:col-span-2">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative mb-4">
        <div className="text-sm font-semibold">
          Next best actions
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          Prioritized from your latest AI career review.
        </div>
      </div>

      <div className="relative space-y-3">
        {visibleInsights.length === 0 && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-sm text-white/50">
            Run an AI review to generate your next best actions.
          </div>
        )}

        {visibleInsights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          const targetPath = insight.target_path || "/dashboard";
          const actionLabel = insight.action_label || "Open";

          return (
            <div
              key={`${insight.title}-${index}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-cyan-300/20 hover:bg-white/[0.055]"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 transition group-hover:scale-105 group-hover:bg-white/10">
                  <Icon className="size-4 text-cyan-200" />
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white/90">
                    {insight.title}
                  </div>

                  <div className="mt-1 text-xs leading-5 text-muted-foreground">
                    {insight.description}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(targetPath)}
                className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                {actionLabel}
                <ArrowRight className="size-3" />
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
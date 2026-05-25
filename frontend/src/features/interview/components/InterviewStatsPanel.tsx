import {
  BarChart3,
  Trophy,
  Zap,
} from "lucide-react";

import {
  Card,
  Progress,
} from "@/components/launchly/AppShell";

import type {
  InterviewStatsResponse,
} from "@/features/interview/types/interview";

type InterviewStatsPanelProps = {
  stats: InterviewStatsResponse | null;
};

function clampScore(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

export function InterviewStatsPanel({
  stats,
}: InterviewStatsPanelProps) {
  const averageScore = clampScore(stats?.average_score);
  const bestScore = clampScore(stats?.best_score);
  const totalSessions = stats?.total_sessions || 0;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_38%)]" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <BarChart3 className="size-4 text-cyan-300" />
            Interview stats
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/55">
            {totalSessions} sessions
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="size-3.5 text-cyan-300" />
              Average
            </div>

            <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {averageScore}
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              overall score
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Trophy className="size-3.5 text-violet-300" />
              Best
            </div>

            <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {bestScore}
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              highest score
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {(stats?.by_difficulty || []).length === 0 && (
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm text-white/50">
              Complete your first interview to unlock score statistics.
            </div>
          )}

          {(stats?.by_difficulty || []).map((bucket) => (
            <div
              key={bucket.difficulty}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
            >
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-white/80">
                  {bucket.difficulty}
                </span>

                <span className="text-muted-foreground">
                  {bucket.sessions} sessions · best {clampScore(bucket.best_score)}
                </span>
              </div>

              <Progress
                label="Average score"
                value={clampScore(bucket.average_score)}
                color={
                  clampScore(bucket.average_score) >= 75
                    ? "green"
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

import {
  Award,
  CheckCircle2,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  Progress,
} from "@/components/launchly/AppShell";

import type {
  InterviewResult,
} from "@/features/interview/types/interview";

type InterviewResultSummaryProps = {
  result: InterviewResult | null;
};

function clampScore(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function getScoreLabel(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Promising";
  if (score > 0) return "Needs practice";

  return "Pending";
}

function getScoreTone(score: number) {
  if (score >= 80) return "text-emerald-200";
  if (score >= 60) return "text-cyan-200";
  if (score >= 40) return "text-amber-200";

  return "text-red-200";
}

export function InterviewResultSummary({
  result,
}: InterviewResultSummaryProps) {
  const overallScore = clampScore(
    result?.overall_score,
  );

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_38%)]" />

      <div className="relative">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Award className="size-4 text-violet-300" />
              Interview score
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              Final performance rating for your completed mock interview.
            </div>
          </div>

          <div className={`rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold ${getScoreTone(overallScore)}`}>
            {getScoreLabel(overallScore)}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative grid size-28 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
            <div className="absolute inset-3 rounded-full border border-violet-300/15" />

            <div className="text-center">
              <div className="text-4xl font-semibold tracking-tight text-white">
                {overallScore}
              </div>

              <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-violet-200/70">
                score
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <Progress
              label="Confidence"
              value={clampScore(result?.confidence_score)}
            />

            <Progress
              label="Communication"
              value={clampScore(result?.communication_score)}
              color={
                clampScore(result?.communication_score) >= 75
                  ? "green"
                  : undefined
              }
            />

            <Progress
              label="STAR structure"
              value={clampScore(result?.structure_score)}
              color={
                clampScore(result?.structure_score) < 65
                  ? "pink"
                  : undefined
              }
            />

            <Progress
              label="Specificity"
              value={clampScore(result?.specificity_score)}
            />
          </div>
        </div>

        {!result && (
          <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm leading-6 text-white/50">
            Complete an interview to generate your score summary.
          </div>
        )}

        {result && (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.05] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <CheckCircle2 className="size-4 text-emerald-300" />
                Strengths
              </div>

              <ul className="space-y-2 text-xs leading-5 text-white/65">
                {(result.strengths || []).length === 0 && (
                  <li>No strengths detected yet.</li>
                )}

                {(result.strengths || []).slice(0, 4).map((item, index) => (
                  <li key={`${item}-${index}`}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <Target className="size-4 text-cyan-300" />
                Focus areas
              </div>

              <ul className="space-y-2 text-xs leading-5 text-white/65">
                {(result.weaknesses || []).length === 0 && (
                  <li>No focus areas detected yet.</li>
                )}

                {(result.weaknesses || []).slice(0, 4).map((item, index) => (
                  <li key={`${item}-${index}`}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-5 rounded-2xl border border-white/5 bg-black/10 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <TrendingUp className="size-4 text-cyan-300" />
              Session summary
            </div>

            <div className="grid gap-3 text-xs md:grid-cols-3">
              <div className="rounded-xl bg-white/[0.03] p-3">
                <div className="text-muted-foreground">
                  Mode
                </div>

                <div className="mt-1 font-semibold text-white/85">
                  {result.mode}
                </div>
              </div>

              <div className="rounded-xl bg-white/[0.03] p-3">
                <div className="text-muted-foreground">
                  Level
                </div>

                <div className="mt-1 font-semibold text-white/85">
                  {result.difficulty}
                </div>
              </div>

              <div className="rounded-xl bg-white/[0.03] p-3">
                <div className="text-muted-foreground">
                  Role
                </div>

                <div className="mt-1 truncate font-semibold text-white/85">
                  {result.role}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

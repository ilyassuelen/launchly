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

function getVerdictLabel(score: number) {
  if (score >= 85) return "Excellent candidate";
  if (score >= 75) return "Strong candidate";
  if (score >= 60) return "Promising candidate";
  if (score > 0) return "Needs more practice";

  return "Awaiting result";
}

function getVerdictDescription(
  result: InterviewResult | null,
  score: number,
) {
  if (!result) {
    return "Complete an interview to receive your AI verdict.";
  }

  if (score >= 85) {
    return `You are showing a very strong signal for ${result.difficulty} ${result.role} interviews.`;
  }

  if (score >= 75) {
    return `You are showing a strong signal for ${result.difficulty} ${result.role} interviews.`;
  }

  if (score >= 60) {
    return `You have a solid base for ${result.difficulty} ${result.role} interviews, with clear areas to sharpen.`;
  }

  return `Your ${result.difficulty} ${result.role} interview readiness needs more structured practice.`;
}

export function InterviewResultSummary({
  result,
}: InterviewResultSummaryProps) {
  const overallScore = clampScore(
    result?.overall_score,
  );

  return (
    <Card className="relative overflow-hidden border-violet-300/15 bg-[linear-gradient(135deg,rgba(17,24,39,0.98),rgba(15,23,42,0.96)_42%,rgba(41,24,77,0.78))] shadow-[0_28px_90px_rgba(139,92,246,0.10),0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(139,92,246,0.20),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.045),transparent_34%)]" />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/70 to-transparent" />

      <div className="relative">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/[0.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-100/75">
              <Award className="size-3.5 text-violet-300" />
              Interview score
            </div>

            <div className="mt-3 text-2xl font-semibold tracking-tight text-white">
              {result ? "Your interview performance" : "Score dashboard"}
            </div>

            <div className="mt-1 max-w-2xl text-sm leading-6 text-white/55">
              {result
                ? "A clear breakdown of your readiness, communication quality and answer structure."
                : "Complete an interview to unlock your performance dashboard."}
            </div>
          </div>

          <div className={`shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold shadow-[0_12px_34px_rgba(0,0,0,0.22)] ${getScoreTone(overallScore)}`}>
            {getScoreLabel(overallScore)}
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
          <div className="relative overflow-hidden rounded-[2.25rem] border border-violet-300/15 bg-black/30 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_26px_85px_rgba(0,0,0,0.30)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.28),transparent_56%),radial-gradient(circle_at_50%_16%,rgba(34,211,238,0.18),transparent_42%)]" />
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

            <div className="relative flex flex-col items-center text-center">
              <div className="relative grid size-44 place-items-center rounded-full border border-violet-300/25 bg-white/[0.045] shadow-[0_28px_85px_rgba(139,92,246,0.22),0_0_55px_rgba(34,211,238,0.08)]">
                <div className="absolute inset-0 rounded-full border border-violet-300/15" />
                <div className="absolute inset-3 animate-pulse rounded-full border border-cyan-300/20 shadow-[0_0_42px_rgba(34,211,238,0.16)]" />
                <div className="absolute inset-7 rounded-full bg-black/25" />
                <div className="absolute inset-11 rounded-full bg-gradient-to-br from-violet-400/12 to-cyan-300/10" />

                <div className="relative">
                  <div className="text-6xl font-semibold tracking-[-0.06em] text-white">
                    {overallScore}
                  </div>

                  <div className="mt-1 text-[10px] uppercase tracking-[0.24em] text-violet-100/70">
                    score
                  </div>
                </div>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/[0.08] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
                <CheckCircle2 className="size-3.5 text-emerald-300" />
                {getVerdictLabel(overallScore)}
              </div>

              <div className="mt-5 max-w-[220px] text-sm leading-6 text-white/60">
                {getVerdictDescription(result, overallScore)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/7 bg-white/[0.035] p-4">
                <Progress
                  label="Confidence"
                  value={clampScore(result?.confidence_score)}
                />
              </div>

              <div className="rounded-2xl border border-white/7 bg-white/[0.035] p-4">
                <Progress
                  label="Communication"
                  value={clampScore(result?.communication_score)}
                  color={
                    clampScore(result?.communication_score) >= 75
                      ? "green"
                      : undefined
                  }
                />
              </div>

              <div className="rounded-2xl border border-white/7 bg-white/[0.035] p-4">
                <Progress
                  label="STAR structure"
                  value={clampScore(result?.structure_score)}
                  color={
                    clampScore(result?.structure_score) < 65
                      ? "pink"
                      : undefined
                  }
                />
              </div>

              <div className="rounded-2xl border border-white/7 bg-white/[0.035] p-4">
                <Progress
                  label="Specificity"
                  value={clampScore(result?.specificity_score)}
                />
              </div>
            </div>

            {!result && (
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm leading-6 text-white/50">
                Complete an interview to generate your score summary.
              </div>
            )}

            {result && (
              <div className="rounded-[1.75rem] border border-white/7 bg-black/20 p-4">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                  <TrendingUp className="size-4 text-cyan-300" />
                  Session summary
                </div>

                <div className="grid gap-3 text-xs md:grid-cols-3">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.035] p-3">
                    <div className="text-muted-foreground">
                      Mode
                    </div>

                    <div className="mt-1 font-semibold text-white/85">
                      {result.mode}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.035] p-3">
                    <div className="text-muted-foreground">
                      Level
                    </div>

                    <div className="mt-1 font-semibold text-white/85">
                      {result.difficulty}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.035] p-3">
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
        </div>

        {result && (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-[1.75rem] border border-emerald-400/10 bg-emerald-400/[0.045] p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                <CheckCircle2 className="size-4 text-emerald-300" />
                Key strengths
              </div>

              <ul className="space-y-2.5 text-xs leading-5 text-white/65">
                {(result.strengths || []).length === 0 && (
                  <li>No strengths detected yet.</li>
                )}

                {(result.strengths || []).slice(0, 3).map((item, index) => (
                  <li key={`${item}-${index}`} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-300/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.75rem] border border-cyan-400/10 bg-cyan-400/[0.045] p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                <Target className="size-4 text-cyan-300" />
                Highest leverage focus
              </div>

              <ul className="space-y-2.5 text-xs leading-5 text-white/65">
                {(result.weaknesses || []).length === 0 && (
                  <li>No focus areas detected yet.</li>
                )}

                {(result.weaknesses || []).slice(0, 3).map((item, index) => (
                  <li key={`${item}-${index}`} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-300/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

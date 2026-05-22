import {
  Sparkles,
  TrendingUp,
  BadgeCheck,
  TriangleAlert,
  Brain,
  Loader2
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";

import type {
  CoverLetterAnalysis,
} from "@/features/cover-letter/types/coverLetterAnalysis";

interface Props {
  analysis: CoverLetterAnalysis | null;

  isAnalyzing: boolean;

  onAnalyze: () => void;

  canAnalyze: boolean;
}

export function CoverLetterInsightsPanel({
  analysis,
  isAnalyzing,
  onAnalyze,
  canAnalyze,
}: Props) {
  const smartSuggestions =
    analysis?.smart_suggestions || [];

  const recruiterAnalysis =
    analysis?.recruiter_analysis;

  return (
    <div className="mx-auto w-full max-w-[1700px]">

      <div className="flex flex-col gap-4">

        {/* SMART SUGGESTIONS */}
        <Card className="overflow-hidden">

          <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-4">

            <div className="flex items-center gap-2">

              <Sparkles className="size-5 text-cyan-300" />

              <div>

                <div className="text-sm font-semibold">
                  Smart suggestions
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  AI-powered recommendations to improve recruiter response
                </div>

              </div>

            </div>

            <button
              onClick={onAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              className="
                inline-flex
                min-w-[220px]
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-cyan-400/20
                bg-cyan-400/[0.06]
                px-5
                py-3
                text-sm
                font-semibold
                text-cyan-200
                transition-all
                duration-200
                hover:bg-cyan-400/[0.10]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="size-4" />

                  {analysis
                      ? "Re-Analyze"
                      : "Analyze Cover Letter"}
                </>
              )}
            </button>

          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-3">

            {isAnalyzing ? (
              <div className="col-span-full rounded-3xl border border-white/5 bg-white/[0.03] p-6 text-sm text-white/60">
                Generating AI analysis...
              </div>
            ) : smartSuggestions.length > 0 ? (
              smartSuggestions.map((suggestion, index) => {
                const isWarning =
                  suggestion.type === "warning";

                const isSuccess =
                  suggestion.type === "success";

                const icon = isWarning ? (
                  <TriangleAlert className="size-5 text-orange-300" />
                ) : isSuccess ? (
                  <BadgeCheck className="size-5 text-emerald-300" />
                ) : (
                  <TrendingUp className="size-5 text-cyan-300" />
                );

                const cardClasses = isWarning
                  ? "border-orange-400/10 bg-orange-400/[0.06]"
                  : isSuccess
                    ? "border-emerald-400/10 bg-emerald-400/[0.05]"
                    : "border-cyan-400/10 bg-cyan-400/[0.05]";

                const iconClasses = isWarning
                  ? "bg-orange-400/10"
                  : isSuccess
                    ? "bg-emerald-400/10"
                    : "bg-cyan-400/10";

                const priorityClasses =
                  suggestion.priority === "high"
                    ? "bg-red-400/10 text-red-300"
                    : suggestion.priority === "medium"
                      ? "bg-orange-400/10 text-orange-300"
                      : "bg-cyan-400/10 text-cyan-300";

                return (
                  <div
                    key={index}
                    className={`rounded-3xl border p-6 ${cardClasses}`}
                  >

                    <div
                      className={`mb-4 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${priorityClasses}`}
                    >
                      {suggestion.priority || "low"} impact
                    </div>
                    <div className="flex items-center gap-4">

                      <div className={`rounded-2xl p-3 ${iconClasses}`}>
                        {icon}
                      </div>

                      <div className="text-mt font-semibold leading-tight tracking-[-0.02em] text-white">
                        {suggestion.title}
                      </div>

                    </div>

                    <div className="mt-5 text-[15px] leading-6 text-white/60">
                      {suggestion.description}
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="col-span-full rounded-3xl border border-white/5 bg-white/[0.03] p-6 text-sm text-white/60">
                Generate a cover letter to receive AI-powered recruiter analysis.
              </div>
            )}

          </div>

        </Card>

        {/* RECRUITER ANALYSIS */}
        <Card className="relative overflow-hidden">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_70%)]" />

          <div className="relative">

            <div className="flex items-center gap-2 border-b border-white/5 pb-4">

              <Brain className="size-5 text-violet-300" />

              <div>

                <div className="text-sm font-semibold">
                  Recruiter analysis
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  Simulated recruiter review
                </div>

              </div>

            </div>

            <div className="mt-5 space-y-4">

              {isAnalyzing ? (
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm text-white/60">
                  Analyzing recruiter impression...
                </div>
              ) : recruiterAnalysis ? (
                <>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">

                    <div className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                      Strongest Area
                    </div>

                    <div className="mt-2 text-sm text-white/80">
                      {recruiterAnalysis.strongest_area}
                    </div>

                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">

                    <div className="text-xs uppercase tracking-[0.18em] text-orange-300">
                      Improvement Opportunity
                    </div>

                    <div className="mt-2 text-sm text-white/80">
                      {recruiterAnalysis.improvement_opportunity}
                    </div>

                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">

                    <div className="text-xs uppercase tracking-[0.18em] text-emerald-300">
                      Recruiter Impression
                    </div>

                    <div className="mt-2 text-sm text-white/80">
                      {recruiterAnalysis.recruiter_impression}
                    </div>

                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm text-white/60">
                  No recruiter analysis available yet.
                </div>
              )}

            </div>

          </div>

        </Card>

      </div>

    </div>
  );
}
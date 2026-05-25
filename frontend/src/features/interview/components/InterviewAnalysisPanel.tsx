import {
  Activity,
  AlertTriangle,
  Check,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  Progress,
} from "@/components/launchly/AppShell";

import type {
  InterviewResult,
} from "@/features/interview/types/interview";

type InterviewAnalysisPanelProps = {
  result: InterviewResult | null;
  isActive?: boolean;
};

function getImpactStyles(impact?: string | null) {
  const key = (impact || "").toLowerCase();

  if (key === "high") {
    return {
      card: "border-emerald-400/10 bg-emerald-400/[0.05]",
      icon: "text-emerald-300",
      badge: "bg-emerald-300/10 text-emerald-200",
      iconType: Check,
    };
  }

  if (key === "low") {
    return {
      card: "border-cyan-400/10 bg-cyan-400/[0.05]",
      icon: "text-cyan-300",
      badge: "bg-cyan-300/10 text-cyan-200",
      iconType: TrendingUp,
    };
  }

  return {
    card: "border-orange-400/10 bg-orange-400/[0.05]",
    icon: "text-orange-300",
    badge: "bg-orange-300/10 text-orange-200",
    iconType: AlertTriangle,
  };
}

export function InterviewAnalysisPanel({
  result,
  isActive = false,
}: InterviewAnalysisPanelProps) {
  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Activity className="size-4 text-cyan-300" />
          Communication analysis
        </div>

        <div className="space-y-4">
          <Progress
            label="Confidence"
            value={result?.confidence_score || 0}
          />

          <Progress
            label="Communication"
            value={result?.communication_score || 0}
            color={
              (result?.communication_score || 0) >= 75
                ? "green"
                : undefined
            }
          />

          <Progress
            label="Structure (STAR)"
            value={result?.structure_score || 0}
            color={
              (result?.structure_score || 0) < 65
                ? "pink"
                : undefined
            }
          />

          <Progress
            label="Specificity"
            value={result?.specificity_score || 0}
          />
        </div>

        {!result && (
          <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-xs leading-5 text-white/50">
            {isActive
              ? "Your communication analysis will appear automatically after the final answer."
              : "Start and complete an interview to unlock your analysis."}
          </div>
        )}
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_40%)]" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-violet-300" />
            AI recruiter insights
          </div>

          <div className="space-y-3">
            {!result && (
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm text-white/50">
                Recruiter-style insights will be generated after the interview.
              </div>
            )}

            {result?.recruiter_insights?.map((insight, index) => {
              const styles = getImpactStyles(insight.impact);
              const Icon = styles.iconType;

              return (
                <div
                  key={`${insight.title}-${index}`}
                  className={`rounded-2xl border p-4 ${styles.card}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-2">
                      <Icon className={`mt-0.5 size-4 ${styles.icon}`} />

                      <div>
                        <div className="text-sm font-medium text-white">
                          {insight.title}
                        </div>

                        <div className="mt-1 text-xs leading-5 text-white/60">
                          {insight.description}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] capitalize ${styles.badge}`}
                    >
                      {insight.impact || "medium"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <TrendingUp className="size-4 text-cyan-300" />
          Session telemetry
        </div>

        <div className="space-y-3 text-sm">
          {[
            [
              "Recruiter engagement",
              result?.recruiter_engagement || "Pending",
            ],
            [
              "Filler words",
              result?.filler_words || "Unknown",
            ],
            [
              "Estimated confidence",
              result?.estimated_confidence || "Pending",
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-3"
            >
              <span className="text-white/60">
                {label}
              </span>

              <span className="font-medium text-white/85">
                {value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-violet-300" />
          AI coaching tips
        </div>

        <ul className="space-y-3 text-sm text-white/75">
          {!result && (
            <li className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-white/50">
              Coaching tips will be generated from your answers.
            </li>
          )}

          {result?.coaching_tips?.map((tip, index) => (
            <li
              key={`${tip}-${index}`}
              className="rounded-xl border border-white/5 bg-white/[0.03] p-3"
            >
              {tip}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

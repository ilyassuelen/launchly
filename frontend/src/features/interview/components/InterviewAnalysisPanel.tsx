import {
  Activity,
  AlertTriangle,
  Check,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import {
  Card,
} from "@/components/launchly/AppShell";

import { useI18n } from "@/i18n/I18nContext";

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
  const { t } = useI18n();

  return (
    <Card className="relative overflow-hidden border-white/8 bg-white/[0.025] shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.06),transparent_35%)]" />

      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
              <Activity className="size-3.5 text-cyan-300" />
              {t("interview.analysis")}
            </div>

            <div className="mt-3 text-lg font-semibold text-white">
              {t("interview.aiFeedbackOverview")}
            </div>

            <div className="mt-1 max-w-xl text-sm leading-6 text-white/50">
              {result
                ? t("interview.feedbackOverviewReady")
                : isActive
                  ? t("interview.feedbackOverviewAfterFinalAnswer")
                  : t("interview.feedbackOverviewLocked")}
            </div>
          </div>

          <div className="shrink-0 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-white/45">
            {result ? t("interview.generated") : t("interview.pending")}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-[1.75rem] border border-white/7 bg-black/15 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sparkles className="size-4 text-violet-300" />
                  {t("interview.recruiterPerspective")}
                </div>

                <div className="mt-1 text-xs leading-5 text-white/45">
                  {t("interview.recruiterPerspectiveDescription")}
                </div>
              </div>

              {result && (
                <div className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[10px] text-white/45">
                  {t("interview.signalsCount", {
                    count: result.recruiter_insights?.length || 0,
                  })}
                </div>
              )}
            </div>

            <div className="divide-y divide-white/[0.06]">
              {!result && (
                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4 text-sm leading-6 text-white/50">
                  {t("interview.recruiterInsightsEmpty")}
                </div>
              )}

              {result?.recruiter_insights?.map((insight, index) => {
                const styles = getImpactStyles(insight.impact);
                const Icon = styles.iconType;

                return (
                  <div
                    key={`${insight.title}-${index}`}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-3">
                        <div className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-white/[0.04] ${styles.icon}`}>
                          <Icon className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="text-sm font-medium text-white">
                            {insight.title}
                          </div>

                          <div className="mt-1 text-xs leading-5 text-white/55">
                            {insight.description}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`shrink-0 rounded-full px-2 py-1 text-[10px] capitalize ${styles.badge}`}
                      >
                        {insight.impact || t("interview.medium")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                <TrendingUp className="size-3.5 text-cyan-300" />
                {t("interview.sessionSignals")}
              </div>

              <div className="grid gap-3 text-xs sm:grid-cols-3">
                {[
                  [
                    t("interview.engagement"),
                    result?.recruiter_engagement || t("interview.pending"),
                  ],
                  [
                    t("interview.fillerWords"),
                    result?.filler_words || t("interview.unknown"),
                  ],
                  [
                    t("interview.confidence"),
                    result?.estimated_confidence || t("interview.pending"),
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/[0.05] bg-black/10 p-3"
                  >
                    <div className="text-white/40">
                      {label}
                    </div>

                    <div className="mt-1 font-semibold text-white/80">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/7 bg-black/15 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <div className="mb-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <TrendingUp className="size-4 text-cyan-300" />
                {t("interview.growthOpportunities")}
              </div>

              <div className="mt-1 text-xs leading-5 text-white/45">
                {t("interview.growthOpportunitiesDescription")}
              </div>
            </div>

            <ul className="space-y-4 text-sm text-white/65">
              {!result && (
                <li className="rounded-2xl border border-white/5 bg-white/[0.025] p-4 text-white/50">
                  {t("interview.coachingTipsEmpty")}
                </li>
              )}

              {result?.coaching_tips?.map((tip, index) => (
                <li
                  key={`${tip}-${index}`}
                  className="flex gap-3 border-b border-white/[0.06] pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="grid size-7 shrink-0 place-items-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.06] text-[11px] font-semibold text-cyan-200">
                    {index + 1}
                  </div>

                  <span className="leading-6">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}

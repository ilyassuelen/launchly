import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Github,
  Linkedin,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";

import type {
  DashboardActionItem,
  DashboardInsight,
} from "@/features/dashboard/types/dashboard";

type NextBestActionItem = DashboardInsight | DashboardActionItem;

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

function getActionLabel(index: number, t: (key: string) => string) {
  if (index === 0) return t("dashboard.actionPrimary");
  if (index === 1) return t("dashboard.actionSupport");
  return t("dashboard.actionMomentum");
}

export function NextBestActions({ insights, onNavigate }: NextBestActionsProps) {
  const { t } = useI18n();
  const visibleInsights = insights.slice(0, 3);

  return (
    <Card className="relative overflow-hidden border-white/[0.08] bg-[radial-gradient(circle_at_0%_0%,rgba(124,92,255,0.12),transparent_32%),radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.10),transparent_30%),rgba(255,255,255,0.028)] p-0">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_40%)]" />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/25 to-transparent" />

      <div className="relative p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-violet-100/60">
              <Zap className="size-3.5" />
              {t("dashboard.thisWeeksMission")}
            </div>
            <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-white">
              {t("dashboard.nextBestActionsTitle")}
            </h2>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-center">
            <div className="text-lg font-semibold text-white">{visibleInsights.length}</div>
            <div className="text-[0.6rem] uppercase tracking-[0.14em] text-white/35">
              {t("dashboard.actions")}
            </div>
          </div>
        </div>

        <div className="relative space-y-2.5">
          {visibleInsights.length === 0 && (
            <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4 text-sm text-white/50">
              <div className="mb-2 grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Sparkles className="size-4 text-cyan-200" />
              </div>
              {t("dashboard.nextBestActionsEmpty")}
            </div>
          )}

          {visibleInsights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            const targetPath = insight.target_path || "/dashboard";
            const actionLabel = insight.action_label || t("dashboard.open");
            const isPrimary = index === 0;

            return (
              <div
                key={`${insight.title}-${index}`}
                className={`group rounded-xl border p-3 transition hover:-translate-y-0.5 ${isPrimary ? "border-cyan-300/18 bg-cyan-300/[0.07] hover:border-cyan-300/30" : "border-white/[0.08] bg-black/20 hover:border-white/[0.14] hover:bg-white/[0.04]"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`grid size-9 shrink-0 place-items-center rounded-xl ring-1 ${isPrimary ? "bg-cyan-300/[0.12] text-cyan-100 ring-cyan-300/25" : "bg-white/[0.05] text-cyan-200 ring-white/10"}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-1 inline-flex items-center rounded-full border border-white/10 bg-white/[0.035] px-2 py-0.5 text-[0.56rem] font-semibold uppercase tracking-[0.12em] text-white/42">
                        {getActionLabel(index, t)}
                      </div>
                      <div className="truncate text-sm font-semibold tracking-tight text-white">{insight.title}</div>
                      <div className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-muted-foreground">{insight.description}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate(targetPath)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition ${isPrimary ? "bg-gradient-brand text-primary-foreground shadow-[0_10px_24px_rgba(34,211,238,0.14)]" : "border border-white/10 bg-white/[0.04] text-white/75 hover:bg-cyan-300/[0.08]"}`}
                  >
                    {actionLabel}
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

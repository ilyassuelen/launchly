import {
  ArrowRight,
  Brain,
  Github,
  Linkedin,
  Mic,
  Sparkles,
  Target,
  Eye,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";

import type { DashboardInsight } from "@/features/dashboard/types/dashboard";

type AICoachFeedProps = {
  insights: DashboardInsight[];
  onNavigate: (path: string) => void;
  generatedAt?: string | null;
};

function getIcon(type?: string) {
  const key = (type || "").toLowerCase();
  if (key.includes("linkedin")) return Linkedin;
  if (key.includes("portfolio")) return Github;
  if (key.includes("recruiter")) return Eye;
  if (key.includes("interview")) return Mic;
  if (key.includes("resume")) return Target;
  return Brain;
}

function formatDate(value: string | null | undefined, language: "english" | "german", t: (key: string) => string) {
  if (!value) return t("dashboard.generatedRunReview");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return t("dashboard.generatedLatestReview");
  return new Intl.DateTimeFormat(language === "german" ? "de" : "en", { month: "short", day: "numeric" }).format(date);
}

export function AICoachFeed({ insights, onNavigate, generatedAt }: AICoachFeedProps) {
  const { language, t } = useI18n();

  return (
    <Card className="relative overflow-hidden border-white/[0.08] bg-[radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.10),transparent_34%),rgba(255,255,255,0.028)]">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />

      <div className="relative mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-cyan-100/60">
            <Sparkles className="size-3.5" />
            {t("dashboard.aiCoach")}
          </div>
          <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-white">
            {t("dashboard.personalizedCareerIntelligence")}
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[10px] text-muted-foreground">
          {formatDate(generatedAt, language, t)}
        </span>
      </div>

      <ul className="relative space-y-2">
        {insights.length === 0 && (
          <li className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-4 text-sm text-white/50">
            {t("dashboard.aiCoachFeedEmpty")}
          </li>
        )}

        {insights.slice(0, 4).map((insight, index) => {
          const Icon = getIcon(insight.type);
          return (
            <li key={`${insight.title}-${index}`} className="group/item flex items-center justify-between rounded-xl border border-white/[0.08] bg-black/20 p-3 transition hover:border-white/[0.14] hover:bg-white/[0.04]">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/[0.05] ring-1 ring-white/10">
                  <Icon className="size-3.5 text-[oklch(0.85_0.14_250)]" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-white">{insight.title}</div>
                  <div className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-muted-foreground">{insight.description}</div>
                </div>
              </div>

              <button type="button" onClick={() => onNavigate(insight.target_path || "/dashboard")} className="ml-3 inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.08]">
                {insight.action_label || t("dashboard.open")}
                <ArrowRight className="size-3" />
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

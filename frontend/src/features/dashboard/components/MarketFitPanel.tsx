import {
  ArrowUpRight,
  Briefcase,
  Eye,
  Radar,
  Sparkles,
  Target,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";

import type { DashboardMarketFit } from "@/features/dashboard/types/dashboard";

type MarketFitPanelProps = {
  marketFit?: DashboardMarketFit | null;
};

function clampScore(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getScoreLabel(score: number, t: (key: string) => string) {
  if (score >= 85) return t("dashboard.marketExcellentMatch");
  if (score >= 75) return t("dashboard.marketStrongMatch");
  if (score >= 60) return t("dashboard.marketGoodPotential");
  if (score > 0) return t("dashboard.marketNeedsPositioning");
  return t("dashboard.marketAwaitingSignal");
}

export function MarketFitPanel({ marketFit }: MarketFitPanelProps) {
  const { t } = useI18n();
  const score = clampScore(marketFit?.score);
  const recruiterConfidence = clampScore(marketFit?.recruiter_confidence);
  const positioning = clampScore(marketFit?.positioning);
  const portfolioMatch = clampScore(marketFit?.portfolio_match);
  const skills = clampScore(marketFit?.skills);

  return (
    <Card className="relative overflow-hidden border-cyan-300/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.96),rgba(8,13,24,0.98)_52%,rgba(18,32,58,0.72))] p-0 shadow-[0_22px_70px_rgba(6,182,212,0.06)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(34,211,238,0.13),transparent_34%),radial-gradient(circle_at_0%_100%,rgba(139,92,246,0.09),transparent_36%)]" />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />

      <div className="relative p-4 md:p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/12 bg-cyan-300/[0.06] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-cyan-100/70">
              <Radar className="size-3.5" />
              {t("dashboard.marketIntelligence")}
            </div>

            <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">
              {t("dashboard.marketFitAnalysisTitle")}
            </h2>
          </div>

          <div className="shrink-0 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.055] px-3.5 py-2 text-center">
            <div className="text-xl font-semibold leading-none text-white">
              {score}
            </div>
            <div className="mt-1 text-[0.58rem] uppercase tracking-[0.14em] text-cyan-100/55">
              {t("dashboard.fitScore")}
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[148px_minmax(0,1fr)]">
          <div className="relative overflow-hidden rounded-[1.35rem] border border-cyan-300/12 bg-black/24 p-4 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_58%)]" />

            <div className="relative mx-auto grid size-24 place-items-center rounded-full border border-cyan-300/15 bg-white/[0.045]">
              <div className="absolute inset-3 rounded-full border border-white/10" />
              <div className="relative text-center">
                <div className="text-3xl font-semibold tracking-tight text-white">
                  {score}
                </div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-cyan-100/65">
                  /100
                </div>
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-brand shadow-[0_0_18px_rgba(34,211,238,0.28)]"
                style={{ width: `${score}%` }}
              />
            </div>

            <div className="mt-3 rounded-full border border-emerald-300/12 bg-emerald-400/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-100">
              {getScoreLabel(score, t)}
            </div>
          </div>

          <div className="min-w-0 space-y-3">
            <div className="rounded-[1.2rem] border border-white/[0.08] bg-black/22 p-3">
              <div className="mb-2 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-white/40">
                <Target className="size-3.5 text-cyan-200/80" />
                {t("dashboard.careerGoal")}
              </div>

              <div className="line-clamp-2 text-sm font-semibold leading-5 text-cyan-100">
                {marketFit?.best_role_match || t("dashboard.notEnoughData")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <MetricCard icon={Eye} label={t("dashboard.recruiterConfidence")} value={recruiterConfidence} />
              <MetricCard icon={Sparkles} label={t("dashboard.positioning")} value={positioning} />
              <MetricCard icon={Briefcase} label={t("dashboard.portfolioMatch")} value={portfolioMatch} />
              <MetricCard icon={ArrowUpRight} label={t("dashboard.skills")} value={skills} />
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <InfoCard label={t("dashboard.demand")} value={marketFit?.demand || t("dashboard.unknown")} />
          <InfoCard label={t("dashboard.visibility")} value={marketFit?.visibility || t("dashboard.unknown")} />
          <InfoCard label={t("dashboard.readiness")} value={marketFit?.hiring_readiness || t("dashboard.pending")} />
        </div>
      </div>
    </Card>
  );
}

type MetricCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
};

function MetricCard({ icon: Icon, label, value }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2.5">
      <div className="flex min-w-0 items-center gap-1.5 text-[10px] leading-4 text-muted-foreground">
        <Icon className="size-3 shrink-0 text-cyan-200/75" />
        <span className="min-w-0 truncate">{label}</span>
      </div>
      <div className="mt-1.5 text-base font-semibold leading-none tracking-tight text-white">
        {value}%
      </div>
    </div>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="flex min-h-[50px] min-w-0 flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-black/20 px-2 py-2 text-center">
      <div className="max-w-full text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 max-w-full truncate text-xs font-semibold leading-none text-white">
        {value}
      </div>
    </div>
  );
}

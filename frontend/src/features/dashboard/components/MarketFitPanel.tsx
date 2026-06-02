import {
  ArrowUpRight,
  Briefcase,
  Eye,
  Radar,
  Sparkles,
  Target,
} from "lucide-react";

import {
  Card,
} from "@/components/launchly/AppShell";

import { useI18n } from "@/i18n/I18nContext";

import type {
  DashboardMarketFit,
} from "@/features/dashboard/types/dashboard";

type MarketFitPanelProps = {
  marketFit?: DashboardMarketFit | null;
};

function clampScore(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

export function MarketFitPanel({
  marketFit,
}: MarketFitPanelProps) {
  const { t } = useI18n();
  const score = clampScore(marketFit?.score);
  const recruiterConfidence = clampScore(marketFit?.recruiter_confidence);
  const positioning = clampScore(marketFit?.positioning);
  const portfolioMatch = clampScore(marketFit?.portfolio_match);
  const skills = clampScore(marketFit?.skills);

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Radar className="size-4 text-cyan-300" />
            {t("dashboard.marketFitAnalysisTitle")}
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            {t("dashboard.marketFitAnalysisDescription")}
          </div>
        </div>

        <div className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
          {marketFit?.label || t("dashboard.pending")}
        </div>
      </div>

      <div className="relative mt-6 flex items-center gap-6">
        <div className="relative flex size-36 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <div className="absolute inset-3 rounded-full border border-cyan-300/15" />

          <div className="text-center">
            <div className="text-4xl font-semibold text-white">
              {score}
            </div>

            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">
              {t("dashboard.fitScore")}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="inline-flex min-w-0 items-center gap-1 text-muted-foreground">
                <Target className="size-3 shrink-0" />
                <span className="leading-4">{t("dashboard.careerGoal")}</span>
              </span>

              <span className="max-w-[120px] text-right font-semibold leading-4 text-cyan-200">
                {marketFit?.best_role_match || t("dashboard.notEnoughData")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <MetricCard
              icon={Eye}
              label={t("dashboard.recruiterConfidence")}
              value={recruiterConfidence}
            />

            <MetricCard
              icon={Sparkles}
              label={t("dashboard.positioning")}
              value={positioning}
            />

            <MetricCard
              icon={Briefcase}
              label={t("dashboard.portfolioMatch")}
              value={portfolioMatch}
            />

            <MetricCard
              icon={ArrowUpRight}
              label={t("dashboard.skills")}
              value={skills}
            />
          </div>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-3">
        <InfoCard
          label={t("dashboard.demand")}
          value={marketFit?.demand || t("dashboard.unknown")}
        />

        <InfoCard
          label={t("dashboard.visibility")}
          value={marketFit?.visibility || t("dashboard.unknown")}
        />

        <InfoCard
          label={t("dashboard.readiness")}
          value={marketFit?.hiring_readiness || t("dashboard.pending")}
        />
      </div>
    </Card>
  );
}

type MetricCardProps = {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: number;
};

function MetricCard({
  icon: Icon,
  label,
  value,
}: MetricCardProps) {
  return (
    <div className="flex min-h-[96px] min-w-0 flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] px-2.5 py-3 text-center">
      <div className="flex max-w-full flex-col items-center gap-1 text-[11px] leading-4 text-muted-foreground">
        <Icon className="size-3 shrink-0" />

        <span className="max-w-[92px] whitespace-normal break-words leading-4">
          {label}
        </span>
      </div>

      <div className="mt-3 text-[1.65rem] font-semibold leading-none tracking-tight text-white/85">
        {value}%
      </div>
    </div>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({
  label,
  value,
}: InfoCardProps) {
  return (
    <div className="flex min-h-[72px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center">
      <div className="text-[11px] leading-4 text-muted-foreground">
        {label}
      </div>

      <div className="mt-1.5 text-sm font-semibold leading-none text-white/85">
        {value}
      </div>
    </div>
  );
}

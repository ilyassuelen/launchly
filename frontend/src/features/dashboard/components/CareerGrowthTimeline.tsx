import { ArrowUpRight, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";

import type { CareerGrowthPoint } from "@/features/dashboard/types/dashboard";

type CareerGrowthTimelineProps = {
  growth: CareerGrowthPoint[];
};

function clampScore(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function CareerGrowthTimeline({ growth }: CareerGrowthTimelineProps) {
  const { t } = useI18n();
  const chartData = growth.length > 0
    ? growth.map((item) => ({ d: item.d, v: clampScore(item.v) }))
    : [
        { d: t("dashboard.dayMon"), v: 0 },
        { d: t("dashboard.dayTue"), v: 0 },
        { d: t("dashboard.dayWed"), v: 0 },
        { d: t("dashboard.dayThu"), v: 0 },
        { d: t("dashboard.dayFri"), v: 0 },
        { d: t("dashboard.daySat"), v: 0 },
        { d: t("dashboard.daySun"), v: 0 },
      ];

  const firstValue = chartData[0]?.v || 0;
  const lastValue = chartData[chartData.length - 1]?.v || 0;
  const delta = lastValue - firstValue;

  return (
    <Card className="relative overflow-hidden border-white/[0.08] bg-[radial-gradient(circle_at_0%_0%,rgba(124,92,255,0.12),transparent_34%),rgba(255,255,255,0.028)] p-0">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/25 to-transparent" />
      <div className="relative p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-violet-100/60">
              <TrendingUp className="size-3.5" />
              {t("dashboard.growthTrajectory")}
            </div>
            <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-white">{t("dashboard.careerGrowthTimelineTitle")}</h2>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-right">
            <div className={`flex items-center justify-end gap-1 text-lg font-semibold ${delta >= 0 ? "text-emerald-300" : "text-red-200"}`}>
              {delta >= 0 && <ArrowUpRight className="size-4" />}
              {delta >= 0 ? "+" : ""}{delta}
            </div>
            <div className="text-[0.6rem] uppercase tracking-[0.14em] text-white/35">
              {t("dashboard.growth")}
            </div>
          </div>
        </div>

        <div className="mb-3 grid grid-cols-3 gap-2">
          <Metric label={t("dashboard.start")} value={firstValue} />
          <Metric label={t("dashboard.current")} value={lastValue} />
          <Metric
            label={t("dashboard.trend")}
            value={delta >= 0 ? t("dashboard.trendUp") : t("dashboard.trendDown")}
          />
        </div>

        <div className="relative h-56 overflow-hidden rounded-xl border border-white/[0.08] bg-black/20 p-3">
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ left: -24, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="careerGrowthGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.20 295)" stopOpacity="0.62" />
                  <stop offset="100%" stopColor="oklch(0.72 0.20 295)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.045)" />
              <XAxis dataKey="d" tick={{ fill: "oklch(0.7 0.03 270)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "oklch(0.7 0.03 270)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.2 0.025 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} labelStyle={{ color: "white" }} />
              <Area type="monotone" dataKey="v" stroke="oklch(0.85 0.14 250)" strokeWidth={3} fill="url(#careerGrowthGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2">
      <div className="text-[0.6rem] uppercase tracking-[0.14em] text-white/35">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

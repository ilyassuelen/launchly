import {
  TrendingUp,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
} from "@/components/launchly/AppShell";

import type {
  CareerGrowthPoint,
} from "@/features/dashboard/types/dashboard";

type CareerGrowthTimelineProps = {
  growth: CareerGrowthPoint[];
};

function clampScore(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

export function CareerGrowthTimeline({
  growth,
}: CareerGrowthTimelineProps) {
  const chartData =
    growth.length > 0
      ? growth.map((item) => ({
          d: item.d,
          v: clampScore(item.v),
        }))
      : [
          { d: "Mon", v: 0 },
          { d: "Tue", v: 0 },
          { d: "Wed", v: 0 },
          { d: "Thu", v: 0 },
          { d: "Fri", v: 0 },
          { d: "Sat", v: 0 },
          { d: "Sun", v: 0 },
        ];

  const firstValue = chartData[0]?.v || 0;
  const lastValue =
    chartData[chartData.length - 1]?.v || 0;

  const delta = lastValue - firstValue;

  return (
    <Card className="group relative overflow-hidden lg:col-span-2">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_30%)] opacity-80 transition duration-500 group-hover:opacity-100" />

      <div className="relative mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="size-4 text-violet-300" />
            Career growth timeline
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            Last 7 saved dashboard reviews · all signals combined
          </div>
        </div>

        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            delta >= 0
              ? "bg-[oklch(0.78_0.17_155)]/15 text-[oklch(0.78_0.17_155)]"
              : "bg-red-400/10 text-red-200"
          }`}
        >
          {delta >= 0 ? "+" : ""}
          {delta}
        </span>
      </div>

      <div className="relative h-72 overflow-hidden rounded-2xl border border-white/5 bg-black/10 p-2">
        <ResponsiveContainer>
          <AreaChart
            data={chartData}
            margin={{
              left: -20,
              right: 10,
              top: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="careerGrowthGradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="oklch(0.72 0.20 295)"
                  stopOpacity="0.6"
                />
                <stop
                  offset="100%"
                  stopColor="oklch(0.72 0.20 295)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(1 0 0 / 0.06)"
            />

            <XAxis
              dataKey="d"
              tick={{
                fill: "oklch(0.7 0.03 270)",
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[0, 100]}
              tick={{
                fill: "oklch(0.7 0.03 270)",
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "oklch(0.2 0.025 270)",
                border: "1px solid oklch(1 0 0 / 0.1)",
                borderRadius: 12,
              }}
              labelStyle={{
                color: "white",
              }}
            />

            <Area
              type="monotone"
              dataKey="v"
              stroke="oklch(0.85 0.14 250)"
              strokeWidth={3}
              fill="url(#careerGrowthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

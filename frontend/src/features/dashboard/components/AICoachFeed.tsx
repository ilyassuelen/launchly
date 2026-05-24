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

import {
  Card,
} from "@/components/launchly/AppShell";

import type {
  DashboardInsight,
} from "@/features/dashboard/types/dashboard";

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

function formatDate(value?: string | null) {
  if (!value) {
    return "run review to generate";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "latest review";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function AICoachFeed({
  insights,
  onNavigate,
  generatedAt,
}: AICoachFeedProps) {
  return (
    <Card className="group relative overflow-hidden lg:col-span-2">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_30%)] opacity-80" />

      <div className="relative mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-cyan-300" />
          AI coach feed
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
          <Sparkles className="size-3" />
          generated {formatDate(generatedAt)}
        </span>
      </div>

      <ul className="relative divide-y divide-white/5">
        {insights.length === 0 && (
          <li className="rounded-2xl px-2 py-5 text-sm text-white/50">
            Run an AI review to generate personalized career insights.
          </li>
        )}

        {insights.map((insight, index) => {
          const Icon = getIcon(insight.type);

          return (
            <li
              key={`${insight.title}-${index}`}
              className="group/item flex items-center justify-between rounded-2xl px-2 py-3 transition hover:bg-white/[0.03]"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid size-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 transition group-hover/item:scale-105 group-hover/item:bg-white/10">
                  <Icon className="size-4 text-[oklch(0.85_0.14_250)]" />
                </div>

                <div>
                  <div className="text-sm font-medium text-white/90">
                    {insight.title}
                  </div>

                  <div className="mt-1 text-xs leading-5 text-muted-foreground">
                    {insight.description}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onNavigate(
                    insight.target_path || "/dashboard",
                  )
                }
                className="ml-4 inline-flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                {insight.action_label || "Open"}
                <ArrowRight className="size-3" />
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

import {
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  Progress,
} from "@/components/launchly/AppShell";

type WeakestLinkCardProps = {
  profileStrength: Record<string, number>;
  onOpen?: (path: string) => void;
};

const AREAS = [
  {
    key: "Resume",
    label: "Resume",
    path: "/resumes",
    action: "Improve resume",
  },
  {
    key: "Recruiter View",
    label: "Recruiter View",
    path: "/recruiter-view",
    action: "Review scan",
  },
  {
    key: "LinkedIn",
    label: "LinkedIn",
    path: "/linkedin",
    action: "Optimize profile",
  },
  {
    key: "Portfolio",
    label: "Portfolio",
    path: "/portfolio",
    action: "Strengthen portfolio",
  },
  {
    key: "Applications",
    label: "Applications",
    path: "/applications",
    action: "Build pipeline",
  },
];

function clampScore(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function getMessage(score: number, label: string) {
  if (score === 0) {
    return `${label} has no saved signal yet. Run or save an analysis there first.`;
  }

  if (score < 60) {
    return `${label} is currently the weakest career signal and should be fixed first.`;
  }

  if (score < 75) {
    return `${label} is improving, but still limits your overall career readiness.`;
  }

  return `${label} is the lowest area, but it is already in a healthy range.`;
}

export function WeakestLinkCard({
  profileStrength,
  onOpen,
}: WeakestLinkCardProps) {
  const weakestArea = AREAS
    .map((area) => ({
      ...area,
      score: clampScore(profileStrength?.[area.key]),
    }))
    .sort((a, b) => a.score - b.score)[0];

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <AlertTriangle className="size-4 text-orange-300" />
          Weakest link
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          The one area most likely holding your profile back.
        </div>

        <div className="mt-5 rounded-2xl border border-orange-400/10 bg-orange-400/[0.05] p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-orange-200/70">
            Focus area
          </div>

          <div className="mt-2 text-2xl font-semibold text-white">
            {weakestArea.label}
          </div>

          <div className="mt-3">
            <Progress
              label="Current strength"
              value={weakestArea.score}
              color={weakestArea.score < 70 ? "pink" : undefined}
            />
          </div>

          <div className="mt-4 text-sm leading-6 text-white/65">
            {getMessage(
              weakestArea.score,
              weakestArea.label,
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpen?.(weakestArea.path)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-orange-300/25 hover:bg-orange-400/[0.08]"
        >
          {weakestArea.action}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </Card>
  );
}

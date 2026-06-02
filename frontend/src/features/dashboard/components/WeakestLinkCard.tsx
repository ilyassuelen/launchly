import {
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  Progress,
} from "@/components/launchly/AppShell";

import { useI18n } from "@/i18n/I18nContext";

type WeakestLinkCardProps = {
  profileStrength: Record<string, number>;
  onOpen?: (path: string) => void;
};

const AREAS = [
  {
    key: "Resume",
    labelKey: "dashboard.resume",
    path: "/resumes",
    actionKey: "dashboard.improveResume",
  },
  {
    key: "Recruiter View",
    labelKey: "dashboard.recruiterView",
    path: "/recruiter-view",
    actionKey: "dashboard.reviewScan",
  },
  {
    key: "LinkedIn",
    labelKey: "dashboard.linkedIn",
    path: "/linkedin",
    actionKey: "dashboard.optimizeProfile",
  },
  {
    key: "Portfolio",
    labelKey: "dashboard.portfolio",
    path: "/portfolio",
    actionKey: "dashboard.strengthenPortfolio",
  },
  {
    key: "Applications",
    labelKey: "dashboard.applications",
    path: "/applications",
    actionKey: "dashboard.buildPipeline",
  },
];

function clampScore(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function getMessage(
  score: number,
  label: string,
  t: (key: string, params?: Record<string, string | number>) => string,
) {
  if (score === 0) {
    return t("dashboard.noSavedSignal", { label });
  }
  if (score < 60) {
    return t("dashboard.weakestSignal", { label });
  }
  if (score < 75) {
    return t("dashboard.improvingButLimits", { label });
  }
  return t("dashboard.healthyLowestArea", { label });
}

export function WeakestLinkCard({
  profileStrength,
  onOpen,
}: WeakestLinkCardProps) {
  const { t } = useI18n();
  const weakestArea = AREAS
    .map((area) => ({
      ...area,
      label: t(area.labelKey),
      action: t(area.actionKey),
      score: clampScore(profileStrength?.[area.key]),
    }))
    .sort((a, b) => a.score - b.score)[0];

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <AlertTriangle className="size-4 text-orange-300" />
          {t("dashboard.weakestLinkTitle")}
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          {t("dashboard.weakestLinkDescription")}
        </div>

        <div className="mt-5 rounded-2xl border border-orange-400/10 bg-orange-400/[0.05] p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-orange-200/70">
            {t("dashboard.focusArea")}
          </div>

          <div className="mt-2 text-2xl font-semibold text-white">
            {weakestArea.label}
          </div>

          <div className="mt-3">
            <Progress
              label={t("dashboard.currentStrength")}
              value={weakestArea.score}
              color={weakestArea.score < 70 ? "pink" : undefined}
            />
          </div>

          <div className="mt-4 text-sm leading-6 text-white/65">
            {getMessage(
              weakestArea.score,
              weakestArea.label,
              t,
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

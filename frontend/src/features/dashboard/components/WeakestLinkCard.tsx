import { ArrowRight, ShieldAlert } from "lucide-react";

import { Card, Progress } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";

type WeakestLinkCardProps = {
  profileStrength: Record<string, number>;
  onOpen?: (path: string) => void;
};

const AREAS = [
  { key: "Resume", labelKey: "dashboard.resume", path: "/resumes", actionKey: "dashboard.improveResume" },
  { key: "Recruiter View", labelKey: "dashboard.recruiterView", path: "/recruiter-view", actionKey: "dashboard.reviewScan" },
  { key: "LinkedIn", labelKey: "dashboard.linkedIn", path: "/linkedin", actionKey: "dashboard.optimizeProfile" },
  { key: "Portfolio", labelKey: "dashboard.portfolio", path: "/portfolio", actionKey: "dashboard.strengthenPortfolio" },
  { key: "Applications", labelKey: "dashboard.applications", path: "/applications", actionKey: "dashboard.buildPipeline" },
];

function clampScore(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getMessage(score: number, label: string, t: (key: string, params?: Record<string, string | number>) => string) {
  if (score === 0) return t("dashboard.noSavedSignal", { label });
  if (score < 60) return t("dashboard.weakestSignal", { label });
  if (score < 75) return t("dashboard.improvingButLimits", { label });
  return t("dashboard.healthyLowestArea", { label });
}

export function WeakestLinkCard({ profileStrength, onOpen }: WeakestLinkCardProps) {
  const { t } = useI18n();
  const weakestArea = AREAS
    .map((area) => ({ ...area, label: t(area.labelKey), action: t(area.actionKey), score: clampScore(profileStrength?.[area.key]) }))
    .sort((a, b) => a.score - b.score)[0];

  return (
    <Card className="relative overflow-hidden border-orange-300/12 bg-[linear-gradient(145deg,rgba(17,24,39,0.96),rgba(8,13,24,0.98)_52%,rgba(48,24,12,0.40))] p-0 shadow-[0_22px_70px_rgba(251,146,60,0.06)]">

      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/25 to-transparent" />
      <div className="relative flex h-full flex-col p-4 md:p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/12 bg-orange-300/[0.06] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-orange-100/70">
              <ShieldAlert className="size-3.5" />
              {t("dashboard.focusArea")}
            </div>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">
              {t("dashboard.weakestLinkTitle")}
            </h2>
          </div>

          <div className="shrink-0 rounded-2xl border border-orange-300/12 bg-orange-300/[0.055] px-3.5 py-2 text-center">
            <div className="text-xl font-semibold leading-none text-white">
              {weakestArea.score}%
            </div>
            <div className="mt-1 text-[0.58rem] uppercase tracking-[0.14em] text-orange-100/55">
              {t("dashboard.strength")}
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-[1.35rem] border border-orange-300/12 bg-black/24 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/38">
                {t("dashboard.weakestSignalLabel")}
              </div>
              <div className="mt-1 text-xl font-semibold tracking-tight text-white">
                {weakestArea.label}
              </div>
            </div>

            <div className="rounded-full border border-orange-300/12 bg-orange-300/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-orange-100/70">
              {t("dashboard.priority")}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/[0.07] bg-black/22 p-3">
            <Progress
              label={t("dashboard.currentStrength")}
              value={weakestArea.score}
              color={weakestArea.score < 70 ? "pink" : undefined}
            />
          </div>

          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3 text-xs leading-5 text-white/62">
            {getMessage(weakestArea.score, weakestArea.label, t)}
          </div>
        </div>

        <button type="button" onClick={() => onOpen?.(weakestArea.path)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-400/95 to-orange-300 px-3 py-3 text-xs font-semibold text-black shadow-[0_14px_34px_rgba(251,146,60,0.16)] transition hover:scale-[1.01]">
          {weakestArea.action}
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </Card>
  );
}

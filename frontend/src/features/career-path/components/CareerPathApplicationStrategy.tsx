import {
  ArrowRight,
  CheckCircle2,
  Compass,
  ListChecks,
  Radar,
  Send,
  Sparkles,
  Target,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";
import { useNavigate } from "@tanstack/react-router";

import type { CareerPathApplicationStrategyItem } from "../types/careerPath";

type CareerPathApplicationStrategyProps = {
  applicationStrategy: CareerPathApplicationStrategyItem[];
};

function getMoveAccent(index: number) {
  const accents = [
    {
      icon: Target,
      border: "border-cyan-300/15",
      bg: "bg-cyan-400/[0.075]",
      text: "text-cyan-100",
      glow: "shadow-[0_0_28px_rgba(34,211,238,0.12)]",
      line: "from-cyan-300 to-violet-300",
    },
    {
      icon: Radar,
      border: "border-violet-300/15",
      bg: "bg-violet-400/[0.075]",
      text: "text-violet-100",
      glow: "shadow-[0_0_28px_rgba(168,85,247,0.12)]",
      line: "from-violet-300 to-emerald-300",
    },
    {
      icon: Compass,
      border: "border-emerald-300/15",
      bg: "bg-emerald-400/[0.075]",
      text: "text-emerald-100",
      glow: "shadow-[0_0_28px_rgba(52,211,153,0.12)]",
      line: "from-emerald-300 to-cyan-300",
    },
  ];

  return accents[index % accents.length];
}

export function CareerPathApplicationStrategy({
  applicationStrategy,
}: CareerPathApplicationStrategyProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const primaryMove = applicationStrategy[0];
  const totalActions = applicationStrategy.reduce(
    (count, item) => count + item.action_items.length,
    0,
  );

  const featuredActions = applicationStrategy
    .flatMap((item) => item.action_items)
    .slice(0, 5);

  return (
    <Card className="relative overflow-hidden border-cyan-300/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.94),rgba(8,13,24,0.98)_52%,rgba(18,32,58,0.66))] shadow-[0_24px_80px_rgba(34,211,238,0.05)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.11),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_38%)]" />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent" />

      <div className="relative">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/10 bg-cyan-400/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/70">
              <Send className="size-3.5 text-cyan-300" />
              {t("careerPath.applicationCommandCenter")}
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
              {t("careerPath.applicationStrategyTitle")}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
              {t("careerPath.applicationStrategyDescription")}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[460px]">
            <div className="rounded-2xl border border-white/7 bg-black/20 px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                {t("careerPath.moves")}
              </div>

              <div className="mt-1 text-xl font-semibold text-white">
                {applicationStrategy.length}
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-300/10 bg-cyan-400/[0.045] px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100/55">
                {t("careerPath.actions")}
              </div>

              <div className="mt-1 text-xl font-semibold text-cyan-100">
                {totalActions}
              </div>
            </div>


          </div>
        </div>

        {applicationStrategy.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">
            {t("careerPath.noApplicationStrategy")}
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/7 bg-black/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(34,211,238,0.10),transparent_34%),radial-gradient(circle_at_88%_90%,rgba(168,85,247,0.10),transparent_36%)]" />

              <div className="relative">
                <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                      {t("careerPath.launchFlow")}
                    </div>

                    <div className="mt-1 text-sm text-white/55">
                      {t("careerPath.launchFlowDescription")}
                    </div>
                  </div>

                  <div className="rounded-full border border-cyan-300/10 bg-cyan-400/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100/65">
                    {t("careerPath.evidenceFirst")}
                  </div>
                </div>

                <div className="space-y-3">
                  {applicationStrategy.map((strategy, index) => {
                    const accent = getMoveAccent(index);
                    const Icon = accent.icon;

                    return (
                      <div
                        key={`${strategy.title}-${index}`}
                        className="group relative overflow-hidden rounded-[1.5rem] border border-white/7 bg-white/[0.025] p-4 transition duration-300 hover:border-cyan-300/20 hover:bg-white/[0.045]"
                      >
                        <div className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-transparent transition group-hover:bg-cyan-300/35" />

                        <div className="relative flex flex-col gap-4 md:flex-row md:items-start">
                          <div className={`grid size-12 shrink-0 place-items-center rounded-2xl border ${accent.border} ${accent.bg} ${accent.text} ${accent.glow}`}>
                            <Icon className="size-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                                {t("careerPath.moveNumber", {
                                  number: String(index + 1).padStart(2, "0"),
                                })}
                              </span>

                              <span className={`rounded-full border ${accent.border} ${accent.bg} px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${accent.text}`}>
                                {t("careerPath.recruiterFacing")}
                              </span>
                            </div>

                            <h3 className="text-base font-semibold tracking-tight text-white/92">
                              {strategy.title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-white/52">
                              {strategy.description}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/5 bg-black/20 px-3 py-2 text-xs text-white/45 md:w-32 md:text-right">
                            {t("careerPath.actionsCount", {
                              count: strategy.action_items.length,
                            })}
                          </div>
                        </div>

                        <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${accent.line}`}
                            style={{ width: `${Math.min(100, 45 + index * 22)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/7 bg-black/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_36%)]" />

              <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-3 border-b border-white/5 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <ListChecks className="size-4 text-cyan-300" />
                      {t("careerPath.executionChecklist")}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-white/45">
                      {t("careerPath.executionChecklistDescription")}
                    </p>
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/45">
                    {t("careerPath.shownCount", {
                      count: featuredActions.length,
                    })}
                  </div>
                </div>

                {featuredActions.length > 0 ? (
                  <ul className="space-y-2.5">
                    {featuredActions.map((action, index) => (
                      <li
                        key={`${action}-${index}`}
                        className="rounded-2xl border border-cyan-300/10 bg-cyan-400/[0.045] px-4 py-3 text-sm leading-6 text-white/65"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="mt-1 size-3.5 shrink-0 text-cyan-300" />

                          <span>{t("careerPath.noActionItems") === action ? action : action}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4 text-sm text-white/45">
                    {t("careerPath.noActionItems")}
                  </div>
                )}

                <div className="mt-5 rounded-2xl border border-violet-300/10 bg-violet-400/[0.045] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-100/55">
                    <Sparkles className="size-3.5" />
                    {t("careerPath.launchPrinciple")}
                  </div>

                  <p className="text-sm leading-7 text-white/58">
                    {t("careerPath.launchPrincipleDescription")}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/applications" })}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/10 bg-cyan-400/[0.055] px-3 py-1.5 text-xs text-cyan-50/75 transition hover:border-cyan-300/25 hover:bg-cyan-400/[0.10] hover:text-cyan-50"
                  >
                    {t("careerPath.openApplicationTracker")}
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
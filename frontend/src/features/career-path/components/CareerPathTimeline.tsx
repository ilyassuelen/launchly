import { useMemo, useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Flag,
  Route,
  Sparkles,
  Target,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";

import type { CareerPathMilestone } from "../types/careerPath";

type CareerPathTimelineProps = {
  roadmap: CareerPathMilestone[];
};

function getPriorityClassName(priority?: string) {
  const normalized = priority?.toLowerCase();

  if (normalized === "high") {
    return "border-orange-400/15 bg-orange-400/[0.08] text-orange-200";
  }

  if (normalized === "medium") {
    return "border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-200";
  }

  return "border-white/10 bg-white/[0.04] text-white/55";
}

export function CareerPathTimeline({ roadmap }: CareerPathTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeMilestone = roadmap[activeIndex] ?? roadmap[0] ?? null;

  const progressWidth = useMemo(() => {
    if (roadmap.length <= 1) {
      return "0%";
    }

    return `${(activeIndex / (roadmap.length - 1)) * 100}%`;
  }, [activeIndex, roadmap.length]);

  return (
    <Card className="relative overflow-hidden border-cyan-300/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.96),rgba(8,13,24,0.98)_52%,rgba(24,18,54,0.78))] shadow-[0_24px_80px_rgba(6,182,212,0.08)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.10),transparent_38%)]" />

      <div className="relative">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/10 bg-cyan-300/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/70">
              <Route className="size-3.5 text-cyan-300" />
              Career roadmap
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
              Your strategic path toward the target role
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
              A cleaner journey view: follow the roadmap step by step, then open each milestone for the concrete tasks.
            </p>
          </div>


        </div>

        {roadmap.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">
            No roadmap milestones available yet.
          </div>
        ) : (
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/7 bg-black/20 p-5 lg:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.08),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.10),transparent_34%)]" />

              <div className="relative">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                      Journey map
                    </div>

                    <div className="mt-1 text-sm text-white/55">
                      Click a step to inspect the milestone.
                    </div>
                  </div>

                  <div className="hidden rounded-full border border-cyan-300/10 bg-cyan-400/[0.07] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100/65 sm:block">
                    Step {activeIndex + 1} active
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/5 bg-white/[0.025] p-5">
                  <div className="absolute left-8 right-8 top-[3.35rem] hidden h-2 rounded-full bg-white/[0.06] md:block" />
                  <div
                    className="absolute left-8 top-[3.35rem] hidden h-2 rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-emerald-300 shadow-[0_0_28px_rgba(34,211,238,0.22)] transition-all duration-500 md:block"
                    style={{ width: `calc((100% - 4rem) * ${activeIndex / Math.max(roadmap.length - 1, 1)})` }}
                  />

                  <div className="grid gap-3 md:grid-cols-[repeat(var(--roadmap-count),minmax(0,1fr))]" style={{ "--roadmap-count": roadmap.length } as React.CSSProperties}>
                    {roadmap.map((milestone, index) => {
                      const isActive = index === activeIndex;
                      const isCompleted = index < activeIndex;
                      const isFinal = index === roadmap.length - 1;

                      return (
                        <button
                          key={`${milestone.title}-${index}`}
                          type="button"
                          onClick={() => setActiveIndex(index)}
                          className={`group relative rounded-2xl border p-4 text-left transition duration-300 ${
                            isActive
                              ? "border-cyan-300/25 bg-cyan-400/[0.075] shadow-[0_0_34px_rgba(34,211,238,0.12)]"
                              : "border-white/5 bg-black/15 hover:border-white/10 hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex flex-col items-center text-center">
                            <div
                              className={`relative z-10 grid size-12 place-items-center rounded-full border transition ${
                                isActive
                                  ? "border-cyan-300/30 bg-cyan-400/[0.16] text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.30)]"
                                  : isCompleted
                                    ? "border-emerald-300/25 bg-emerald-400/[0.12] text-emerald-100"
                                    : "border-white/10 bg-white/[0.04] text-white/35"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="size-5" />
                              ) : isFinal ? (
                                <Flag className="size-5" />
                              ) : isActive ? (
                                <Sparkles className="size-5" />
                              ) : (
                                <CircleDot className="size-5" />
                              )}
                            </div>

                            <div className="mt-4 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                              Step {index + 1}
                            </div>

                            <div className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-white/85">
                              {milestone.title}
                            </div>

                            <div className="mt-2 text-xs text-white/38">
                              {milestone.timeframe}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {activeMilestone && (
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="rounded-[2rem] border border-white/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.022))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.20)]">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <div className="rounded-full border border-cyan-300/10 bg-cyan-300/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100/75">
                      Selected milestone
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                      {activeMilestone.timeframe}
                    </div>

                    <div className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getPriorityClassName(activeMilestone.priority)}`}>
                      {activeMilestone.priority}
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold tracking-tight text-white">
                    {activeMilestone.title}
                  </h3>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58">
                    {activeMilestone.description}
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/7 bg-black/20 p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                    <ArrowRight className="size-4 text-cyan-300" />
                    Action checklist
                  </div>

                  {activeMilestone.tasks.length > 0 ? (
                    <div className="space-y-2">
                      {activeMilestone.tasks.map((task, taskIndex) => (
                        <div
                          key={`${task}-${taskIndex}`}
                          className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/65"
                        >
                          <div className="flex gap-3">
                            <div className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-300" />
                            <span>{task}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-white/45">
                      No tasks listed for this milestone.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
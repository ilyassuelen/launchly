import {
  CheckCircle2,
  CircleDot,
  Flag,
  Route,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";

import type { CareerPathMilestone } from "../types/careerPath";

type CareerPathTimelineProps = {
  roadmap: CareerPathMilestone[];
};

export function CareerPathTimeline({ roadmap }: CareerPathTimelineProps) {
  return (
    <Card className="p-5 lg:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-white/45">
            <Route className="h-3.5 w-3.5 text-violet-300/80" />
            Roadmap
          </div>

          <h2 className="text-lg font-semibold text-white">
            Career milestones
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
            A clear sequence of focused steps toward your target role.
          </p>
        </div>

        <div className="rounded-full bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/40">
          {roadmap.length} steps
        </div>
      </div>

      {roadmap.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-white/50">
          No roadmap milestones available yet.
        </div>
      ) : (
        <div className="relative space-y-3">
          <div className="absolute bottom-5 left-4 top-5 hidden w-px bg-white/10 md:block" />

          {roadmap.map((milestone, index) => {
            const isFirst = index === 0;
            const isFinal = index === roadmap.length - 1;

            return (
              <div
                key={`${milestone.title}-${index}`}
                className="relative rounded-2xl bg-white/[0.025] p-4 transition hover:bg-white/[0.04]"
              >
                <div className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-xl bg-violet-400/[0.08] text-violet-200/80">
                      {isFinal ? (
                        <Flag className="h-4 w-4" />
                      ) : isFirst ? (
                        <CircleDot className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-white/30">
                        Step {index + 1}
                      </span>

                      <span className="rounded-full bg-white/[0.035] px-2.5 py-1 text-xs text-white/42">
                        {milestone.timeframe}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold leading-6 text-white/90">
                      {milestone.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-white/45">
                      {milestone.description}
                    </p>

                    {milestone.tasks.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {milestone.tasks.slice(0, 3).map((task, taskIndex) => (
                          <div
                            key={`${task}-${taskIndex}`}
                            className="flex gap-2 text-sm leading-6 text-white/50"
                          >
                            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-violet-300/60" />
                            <span>{task}</span>
                          </div>
                        ))}

                        {milestone.tasks.length > 3 && (
                          <div className="pt-1 text-xs text-white/30">
                            +{milestone.tasks.length - 3} more actions
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
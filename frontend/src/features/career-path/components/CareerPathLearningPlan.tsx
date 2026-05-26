import {
  BookOpen,
  Clock3,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";

import type { CareerPathLearningItem } from "../types/careerPath";

type CareerPathLearningPlanProps = {
  learningPlan: CareerPathLearningItem[];
};

function getLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function CareerPathLearningPlan({
  learningPlan,
}: CareerPathLearningPlanProps) {
  return (
    <Card className="p-5 lg:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-white/45">
            <BookOpen className="h-3.5 w-3.5 text-cyan-300/80" />
            Learning plan
          </div>

          <h2 className="text-lg font-semibold text-white">
            Focused learning steps
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
            Learn the topics that directly support your next career move.
          </p>
        </div>

        <div className="rounded-full bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/40">
          {learningPlan.length} items
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {learningPlan.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-white/50 md:col-span-2">
            No learning items available yet.
          </div>
        ) : (
          learningPlan.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="rounded-2xl bg-white/[0.025] p-4 transition hover:bg-white/[0.04]"
            >
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/[0.08] text-cyan-200/80">
                  <BookOpen className="h-3.5 w-3.5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-white/30">
                    Step {index + 1}
                  </p>

                  <h3 className="mt-1 text-sm font-semibold leading-6 text-white/90">
                    {item.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm leading-6 text-white/45">
                {item.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-cyan-400/[0.07] px-2.5 py-1 font-medium text-cyan-200/75">
                  {getLabel(item.type)}
                </span>

                <span className="rounded-full bg-white/[0.035] px-2.5 py-1 text-white/40">
                  {getLabel(item.priority)}
                </span>

                <span className="inline-flex items-center gap-1.5 text-white/35">
                  <Clock3 className="h-3.5 w-3.5 text-white/30" />
                  {item.estimated_time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
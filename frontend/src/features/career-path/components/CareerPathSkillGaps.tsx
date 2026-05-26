import {
  AlertTriangle,
  Layers3,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";

import type { CareerPathSkillGap } from "../types/careerPath";

type CareerPathSkillGapsProps = {
  skillGaps: CareerPathSkillGap[];
};

function getPriorityLabel(priority: string) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function getPriorityStrength(priority: string) {
  const normalized = priority.toLowerCase();

  if (normalized === "high") return 88;
  if (normalized === "medium") return 62;

  return 38;
}

export function CareerPathSkillGaps({
  skillGaps,
}: CareerPathSkillGapsProps) {
  const highPriorityCount = skillGaps.filter(
    (gap) => gap.priority.toLowerCase() === "high",
  ).length;

  return (
    <Card className="p-5 lg:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-white/45">
            <Layers3 className="h-3.5 w-3.5 text-amber-300/85" />
            Skill gaps
          </div>

          <h2 className="text-xl font-semibold text-white">
            What to improve next
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
            The most relevant gaps between your current profile and your target
            role.
          </p>
        </div>

        <div className="rounded-full bg-amber-400/[0.07] px-3 py-1 text-xs font-medium text-amber-100/65">
          {highPriorityCount} urgent
        </div>
      </div>

      <div className="space-y-3">
        {skillGaps.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-white/50">
            No skill gaps available yet.
          </div>
        ) : (
          skillGaps.map((gap, index) => {
            const strength = getPriorityStrength(gap.priority);

            return (
              <div
                key={`${gap.skill}-${index}`}
                className="rounded-3xl border border-white/10 bg-black/20 p-5 transition hover:border-amber-300/18 hover:bg-white/[0.03]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-400/[0.08] text-amber-200/85">
                      <AlertTriangle className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-white">
                        {gap.skill}
                      </h3>

                      <p className="mt-1 text-xs text-white/35">
                        {getPriorityLabel(gap.priority)} priority
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-white/[0.025] p-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/30">
                      Current
                    </p>
                    <p className="mt-1 text-sm font-medium text-white/70">
                      {gap.current_level}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-violet-400/[0.065] p-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-violet-200/50">
                      Target
                    </p>
                    <p className="mt-1 text-sm font-medium text-violet-100">
                      {gap.target_level}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-white/35">Focus level</span>
                    <span className="font-medium text-white/55">
                      {strength}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300"
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                </div>

                <p className="text-sm leading-6 text-white/50">
                  {gap.reason}
                </p>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
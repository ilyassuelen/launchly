import {
  Code2,
  Gauge,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";

import type { CareerPathProjectItem } from "../types/careerPath";

type CareerPathProjectsProps = {
  projectPlan: CareerPathProjectItem[];
};

function getDifficultyScore(difficulty: string) {
  const normalized = difficulty.toLowerCase();

  if (normalized === "hard") return 90;
  if (normalized === "medium") return 65;

  return 40;
}

export function CareerPathProjects({
  projectPlan,
}: CareerPathProjectsProps) {
  return (
    <Card className="p-5 lg:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-white/45">
            <Code2 className="h-3.5 w-3.5 text-emerald-300/80" />
            Portfolio projects
          </div>

          <h2 className="text-lg font-semibold text-white">
            Projects worth building
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
            Practical projects that help turn your roadmap into visible proof.
          </p>
        </div>

        <div className="rounded-full bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/40">
          {projectPlan.length} projects
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {projectPlan.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-white/50 lg:col-span-2">
            No project recommendations available yet.
          </div>
        ) : (
          projectPlan.map((project, index) => {
            const score = getDifficultyScore(project.difficulty);

            return (
              <div
                key={`${project.title}-${index}`}
                className="rounded-3xl bg-white/[0.025] p-5 transition hover:bg-white/[0.04]"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/[0.08] text-emerald-200/80">
                      <Code2 className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-white/30">
                        Portfolio build {index + 1}
                      </p>

                      <h3 className="mt-1 text-base font-semibold leading-6 text-white/95">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-6 text-white/45">
                  {project.description}
                </p>

                {project.skills_practiced.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.skills_practiced.slice(0, 4).map((skill, skillIndex) => (
                      <span
                        key={`${skill}-${skillIndex}`}
                        className="rounded-full bg-white/[0.035] px-2.5 py-1 text-xs text-white/42"
                      >
                        {skill}
                      </span>
                    ))}

                    {project.skills_practiced.length > 4 && (
                      <span className="rounded-full bg-white/[0.025] px-2.5 py-1 text-xs text-white/30">
                        +{project.skills_practiced.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-5 rounded-2xl bg-emerald-400/[0.045] p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-emerald-200/45">
                        Portfolio value
                      </p>

                      <p className="mt-1 text-sm leading-6 text-white/58">
                        {project.portfolio_value}
                      </p>
                    </div>

                    <Gauge className="h-4 w-4 shrink-0 text-emerald-200/55" />
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-300/80 to-cyan-300/80"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
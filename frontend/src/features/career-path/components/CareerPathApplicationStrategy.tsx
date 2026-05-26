import {
  CheckCircle2,
  Send,
  Target,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";

import type { CareerPathApplicationStrategyItem } from "../types/careerPath";

type CareerPathApplicationStrategyProps = {
  applicationStrategy: CareerPathApplicationStrategyItem[];
};

export function CareerPathApplicationStrategy({
  applicationStrategy,
}: CareerPathApplicationStrategyProps) {
  return (
    <Card className="p-5 lg:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-white/45">
            <Send className="h-3.5 w-3.5 text-fuchsia-300/80" />
            Application strategy
          </div>

          <h2 className="text-lg font-semibold text-white">
            How to apply smarter
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
            Practical actions to improve positioning, visibility and recruiter
            response.
          </p>
        </div>

        <div className="rounded-full bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/40">
          {applicationStrategy.length} strategies
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {applicationStrategy.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-white/50">
            No application strategy available yet.
          </div>
        ) : (
          applicationStrategy.map((strategy, index) => (
            <div
              key={`${strategy.title}-${index}`}
              className="flex h-full flex-col rounded-2xl bg-white/[0.025] p-4 transition hover:bg-white/[0.04]"
            >
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-fuchsia-400/[0.08] text-sm font-semibold text-fuchsia-100/85">
                  {index + 1}
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-white/30">
                    Strategy {index + 1}
                  </p>

                  <h3 className="mt-1 text-sm font-semibold leading-6 text-white/90">
                    {strategy.title}
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-white/45">
                    {strategy.description}
                  </p>
                </div>
              </div>

              {strategy.action_items.length > 0 && (
                <div className="mt-3 flex-1 rounded-2xl bg-white/[0.025] p-3">
                  <ul className="space-y-2">
                    {strategy.action_items.map((action, actionIndex) => (
                      <li
                        key={`${action}-${actionIndex}`}
                        className="flex items-start gap-2 text-sm leading-5 text-white/50"
                      >
                        <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-fuchsia-300/65" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
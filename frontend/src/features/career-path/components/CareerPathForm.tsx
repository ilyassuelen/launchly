import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Loader2,
  Sparkles,
  Target,
  WandSparkles,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";

import type { CareerPathGenerateRequest } from "../types/careerPath";

type CareerPathFormProps = {
  isGenerating: boolean;
  onSubmit: (payload: CareerPathGenerateRequest) => Promise<void> | void;
};

export function CareerPathForm({
  isGenerating,
  onSubmit,
}: CareerPathFormProps) {
  const [targetRole, setTargetRole] = useState("AI Engineer");
  const [currentLevel, setCurrentLevel] = useState("Junior");
  const [timeframeMonths, setTimeframeMonths] = useState(6);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      target_role: targetRole,
      current_level: currentLevel || null,
      timeframe_months: timeframeMonths,
    });
  };

  return (
    <Card className="relative overflow-hidden border-white/10 bg-black/20 p-5 lg:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_32%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/45 to-transparent" />

      <div className="relative z-10">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.10] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-100/80 backdrop-blur-xl">
              <WandSparkles className="h-3.5 w-3.5 text-violet-300" />
              Roadmap Generator
            </div>

            <h2 className="max-w-2xl text-2xl font-semibold leading-tight text-white lg:text-3xl">
              Build a profile-based roadmap in seconds.
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/52">
              Choose a target role, level and timeframe. Launchly turns your saved profile signals into a realistic career path.
            </p>
          </div>


        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)_190px_auto] lg:items-end">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Target role
              </span>
              <input
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-400/50 focus:bg-violet-500/[0.06]"
                placeholder="AI Engineer"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Current level
              </span>
              <input
                value={currentLevel}
                onChange={(event) => setCurrentLevel(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/50 focus:bg-cyan-500/[0.05]"
                placeholder="Junior"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Timeframe
              </span>
              <select
                value={timeframeMonths}
                onChange={(event) => setTimeframeMonths(Number(event.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-400/50 focus:bg-fuchsia-500/[0.05]"
              >
                <option value={3}>3 months</option>
                <option value={6}>6 months</option>
                <option value={9}>9 months</option>
                <option value={12}>12 months</option>
                <option value={18}>18 months</option>
                <option value={24}>24 months</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={isGenerating || !targetRole.trim()}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 lg:whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate roadmap
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-white/42">
            <Target className="h-3.5 w-3.5 text-violet-300" />
            Based on your saved resume, LinkedIn profile, portfolio, applications and interview results.
          </div>
        </form>
      </div>
    </Card>
  );
}

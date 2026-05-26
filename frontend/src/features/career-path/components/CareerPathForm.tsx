import { FormEvent, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  DatabaseZap,
  Loader2,
  Radar,
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
      language: "english",
      target_role: targetRole,
      current_level: currentLevel || null,
      timeframe_months: timeframeMonths,
    });
  };

  return (
    <Card className="relative overflow-hidden p-6 lg:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_34%)]" />
      <div className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full border border-violet-400/20 bg-violet-500/[0.06] blur-2xl md:block" />

      <div className="relative z-10 mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.12] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-100/80 backdrop-blur-xl">
            <WandSparkles className="h-3.5 w-3.5 text-violet-300" />
            AI Roadmap Generator
          </div>

          <h2 className="max-w-2xl text-2xl font-semibold leading-tight text-white lg:text-3xl">
            Build a profile-based roadmap in seconds.
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
            Choose your target role and timeframe. Launchly analyzes your saved
            resume, projects, applications, interview results, LinkedIn and
            portfolio signals to evaluate how realistically your profile aligns
            with the selected role.
          </p>
        </div>

        <div className="hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-4 text-violet-100 shadow-[0_0_45px_rgba(168,85,247,0.12)] backdrop-blur-xl lg:block">
          <Sparkles className="h-6 w-6" />
        </div>
      </div>

      <div className="relative z-10 mb-6 grid gap-3 md:grid-cols-3">
        <div className="group rounded-3xl border border-white/10 bg-black/20 p-4 transition hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-violet-500/[0.08]">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
            <DatabaseZap className="h-4 w-4" />
          </div>

          <div className="text-sm font-semibold text-white">
            Auto profile scan
          </div>

          <p className="mt-2 text-xs leading-5 text-white/50">
            Uses your existing Launchly data instead of asking you to manually
            describe your background.
          </p>
        </div>

        <div className="group rounded-3xl border border-white/10 bg-black/20 p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-500/[0.06]">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
            <BriefcaseBusiness className="h-4 w-4" />
          </div>

          <div className="text-sm font-semibold text-white">
            Job-ready focus
          </div>

          <p className="mt-2 text-xs leading-5 text-white/50">
            Connects resume proof, portfolio signals, interview readiness and
            application activity.
          </p>
        </div>

        <div className="group rounded-3xl border border-white/10 bg-black/20 p-4 transition hover:-translate-y-0.5 hover:border-fuchsia-400/30 hover:bg-fuchsia-500/[0.06]">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200">
            <Radar className="h-4 w-4" />
          </div>

          <div className="text-sm font-semibold text-white">
            Targeted roadmap
          </div>

          <p className="mt-2 text-xs leading-5 text-white/50">
            Generates realistic milestones, skill gaps and projects based on
            how strongly your current profile matches the selected target role.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-4 lg:p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Target role
              </span>
              <input
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-400/50 focus:bg-violet-500/[0.06]"
                placeholder=""
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Current level
              </span>
              <input
                value={currentLevel}
                onChange={(event) => setCurrentLevel(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/50 focus:bg-cyan-500/[0.05]"
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
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-400/50 focus:bg-fuchsia-500/[0.05]"
              >
                <option value={3}>3 months</option>
                <option value={6}>6 months</option>
                <option value={9}>9 months</option>
                <option value={12}>12 months</option>
                <option value={18}>18 months</option>
                <option value={24}>24 months</option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-white/45">
              <Target className="h-3.5 w-3.5 text-violet-300" />
              Launchly evaluates your real profile fit before generating a roadmap.
            </div>

            <button
              type="submit"
              disabled={isGenerating || !targetRole.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing your Launchly profile...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate roadmap from my profile
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Card>
  );
}

import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, Card, Progress } from "@/components/launchly/AppShell";
import { useAuth } from "@/context/AuthContext";
import {
  Mic,
  Send,
  Sparkles,
  Code2,
  MessageSquare,
  Volume2,
  Play,
  BrainCircuit,
  Activity,
  AudioLines,
  Radar,
  TrendingUp,
  AlertTriangle,
  Check,
  Clock3,
} from "lucide-react";

export const Route = createFileRoute("/interview")({
  head: () => ({ meta: [{ title: "Interview Simulator — Launchly" }, { name: "description", content: "Practice behavioral and technical interviews with AI follow-ups and scoring." }] }),
  component: Interview,
});

function Interview() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="text-sm text-white/60">
          Loading interview simulator...
        </div>
      </div>
    );
  }

  useEffect(() => {
      if (!loading && !user) {
          navigate({ to: "/login" });
      }
  }, [user, loading, navigate]);

  if (loading || !user) {
      return null;
  }
  return (
    <AppShell title="Interview Simulator" subtitle="Real questions. AI follow-ups. Honest feedback that builds confidence."
      action={<button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow"><Play className="size-4"/> Start mock</button>}>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left Control Panel */}
        <Card className="relative overflow-hidden lg:col-span-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_35%)]" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <div className="text-sm font-semibold">
                  Interview setup
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  Configure your AI mock session.
                </div>
              </div>

              <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/10 px-2 py-1 text-[11px] text-cyan-200">
                AI calibrated
              </div>
            </div>

            <div>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Interview mode
              </div>

              <div className="space-y-2">
                {[
                  { i: MessageSquare, t: "Behavioral" },
                  { i: Code2, t: "Technical" },
                  { i: Sparkles, t: "System Design" },
                ].map((m, i) => (
                  <button
                    key={m.t}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-sm transition ${
                      i === 0
                        ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-100"
                        : "border-white/5 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="grid size-9 place-items-center rounded-xl bg-black/20 ring-1 ring-white/10">
                      <m.i className="size-4" />
                    </div>

                    <div className="text-left">
                      <div className="font-medium">{m.t}</div>
                      <div className="text-xs text-muted-foreground">
                        AI-generated recruiter questions
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Role
              </div>

              <select className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white/80 outline-none">
                <option>Frontend Engineer</option>
                <option>Full-stack Engineer</option>
                <option>AI Engineer</option>
                <option>Product Engineer</option>
              </select>

              <div className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Difficulty
              </div>

              <div className="mt-2 flex gap-2">
                {[
                  ["Junior", true],
                  ["Mid", false],
                  ["Senior", false],
                ].map(([d, active]) => (
                  <button
                    key={d as string}
                    className={`flex-1 rounded-xl px-3 py-2 text-xs transition ${
                      active
                        ? "bg-gradient-brand text-primary-foreground shadow-[0_12px_40px_rgba(34,211,238,0.28)]"
                        : "border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]"
                    }`}
                  >
                    {d as string}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/5 bg-gradient-to-br from-cyan-400/[0.08] to-violet-500/[0.08] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BrainCircuit className="size-4 text-cyan-300" />
                AI interviewer state
              </div>

              <div className="mt-4 space-y-3 text-xs text-white/70">
                <div className="rounded-xl bg-black/20 p-3">
                  Recruiter confidence analysis active.
                </div>

                <div className="rounded-xl bg-black/20 p-3">
                  STAR structure detection enabled.
                </div>

                <div className="rounded-xl bg-black/20 p-3">
                  Real-time pacing & specificity tracking online.
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Past sessions
                </div>

                <div className="text-[11px] text-muted-foreground">
                  Last 30 days
                </div>
              </div>

              <ul className="space-y-2 text-sm">
                {[
                  ["Behavioral · 8 Questions", "82"],
                  ["Technical · 6 Questions", "74"],
                  ["System Design · 4 Questions", "68"],
                ].map(([n, s]) => (
                  <li
                    key={n as string}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]"
                  >
                    <span>{n as string}</span>

                    <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">
                      {s as string}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Main Interview Area */}
        <Card className="relative overflow-hidden lg:col-span-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_40%)]" />

          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:34px_34px]" />

          <div className="absolute left-0 right-0 top-0 h-24 animate-pulse bg-gradient-to-b from-cyan-400/10 to-transparent blur-2xl" />

          <div className="relative">
            <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-5">
              <div>
                <div className="text-sm font-semibold text-white">
                  Live interview session
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  AI recruiter simulation with real-time communication analysis.
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 shadow-[0_10px_30px_rgba(16,185,129,0.18)]">
                <span className="size-2 rounded-full bg-emerald-300 animate-pulse" />
                Simulation running
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-black/20 p-5 backdrop-blur-xl">
              <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent animate-pulse" />

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-xs font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(34,211,238,0.35)]">
                    AI
                  </div>

                  <div className="max-w-[85%] rounded-[1.6rem] rounded-tl-sm border border-white/5 bg-white/[0.04] p-5 text-sm leading-7 text-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                    Tell me about a time you disagreed with a teammate. What happened, and what would you do differently?
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <div className="max-w-[85%] rounded-[1.6rem] rounded-tr-sm bg-gradient-to-br from-cyan-400/20 to-violet-500/20 p-5 text-sm leading-7 text-white/90 shadow-[0_20px_60px_rgba(34,211,238,0.12)] ring-1 ring-white/10 backdrop-blur-xl">
                    During my Stripe internship, I disagreed on using Redux for a small dashboard. I proposed Zustand and we A/B tested both approaches before making a final decision…
                  </div>

                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-xs font-semibold text-white/80">
                    M
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-xs font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(34,211,238,0.35)]">
                    AI
                  </div>

                  <div className="max-w-[85%] rounded-[1.6rem] rounded-tl-sm border border-white/5 bg-white/[0.04] p-5 text-sm leading-7 text-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                    Nice — what was the actual impact, and how did you bring your teammate along after the data came back?
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <AudioLines className="size-4 text-cyan-300" />
                      Voice analysis active
                    </div>

                    <div className="mt-1 text-xs text-white/50">
                      AI is analyzing pacing, confidence and structure in real time.
                    </div>
                  </div>

                  <div className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">
                    Listening...
                  </div>
                </div>

                <div className="mt-4 flex items-end gap-1">
                  {[18, 34, 22, 48, 28, 52, 36, 58, 42, 30, 46, 22, 40].map((h, i) => (
                    <div
                      key={i}
                      className="w-full rounded-full bg-gradient-to-t from-cyan-400/30 to-cyan-300"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-[1.6rem] border border-white/5 bg-black/30 p-3 backdrop-blur-xl">
                <button className="relative grid size-12 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-[0_15px_50px_rgba(34,211,238,0.35)]">
                  <div className="absolute inset-0 rounded-2xl animate-ping bg-cyan-300/20" />
                  <Mic className="relative size-5" />
                </button>

                <input
                  className="flex-1 bg-transparent px-2 text-sm text-white/80 outline-none placeholder:text-muted-foreground"
                  placeholder="Type your answer or hold to record..."
                />

                <button className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.06]">
                  <Volume2 className="size-4" />
                </button>

                <button className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.06]">
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Intelligence Panel */}
        <div className="space-y-4 lg:col-span-3">
          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Activity className="size-4 text-cyan-300" />
              Live communication analysis
            </div>

            <div className="space-y-4">
              <Progress label="Confidence" value={78} />
              <Progress label="Communication" value={84} color="green" />
              <Progress label="Structure (STAR)" value={62} color="pink" />
              <Progress label="Specificity" value={71} />
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_40%)]" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-violet-300" />
                AI recruiter insights
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.05] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-2">
                      <Check className="mt-0.5 size-4 text-emerald-300" />

                      <div>
                        <div className="text-sm font-medium text-white">
                          Strong technical ownership
                        </div>

                        <div className="mt-1 text-xs text-white/60">
                          Your answer communicates initiative and problem-solving clearly.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-full bg-emerald-300/10 px-2 py-1 text-[10px] text-emerald-200">
                      High confidence
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-400/10 bg-orange-400/[0.05] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-2">
                      <AlertTriangle className="mt-0.5 size-4 text-orange-300" />

                      <div>
                        <div className="text-sm font-medium text-white">
                          Missing measurable impact
                        </div>

                        <div className="mt-1 text-xs text-white/60">
                          Add a specific business or performance outcome.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-full bg-orange-300/10 px-2 py-1 text-[10px] text-orange-200">
                      Medium impact
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-2">
                      <TrendingUp className="mt-0.5 size-4 text-cyan-300" />

                      <div>
                        <div className="text-sm font-medium text-white">
                          Recruiter engagement increasing
                        </div>

                        <div className="mt-1 text-xs text-white/60">
                          Specific frameworks and technical tradeoffs improved attention.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-full bg-cyan-300/10 px-2 py-1 text-[10px] text-cyan-200">
                      Top 18%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Radar className="size-4 text-cyan-300" />
              Session telemetry
            </div>

            <div className="space-y-3 text-sm">
              {[
                ["Speaking pace", "142 WPM"],
                ["Recruiter engagement", "+18%"],
                ["Filler words", "Low"],
                ["Response latency", "1.2s"],
                ["Estimated confidence", "High"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-3"
                >
                  <span className="text-white/60">{k}</span>
                  <span className="font-medium text-white/85">{v}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Clock3 className="size-4 text-violet-300" />
              AI coaching tips
            </div>

            <ul className="space-y-3 text-sm text-white/75">
              <li className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                Lead with the outcome before explaining the situation.
              </li>

              <li className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                Add one quantified metric to improve recruiter trust.
              </li>

              <li className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                Your pacing improved after the second sentence.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

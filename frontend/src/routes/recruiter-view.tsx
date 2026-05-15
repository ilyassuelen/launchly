import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, Progress } from "@/components/launchly/AppShell";
import {
  Eye,
  AlertTriangle,
  Check,
  Sparkles,
  ScanSearch,
  Activity,
  MousePointer2,
  Radar,
} from "lucide-react";

export const Route = createFileRoute("/recruiter-view")({
  head: () => ({ meta: [{ title: "Recruiter View — Launchly" }, { name: "description", content: "See your profile through a recruiter's eyes with attention heatmaps and weak-spot detection." }] }),
  component: RecruiterView,
});

function RecruiterView() {
  return (
    <AppShell title="Recruiter View" subtitle="A 7-second simulated recruiter scan of your profile — with the receipts."
      action={<button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow"><Eye className="size-4"/> Re-run scan</button>}>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="relative overflow-hidden border-white/5 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_45%)] lg:col-span-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />

          {/* cinematic scanner glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 animate-[scan_6s_linear_infinite] bg-[linear-gradient(180deg,rgba(34,211,238,0),rgba(34,211,238,0.10),rgba(34,211,238,0))] blur-2xl" />

          {/* subtle grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />

          <div className="relative">
            <div className="mb-5 flex flex-col gap-4 border-b border-white/5 pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Radar className="size-4 text-cyan-300" />
                  Attention heatmap
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  First 7 seconds · simulated across 8 recruiter sessions
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] px-3 py-2 text-xs text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
                <Activity className="size-3.5" />
                Live recruiter simulation running
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_40%)] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
              {/* floating paper shadow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[92%] w-[82%] rounded-[36px] bg-black/40 blur-3xl" />
              </div>

              {/* recruiter scan line */}
              <div className="pointer-events-none absolute left-0 right-0 top-0 h-px animate-[scan_5s_linear_infinite] bg-cyan-300/60 shadow-[0_0_30px_rgba(34,211,238,0.8)]" />

              {/* eye tracking paths */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
                viewBox="0 0 1000 700"
                preserveAspectRatio="none"
              >
                <path
                  d="M220 120 C 350 160, 420 230, 520 280"
                  stroke="rgba(34,211,238,0.22)"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  fill="none"
                />

                <path
                  d="M520 280 C 650 330, 720 410, 620 520"
                  stroke="rgba(168,85,247,0.20)"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  fill="none"
                />
              </svg>

              <div className="relative mx-auto max-w-[760px] overflow-hidden rounded-[34px] border border-black/5 bg-white px-10 py-9 text-[oklch(0.18_0.02_270)] shadow-[0_30px_120px_rgba(0,0,0,0.30)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_50px_160px_rgba(0,0,0,0.38)]">
                <div className="flex items-start justify-between border-b border-black/10 pb-5">
                  <div>
                    <div className="text-[30px] font-semibold tracking-tight">
                      Maya Reyes
                    </div>

                    <div className="mt-2 text-[15px] text-black/60">
                      Frontend Engineer · Brooklyn, NY
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[oklch(0.72_0.20_295_/_0.08)] px-4 py-2 text-xs font-medium text-[oklch(0.55_0.18_200)]">
                    Attention score: 82/100
                  </div>
                </div>

                <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-black/50">
                  Summary
                </h4>

                <p className="mt-2 text-[15px] leading-7 text-black/80">
                  CS senior building consumer-grade React apps. Shipped 4 production tools used by 18k+ users.
                </p>

                <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-black/50">
                  Experience
                </h4>

                <div className="mt-3">
                  <div className="text-[15px] font-semibold">
                    Frontend Intern, Stripe
                  </div>

                  <ul className="mt-2 list-disc space-y-2 pl-5 text-[15px] leading-7 text-black/80">
                    <li>
                      Built dashboard widget used by <strong>3,400+</strong> merchants weekly.
                    </li>

                    <li>
                      Reduced p95 render time by 38%.
                    </li>

                    <li>
                      Worked on payment flows.
                    </li>
                  </ul>
                </div>

                <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-black/50">
                  Education
                </h4>

                <p className="mt-2 text-[15px] text-black/75">
                  B.S. Computer Science, NYU — 2026
                </p>

                {/* realistic heatmap zones */}
                <div className="pointer-events-none absolute left-8 top-6 size-56 rounded-full bg-[oklch(0.7_0.22_25)] opacity-35 blur-3xl" />

                <div className="pointer-events-none absolute left-52 top-44 size-40 rounded-full bg-[oklch(0.83_0.16_75)] opacity-30 blur-3xl" />

                <div className="pointer-events-none absolute right-16 top-64 size-48 rounded-full bg-[oklch(0.78_0.17_155)] opacity-22 blur-3xl" />

                <div className="pointer-events-none absolute left-28 bottom-14 size-36 rounded-full bg-[oklch(0.8_0.18_75)] opacity-24 blur-3xl" />

                {/* recruiter focus markers */}
                <div className="pointer-events-none absolute left-[220px] top-[120px] flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-[10px] text-cyan-700 backdrop-blur-sm">
                  <MousePointer2 className="size-3" />
                  Initial focus
                </div>

                <div className="pointer-events-none absolute right-[140px] top-[290px] flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-1 text-[10px] text-violet-700 backdrop-blur-sm">
                  <ScanSearch className="size-3" />
                  Metrics detected
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="size-2.5 rounded-full bg-[oklch(0.7_0.22_25)]" />
                High attention
              </span>

              <span className="inline-flex items-center gap-1">
                <span className="size-2.5 rounded-full bg-[oklch(0.83_0.16_75)]" />
                Medium attention
              </span>

              <span className="inline-flex items-center gap-1">
                <span className="size-2.5 rounded-full bg-[oklch(0.78_0.17_155)]" />
                Low attention
              </span>

              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px]">
                Simulated recruiter replay
              </span>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-4 space-y-4">
          <Card>
            <div className="text-xs text-muted-foreground">Recruiter Score</div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-4xl font-semibold tracking-tight text-gradient">82</div>
              <div className="text-sm text-muted-foreground">/ 100 · Top 22%</div>
            </div>
            <Progress value={82} />
          </Card>
          <Card>
            <div className="mb-3 text-sm font-semibold">Signals</div>
            <div className="space-y-3">
              <Progress label="Readability" value={91} color="green" />
              <Progress label="Impact density" value={62} />
              <Progress label="Technical depth" value={74} />
              <Progress label="Visual hierarchy" value={88} color="green" />
            </div>
          </Card>
          <Card>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4 text-[oklch(0.85_0.14_250)]"/> AI panel feedback</div>
            <div className="space-y-3">
              <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.05] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-2">
                    <Check className="mt-0.5 size-4 text-emerald-300" />

                    <div>
                      <div className="text-sm font-medium text-white">
                        Strong opening hook
                      </div>

                      <div className="mt-1 text-xs text-white/60">
                        Recruiters focused on your summary section within the first 1.2 seconds.
                      </div>
                    </div>
                  </div>

                  <div className="rounded-full bg-emerald-300/10 px-2 py-1 text-[10px] text-emerald-200">
                    High confidence
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-orange-400/10 bg-orange-400/[0.06] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-2">
                    <AlertTriangle className="mt-0.5 size-4 text-orange-300" />

                    <div>
                      <div className="text-sm font-medium text-white">
                        Attention drop detected
                      </div>

                      <div className="mt-1 text-xs text-white/60">
                        One vague experience bullet reduced recruiter retention after 4.1 seconds.
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
                    <Sparkles className="mt-0.5 size-4 text-cyan-300" />

                    <div>
                      <div className="text-sm font-medium text-white">
                        Strong metric retention
                      </div>

                      <div className="mt-1 text-xs text-white/60">
                        Quantified results kept recruiter focus significantly longer than average resumes.
                      </div>
                    </div>
                  </div>

                  <div className="rounded-full bg-cyan-300/10 px-2 py-1 text-[10px] text-cyan-200">
                    Top 18%
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          { t: "Strengths", c: "green", items: ["Clear hierarchy", "Strong action verbs", "Quantified bullets", "Modern formatting"] },
          { t: "Weak spots", c: "warning", items: ["Vague payment-flows bullet", "No portfolio link visible", "Long Education block"] },
          { t: "Missing impact", c: "pink", items: ["Project: add user count", "Internship: add metric", "Skills: add 'TypeScript'"] },
        ].map(b => (
          <Card key={b.t}>
            <div className="mb-3 text-sm font-semibold">{b.t}</div>
            <ul className="space-y-2 text-sm">
              {b.items.map(i => (
                <li key={i} className="flex gap-2">
                  <span className={`mt-1.5 size-1.5 rounded-full ${b.c==="green"?"bg-[oklch(0.78_0.17_155)]":b.c==="warning"?"bg-[oklch(0.83_0.16_75)]":"bg-[oklch(0.78_0.18_340)]"}`}/>
                  {i}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

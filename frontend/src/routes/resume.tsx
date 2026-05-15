import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, Progress } from "@/components/launchly/AppShell";
import {
  Sparkles,
  Wand2,
  FileText,
  Download,
  Plus,
  GripVertical,
  Check,
  AlertTriangle,
  Target,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  Palette,
  Type,
  LayoutTemplate,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  Dock,
  BadgeCheck,
  TriangleAlert,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/resume")({
  head: () => ({ meta: [{ title: "AI Resume Builder — Launchly" }, { name: "description", content: "Build a recruiter-ready resume with live AI feedback and ATS scoring." }] }),
  component: ResumeBuilder,
});

const sections = [
  { name: "Basics", icon: User },
  { name: "Summary", icon: Sparkles },
  { name: "Experience", icon: Briefcase },
  { name: "Projects", icon: Code2 },
  { name: "Education", icon: GraduationCap },
  { name: "Skills", icon: Target },
];
const templates = [
  { n: "Aurora", c: "from-[oklch(0.72_0.20_295)] to-[oklch(0.55_0.18_200)]" },
  { n: "Mono", c: "from-white/30 to-white/5" },
  { n: "Vercel", c: "from-white/10 to-white/0" },
  { n: "Sunrise", c: "from-[oklch(0.83_0.16_75)] to-[oklch(0.78_0.18_340)]" },
];

function ResumeBuilder() {
  return (
    <AppShell title="Resume Builder" subtitle="Live AI feedback, ATS optimization and recruiter-grade formatting."
      action={<div className="flex gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-xl glass px-3 py-2 text-sm"><Download className="size-4"/> Export PDF</button>
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow"><Wand2 className="size-4"/> Improve all</button>
      </div>}>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left: editor */}
        <Card className="lg:col-span-3 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <div className="text-sm font-semibold">Resume editor</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Drag, edit and optimize sections
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-violet-200">
              Live sync
            </div>
          </div>

          <div className="mt-5 space-y-5">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Personal information
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="mb-1 text-[11px] text-muted-foreground">
                    Full name
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/85">
                    Maya Reyes
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-[11px] text-muted-foreground">
                    Target role
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/85">
                    Frontend Engineer
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Resume structure
              </div>

              <ul className="space-y-2">
                {sections.map((section, i) => (
                  <li
                    key={section.name}
                    className={`group flex items-center justify-between rounded-2xl border px-3 py-3 transition ${
                      i === 2
                        ? "border-violet-400/20 bg-violet-500/10"
                        : "border-white/5 bg-white/[0.03] hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className="flex items-center gap-3 text-sm text-white/80">
                      <GripVertical className="size-4 text-muted-foreground" />
                      <section.icon className="size-4 text-cyan-300" />
                      {section.name}
                    </span>

                    <span className="text-[10px] text-muted-foreground">
                      drag
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/70 transition hover:bg-white/[0.04]">
              <Plus className="size-4" />
              Add new section
            </button>

            <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-violet-500/10 to-cyan-400/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-cyan-300" />
                Recruiter analysis
              </div>

              <div className="mt-4 space-y-3 text-xs text-white/70">
                <div className="rounded-xl bg-black/20 p-3">
                  Resume readability is above average.
                </div>

                <div className="rounded-xl bg-black/20 p-3">
                  Your strongest section is Projects.
                </div>

                <div className="rounded-xl bg-black/20 p-3">
                  Experience bullets still lack measurable impact.
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Center: live preview */}
        <Card className="relative overflow-hidden lg:col-span-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_40%)]" />
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Live document preview</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Real-time recruiter-ready formatting
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="flex items-center gap-1">
                <button className="grid size-9 place-items-center rounded-xl border border-transparent bg-white/[0.03] transition hover:border-white/10 hover:bg-white/[0.08]">
                  <Undo2 className="size-4" />
                </button>

                <button className="grid size-9 place-items-center rounded-xl border border-transparent bg-white/[0.03] transition hover:border-white/10 hover:bg-white/[0.08]">
                  <Redo2 className="size-4" />
                </button>

                <div className="mx-1 h-5 w-px bg-white/10" />

                <button className="grid size-9 place-items-center rounded-xl border border-transparent bg-white/[0.03] transition hover:border-white/10 hover:bg-white/[0.08]">
                  <ZoomOut className="size-4" />
                </button>

                <button className="grid size-9 place-items-center rounded-xl border border-transparent bg-white/[0.03] transition hover:border-white/10 hover:bg-white/[0.08]">
                  <ZoomIn className="size-4" />
                </button>

                <div className="mx-1 h-5 w-px bg-white/10" />

                <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(168,85,247,0.35)] transition hover:scale-[1.02]">
                  <Download className="size-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
          <div className="relative mx-auto mt-8 flex justify-center rounded-[2rem] border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-10 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:min-h-[980px] lg:max-w-[760px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_55%)]" />
            <div className="mt-6 w-full max-w-[680px] rounded-[28px] border border-black/5 bg-white p-10 text-[oklch(0.18_0.02_270)] shadow-[0_20px_80px_rgba(0,0,0,0.18)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_40px_120px_rgba(0,0,0,0.28)]">
              <div className="border-b border-black/10 pb-3">
                <div className="text-2xl font-semibold tracking-tight">Maya Reyes</div>
                <div className="text-sm text-black/60">Frontend Engineer · Brooklyn, NY · maya.reyes@launchly.app</div>
              </div>
              <h4 className="mt-4 text-xs font-semibold uppercase tracking-widest text-black/60">Summary</h4>
              <p className="mt-1 text-sm">CS senior building consumer-grade React apps. Shipped 4 production tools used by 18k+ users.</p>

              <h4 className="mt-4 text-xs font-semibold uppercase tracking-widest text-black/60">Experience</h4>
              <div className="mt-2">
                <div className="flex items-baseline justify-between">
                  <div className="font-semibold text-sm">Frontend Intern, Stripe</div>
                  <div className="text-xs text-black/60">Summer 2025</div>
                </div>
                <ul className="mt-1 list-disc pl-5 text-sm">
                  <li className="bg-[oklch(0.83_0.16_75_/_0.18)] rounded px-1">Built dashboard widget used by <strong>3,400+</strong> merchants weekly.</li>
                  <li>Reduced p95 render time by 38% via React Server Components migration.</li>
                  <li className="bg-[oklch(0.7_0.22_25_/_0.12)] rounded px-1">Worked on payment flows.</li>
                </ul>
              </div>

              <h4 className="mt-4 text-xs font-semibold uppercase tracking-widest text-black/60">Projects</h4>
              <div className="mt-1 text-sm"><strong>Lumen API</strong> · TypeScript, tRPC, Postgres — public API with 1.2k weekly users.</div>

              <h4 className="mt-4 text-xs font-semibold uppercase tracking-widest text-black/60">Education</h4>
              <div className="mt-1 text-sm">B.S. Computer Science, NYU · 2026 · GPA 3.8</div>
            </div>
          </div>
        </Card>

        {/* Right: controls */}
        <div className="space-y-4 lg:col-span-3">
          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Target className="size-4 text-cyan-300" />
              ATS Score
            </div>

            <div className="flex items-end gap-2">
              <div className="text-5xl font-semibold tracking-tight">
                88
              </div>

              <div className="mb-2 text-sm text-muted-foreground">
                /100
              </div>
            </div>

            <Progress value={88} color="green" />

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              {[["Keywords","92"],["Format","95"],["Impact","78"]].map(([k,v]) => (
                <div key={k} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                  <div className="text-muted-foreground">{k}</div>
                  <div className="mt-1 font-semibold text-white/85">{v}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <LayoutTemplate className="size-4 text-violet-300" />
              Templates
            </div>

            <div className="grid grid-cols-2 gap-3">
              {templates.map((t, i) => (
                <button
                  key={t.n}
                  className={`rounded-2xl border p-2 transition ${
                    i === 0
                      ? "border-violet-400/30 bg-violet-500/10"
                      : "border-white/5 bg-white/[0.03] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="rounded-xl border border-white/5 bg-white p-2">
                    <div className={`h-16 rounded-md bg-gradient-to-br ${t.c}`} />

                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full rounded bg-black/10" />
                      <div className="h-1.5 w-4/5 rounded bg-black/10" />
                      <div className="h-1.5 w-3/5 rounded bg-black/10" />
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-white/75">
                    {t.n}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Type className="size-4 text-cyan-300" />
              Typography
            </div>

            <div className="space-y-3">
              {[
                "Inter",
                "IBM Plex Sans",
                "Satoshi",
                "General Sans",
              ].map((font, i) => (
                <button
                  key={font}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-sm transition ${
                    i === 0
                      ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-100"
                      : "border-white/5 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]"
                  }`}
                >
                  {font}

                  {i === 0 && (
                    <Check className="size-4" />
                  )}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Palette className="size-4 text-violet-300" />
              Theme
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                "bg-violet-400",
                "bg-cyan-400",
                "bg-pink-400",
                "bg-emerald-400",
                "bg-orange-400",
              ].map((color, i) => (
                <button
                  key={color}
                  className={`size-9 rounded-full ${color} ${
                    i === 0
                      ? "ring-4 ring-violet-400/20"
                      : ""
                  }`}
                />
              ))}
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_40%)]" />

            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-cyan-300" />
                Smart suggestions
              </div>

              <div className="rounded-full border border-cyan-400/10 bg-cyan-400/10 px-2 py-1 text-[10px] text-cyan-200">
                Live analysis
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-orange-400/10 bg-orange-400/[0.06] p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <TriangleAlert className="mt-0.5 size-4 text-orange-300" />

                    <div>
                      <div className="text-sm font-medium text-white">
                        Low recruiter impact
                      </div>

                      <div className="mt-1 text-xs text-white/60">
                        This bullet sounds generic and lacks measurable ownership.
                      </div>
                    </div>
                  </div>

                  <div className="rounded-full bg-orange-300/10 px-2 py-1 text-[10px] text-orange-200">
                    91% confidence
                  </div>
                </div>

                <div className="rounded-xl bg-black/20 p-3 text-xs text-white/70">
                  “Worked on payment flows” → “Improved checkout completion by 14% across 3 merchant flows.”
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="mt-0.5 size-4 text-cyan-300" />

                    <div>
                      <div className="text-sm font-medium text-white">
                        High ATS relevance
                      </div>

                      <div className="mt-1 text-xs text-white/60">
                        Adding stronger infrastructure keywords may improve match rates.
                      </div>
                    </div>
                  </div>

                  <div className="rounded-full bg-cyan-300/10 px-2 py-1 text-[10px] text-cyan-200">
                    +12 ATS score
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Postgres",
                    "CI/CD",
                    "System Design",
                    "Docker",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-cyan-400/10 bg-cyan-400/[0.08] px-2 py-1 text-[11px] text-cyan-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.05] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <BadgeCheck className="mt-0.5 size-4 text-emerald-300" />

                    <div>
                      <div className="text-sm font-medium text-white">
                        Strong recruiter signal
                      </div>

                      <div className="mt-1 text-xs text-white/60">
                        Your project section already performs better than 82% of similar resumes.
                      </div>
                    </div>
                  </div>

                  <div className="rounded-full bg-emerald-300/10 px-2 py-1 text-[10px] text-emerald-200">
                    Top 18%
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

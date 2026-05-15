import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card } from "@/components/launchly/AppShell";
import {
  Sparkles,
  Copy,
  Download,
  WandSparkles,
  TrendingUp,
  Check,
  AlertTriangle,
  Target,
 Clock3,
  Briefcase,
  PenSquare,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Building2,
  User2,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/cover-letters")({
  head: () => ({
    meta: [
      { title: "AI Cover Letters — Launchly" },
      {
        name: "description",
        content:
          "Generate recruiter-focused cover letters from any job posting.",
      },
    ],
  }),
  component: CoverLetters,
});

function CoverLetters() {
  return (
    <AppShell
      title="Cover Letters"
      subtitle="Tailored, recruiter-focused — generated from any job posting in seconds."
    >
      <div className="space-y-5">
        {/* HERO PREVIEW */}
        <Card className="relative overflow-hidden border-white/5 bg-[#050816] p-0">
          {/* cinematic background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.14),transparent_35%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_35%)]" />
            <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
          </div>

          {/* top bar */}
          <div className="relative border-b border-white/5 px-6 py-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm font-semibold text-white">
                  Live letter preview
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  Real-time recruiter-ready formatting with document-style
                  preview.
                </div>
              </div>

              {/* floating toolbar */}
              <div className="flex justify-center">
                <div className="flex items-center gap-1 rounded-[22px] border border-white/10 bg-white/[0.06] p-1.5 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                  <button className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white">
                    <Undo2 className="size-4" />
                  </button>

                  <button className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white">
                    <Redo2 className="size-4" />
                  </button>

                  <div className="mx-1 h-5 w-px bg-white/10" />

                  <button className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white">
                    <ZoomOut className="size-4" />
                  </button>

                  <button className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white">
                    <ZoomIn className="size-4" />
                  </button>

                  <div className="mx-1 h-5 w-px bg-white/10" />

                  <button className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white">
                    <Copy className="size-4" />
                  </button>

                  <button className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white">
                    <Download className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* preview workspace */}
          <div className="relative overflow-hidden px-5 py-10 lg:px-10 lg:py-14">
            {/* vignette */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.35))]" />

            <div className="relative flex justify-center">
              <div className="relative">
                {/* shadow atmosphere */}
                <div className="absolute inset-0 translate-y-8 scale-[0.95] rounded-[50px] bg-black/60 blur-3xl" />

                {/* DINA4 PAPER */}
                <div className="relative aspect-[210/297] w-full max-w-[850px] overflow-hidden rounded-[34px] border border-black/5 bg-white shadow-[0_50px_160px_rgba(0,0,0,0.45)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_70px_200px_rgba(0,0,0,0.52)]">
                  {/* subtle paper texture */}
                  <div className="absolute inset-0 opacity-[0.025] [background-image:radial-gradient(#000_0.6px,transparent_0.6px)] [background-size:18px_18px]" />

                  <div className="relative flex h-full flex-col px-[68px] py-[72px] text-[oklch(0.18_0.02_270)]">
                    {/* header */}
                    <div className="flex items-start justify-between border-b border-black/10 pb-6">
                      <div>
                        <div className="text-[32px] font-semibold tracking-tight">
                          Maya Reyes
                        </div>

                        <div className="mt-3 space-y-1 text-[14px] text-black/60">
                          <div>Brooklyn, NY</div>
                          <div>maya.reyes@launchly.app</div>
                          <div>+1 (213) 555-0182</div>
                          <div>www.launchly.app</div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-[oklch(0.72_0.20_295_/_0.08)] px-4 py-3 text-xs font-medium text-[oklch(0.55_0.18_200)] shadow-sm">
                        Personalized for Stripe
                      </div>
                    </div>

                    {/* receiver */}
                    <div className="mt-10 flex items-start justify-between text-[15px] text-black/70">
                      <div className="space-y-1">
                        <div>Stripe Inc.</div>
                        <div>Hiring Team</div>
                        <div>San Francisco, CA</div>
                      </div>

                      <div>April 24, 2026</div>
                    </div>

                    {/* title */}
                    <div className="mt-10 text-[21px] font-semibold tracking-tight">
                      Application for Frontend Engineer Intern
                    </div>

                    {/* body */}
                    <div className="mt-12 space-y-8 text-[15px] leading-8 text-black/80">
                      <p>Dear Stripe Hiring Team,</p>

                      <p>
                        When I shipped my first dashboard widget last summer,
                        three thousand merchants used it within a week — and I
                        learned that great frontend isn't just code, it's
                        confidence. That's exactly what drew me to your Frontend
                        Engineer Intern role.
                      </p>

                      <p>
                        At NYU and on the side, I've built React apps that
                        prioritize speed and clarity, including{" "}
                        <strong>Lumen API</strong>, a TypeScript + tRPC project
                        with 1.2k weekly users.
                      </p>

                      <p>
                        Beyond frontend development, I enjoy building systems
                        that combine usability, performance and thoughtful
                        engineering. I would love the opportunity to contribute
                        my skills and continue learning from one of the strongest
                        engineering cultures in the industry.
                      </p>

                      <p>
                        Sincerely,
                        <br />
                        Maya Reyes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* LOWER GRID */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* LEFT */}
          <Card className="relative overflow-hidden lg:col-span-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_40%)]" />

            <div className="relative">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <div className="text-sm font-semibold">
                    Job posting
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    Paste any job description to generate a tailored letter.
                  </div>
                </div>

                <div className="rounded-xl border border-violet-400/10 bg-violet-400/10 px-2 py-1 text-[11px] text-violet-200">
                  Live personalization
                </div>
              </div>

              <div className="mt-5">
                <textarea
                  className="h-52 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/80 outline-none transition focus:border-violet-400/30"
                  defaultValue="Stripe is hiring a Frontend Engineer Intern. You'll work on payment dashboards using React, TypeScript, and design systems. We value pragmatic builders who care about UX and shipping…"
                />
              </div>

              {/* tone */}
              <div className="mt-5">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Tone
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["Confident", true],
                    ["Warm", false],
                    ["Concise", false],
                  ].map(([tone, active]) => (
                    <button
                      key={tone as string}
                      className={`rounded-2xl px-3 py-3 text-sm transition ${
                        active
                          ? "bg-gradient-brand text-primary-foreground shadow-[0_12px_40px_rgba(168,85,247,0.35)]"
                          : "border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]"
                      }`}
                    >
                      {tone as string}
                    </button>
                  ))}
                </div>
              </div>

              {/* fields */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Your name",
                    value: "Maya Reyes",
                    icon: User2,
                  },
                  {
                    label: "Target role",
                    value: "Frontend Intern",
                    icon: Briefcase,
                  },
                  {
                    label: "Company",
                    value: "Stripe",
                    icon: Building2,
                  },
                  {
                    label: "Hiring contact",
                    value: "Hiring Team",
                    icon: FileText,
                  },
                ].map((field) => (
                  <div key={field.label}>
                    <div className="mb-1 text-[11px] text-muted-foreground">
                      {field.label}
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <field.icon className="size-4 text-white/40" />

                      <input
                        className="w-full bg-transparent text-sm text-white/80 outline-none"
                        defaultValue={field.value}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_15px_50px_rgba(168,85,247,0.35)] transition hover:scale-[1.01]">
                <WandSparkles className="size-4" />
                Generate cover letter
              </button>

              {/* structure */}
              <div className="mt-6 rounded-3xl border border-white/5 bg-black/20 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="size-4 text-cyan-300" />
                  Letter structure
                </div>

                <div className="mt-5 space-y-4">
                  {[
                    ["Introduction hook", "Strong"],
                    ["Technical relevance", "Matched"],
                    ["Motivation quality", "High"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-4"
                    >
                      <span className="text-sm text-white/70">{k}</span>

                      <span className="text-sm font-medium text-cyan-300">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* RIGHT */}
          <div className="space-y-4 lg:col-span-5">
            {/* recruiter rating */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_40%)]" />

              <div className="relative">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="size-4 text-cyan-300" />
                  Recruiter rating
                </div>

                <div className="flex items-end gap-2">
                  <div className="text-6xl font-semibold tracking-tight">
                    9.1
                  </div>

                  <div className="mb-2 text-sm text-muted-foreground">
                    /10
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {[
                    ["Specificity", "92%"],
                    ["Authenticity", "88%"],
                    ["Recruiter warmth", "94%"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                        <span>{label}</span>
                        <span>{value}</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-brand"
                          style={{ width: value as string }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* smart suggestions */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_40%)]" />

              <div className="relative">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                  <PenSquare className="size-4 text-violet-300" />
                  Smart suggestions
                </div>

                <div className="space-y-3">
                  {/* suggestion */}
                  <div className="rounded-3xl border border-orange-400/10 bg-orange-400/[0.06] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <AlertTriangle className="mt-0.5 size-4 text-orange-300" />

                        <div>
                          <div className="text-sm font-medium text-white">
                            Slightly generic ending
                          </div>

                          <div className="mt-1 text-xs leading-6 text-white/60">
                            Recruiters respond better to more role-specific
                            closings.
                          </div>
                        </div>
                      </div>

                      <div className="rounded-full bg-orange-300/10 px-2 py-1 text-[10px] text-orange-200">
                        Medium impact
                      </div>
                    </div>
                  </div>

                  {/* suggestion */}
                  <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.05] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <TrendingUp className="mt-0.5 size-4 text-cyan-300" />

                        <div>
                          <div className="text-sm font-medium text-white">
                            Strong recruiter alignment
                          </div>

                          <div className="mt-1 text-xs leading-6 text-white/60">
                            The letter references real product impact and
                            measurable usage.
                          </div>
                        </div>
                      </div>

                      <div className="rounded-full bg-cyan-300/10 px-2 py-1 text-[10px] text-cyan-200">
                        Top 15%
                      </div>
                    </div>
                  </div>

                  {/* suggestion */}
                  <div className="rounded-3xl border border-emerald-400/10 bg-emerald-400/[0.05] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <Check className="mt-0.5 size-4 text-emerald-300" />

                        <div>
                          <div className="text-sm font-medium text-white">
                            Strong opening hook
                          </div>

                          <div className="mt-1 text-xs leading-6 text-white/60">
                            The first paragraph feels memorable and human.
                          </div>
                        </div>
                      </div>

                      <div className="rounded-full bg-emerald-300/10 px-2 py-1 text-[10px] text-emerald-200">
                        High confidence
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* stats */}
            <Card>
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <Clock3 className="size-4 text-cyan-300" />
                Generation stats
              </div>

              <div className="space-y-3">
                {[
                  ["Generation time", "4.2 seconds"],
                  ["Matched keywords", "14"],
                  ["Recruiter tone", "Confident"],
                  ["Estimated read time", "38 sec"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-4"
                  >
                    <span className="text-sm text-white/60">{k}</span>

                    <span className="text-sm font-medium text-white/85">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
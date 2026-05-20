import {
  Sparkles,
  Target,
  LayoutTemplate,
  TriangleAlert,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";

import {
  Card,
  Progress,
} from "@/components/launchly/AppShell";

import { templates } from "@/features/resume/constants/templates";

import { FONT_OPTIONS } from "@/features/resume/constants/typography";

type Props = {
  resume: any;
  setResume: any;
  typography: any;
  updateTypography: (
    updates: any,
  ) => void;
};

export function ResumeRightPanel({
  resume,
  setResume,
  typography,
  updateTypography,
}: Props) {
  return (
    <div className="space-y-4 lg:col-span-2">

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
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <LayoutTemplate className="size-4 text-violet-300" />
          Templates
        </div>

        <div className="grid grid-cols-2 gap-3">
          {templates.map((t) => (
            <button
              key={t.n}
              onClick={() =>
                setResume((prev: any) => ({
                  ...prev,
                  template: t.id,
                }))
              }
              className={`rounded-2xl border p-2 transition ${
                resume.template === t.id
                  ? "border-violet-400/30 bg-violet-500/10"
                  : "border-white/5 bg-white/[0.03]"
              }`}
            >
              <div className="rounded-xl border border-white/5 bg-white p-2">
                <div
                  className={`h-16 rounded-md bg-gradient-to-br ${t.c}`}
                />
              </div>

              <div className="mt-2 text-xs text-white/75">
                {t.n}
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-violet-300" />
          Typography
        </div>

        <div className="space-y-5">

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
              Font Family
            </div>

            <div className="grid grid-cols-1 gap-2">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.id}
                  onClick={() =>
                    updateTypography({
                      fontFamily: font.value,
                    })
                  }
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    typography.fontFamily ===
                    font.value
                      ? "border-violet-400/30 bg-violet-500/10"
                      : "border-white/5 bg-white/[0.03]"
                  }`}
                  style={{
                    fontFamily: font.value,
                  }}
                >
                  <div className="text-sm font-semibold">
                    {font.label}
                  </div>

                  <div className="mt-1 text-xs text-white/50">
                    The quick brown fox jumps over the lazy dog
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                Font Size
              </div>

              <div className="text-xs text-white/60">
                {typography.fontSize}px
              </div>
            </div>

            <input
              type="range"
              min={11}
              max={16}
              step={0.5}
              value={typography.fontSize}
              onChange={(e) =>
                updateTypography({
                  fontSize: Number(
                    e.target.value,
                  ),
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                Line Height
              </div>

              <div className="text-xs text-white/60">
                {typography.lineHeight}
              </div>
            </div>

            <input
              type="range"
              min={1.2}
              max={2}
              step={0.05}
              value={typography.lineHeight}
              onChange={(e) =>
                updateTypography({
                  lineHeight: Number(
                    e.target.value,
                  ),
                })
              }
              className="w-full"
            />
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-cyan-300" />
          Smart suggestions
        </div>

        <div className="space-y-3">

          <div className="rounded-2xl border border-orange-400/10 bg-orange-400/[0.06] p-4">
            <div className="flex items-start gap-2">
              <TriangleAlert className="mt-0.5 size-4 text-orange-300" />

              <div>
                <div className="text-sm font-medium text-white">
                  Add measurable impact
                </div>

                <div className="mt-1 text-xs text-white/60">
                  Recruiters prefer numbers, metrics and business outcomes.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] p-4">
            <div className="flex items-start gap-2">
              <TrendingUp className="mt-0.5 size-4 text-cyan-300" />

              <div>
                <div className="text-sm font-medium text-white">
                  ATS optimization
                </div>

                <div className="mt-1 text-xs text-white/60">
                  Add keywords like Docker, CI/CD and System Design.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.05] p-4">
            <div className="flex items-start gap-2">
              <BadgeCheck className="mt-0.5 size-4 text-emerald-300" />

              <div>
                <div className="text-sm font-medium text-white">
                  Strong AI portfolio
                </div>

                <div className="mt-1 text-xs text-white/60">
                  Your AI projects already stand out compared to many junior resumes.
                </div>
              </div>
            </div>
          </div>

        </div>
      </Card>
    </div>
  );
}

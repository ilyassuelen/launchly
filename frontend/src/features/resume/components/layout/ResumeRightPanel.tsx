import {
  Target,
  LayoutTemplate,
  Sparkles,
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
  analysis: any;
  typography: any;
  updateTypography: (
    updates: any,
  ) => void;
};

export function ResumeRightPanel({
  resume,
  setResume,
  analysis,
  typography,
  updateTypography,
}: Props) {
  const atsScore =
    analysis?.ats_score?.score || 0;

  const atsBreakdown =
    analysis?.ats_score?.breakdown;
  return (
    <div className="space-y-4 lg:col-span-2">

      <Card>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Target className="size-4 text-cyan-300" />
          ATS Score
        </div>

        <div className="flex items-end gap-2">
          <div className="text-5xl font-semibold tracking-tight">
            {atsScore}
          </div>

          <div className="mb-2 text-sm text-muted-foreground">
            /100
          </div>
        </div>

        <Progress
          value={atsScore}
          color={
            atsScore >= 80
              ? "green"
              : atsScore >= 60
                ? "yellow"
                : "red"
          }
        />

        {atsBreakdown && (
          <div className="mt-4 space-y-2">

            <div className="flex justify-between text-xs text-white/70">
              <span>Completeness</span>
              <span>{atsBreakdown.completeness}/20</span>
            </div>

            <div className="flex justify-between text-xs text-white/70">
              <span>Keyword Relevance</span>
              <span>{atsBreakdown.keyword_relevance}/25</span>
            </div>

            <div className="flex justify-between text-xs text-white/70">
              <span>Experience Quality</span>
              <span>{atsBreakdown.experience_quality}/25</span>
            </div>

            <div className="flex justify-between text-xs text-white/70">
              <span>Formatting</span>
              <span>{atsBreakdown.formatting}/15</span>
            </div>

            <div className="flex justify-between text-xs text-white/70">
              <span>Readability</span>
              <span>{atsBreakdown.readability}/15</span>
            </div>

          </div>
        )}
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


    </div>
  );
}

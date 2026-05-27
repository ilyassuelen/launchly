import {
  LayoutTemplate,
} from "lucide-react";

import {
  Card,
} from "@/components/launchly/AppShell";

import type { CoverLetter } from "@/features/cover-letter/types/coverLetter";

import { FONT_OPTIONS } from "@/features/resume/constants/typography";

const templates = [
  {
    id: "classic",
    n: "Classic",
    c: "from-slate-300 to-slate-100",
  },
  {
    id: "modern",
    n: "Modern",
    c: "from-violet-500 to-cyan-400",
  },
  {
    id: "minimal",
    n: "Minimal",
    c: "from-zinc-200 to-zinc-50",
  },
  {
    id: "startup",
    n: "Startup",
    c: "from-fuchsia-500 to-cyan-400",
  },
];

type Props = {
  coverLetter: CoverLetter;

  setCoverLetter: any;

  typography: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
  };

  updateTypography: (
    updates: Partial<{
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
    }>,
  ) => void;
};

export function CoverLetterRightPanel({
  coverLetter,
  setCoverLetter,
  typography,
  updateTypography,
}: Props) {
  return (
    <div className="space-y-4 lg:col-span-2">

      {/* TEMPLATES */}
      <Card>

        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">

          <LayoutTemplate className="size-4 text-violet-300" />

          Templates

        </div>

        <div className="grid grid-cols-2 gap-3">

          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() =>
                setCoverLetter((prev: CoverLetter) => ({
                  ...prev,
                  template: t.id,
                }))
              }
              className={`rounded-2xl border p-2 transition ${
                coverLetter.template === t.id
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

      {/* TYPOGRAPHY */}
      <Card>

        <div className="mb-4 flex items-center gap-2 text-sm font-semibold">

          <LayoutTemplate className="size-4 text-violet-300" />

          Typography

        </div>

        <div className="space-y-5">

          {/* FONT FAMILY */}
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
                    typography.fontFamily === font.value
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

          {/* FONT SIZE */}
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
              min={12}
              max={18}
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

          {/* LINE HEIGHT */}
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
              min={1.3}
              max={2.2}
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
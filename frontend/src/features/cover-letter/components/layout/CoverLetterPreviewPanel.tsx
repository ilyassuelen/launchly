import {
  Copy,
  Download,
  Loader2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { useState } from "react";

import {
  Card,
} from "@/components/launchly/AppShell";

import { useI18n } from "@/i18n/I18nContext";

import { exportCoverLetterPdf } from "@/features/cover-letter/api/coverLetterPdfApi";
import { CoverLetterRenderer } from "@/components/cover-letter/CoverLetterRenderer";

import type { CoverLetter } from "@/features/cover-letter/types/coverLetter";

interface Props {
  coverLetter: CoverLetter;

  zoom: number;

  setZoom: (
    value:
      | number
      | ((
          prev: number,
        ) => number),
  ) => void;

  saveStatus:
    | "idle"
    | "saving"
    | "saved";

  handleSaveCoverLetter: () => void | Promise<void>;

  printRef: React.RefObject<HTMLDivElement | null>;
}

export function CoverLetterPreviewPanel({
  coverLetter,

  zoom,

  setZoom,

  saveStatus,

  handleSaveCoverLetter,

  printRef,
}: Props) {
  const { t } = useI18n();
  const [isExporting, setIsExporting] = useState(false);

  return (
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
              {t("coverLetter.liveLetterPreview")}
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              {t("coverLetter.liveLetterPreviewDescription")}
            </div>
          </div>

          {/* toolbar */}
          <div className="flex justify-center">

            <div className="flex items-center gap-1 rounded-[22px] border border-white/10 bg-white/[0.06] p-1.5 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">


              <div className="mx-1 h-5 w-px bg-white/10" />

              <button
                onClick={() =>
                  setZoom((prev) =>
                    Math.max(
                      0.5,
                      prev - 0.05,
                    ),
                  )
                }
                className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              >
                <ZoomOut className="size-4" />
              </button>

              <button
                onClick={() =>
                  setZoom((prev) =>
                    Math.min(
                      1.4,
                      prev + 0.05,
                    ),
                  )
                }
                className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              >
                <ZoomIn className="size-4" />
              </button>

              <div className="mx-1 h-5 w-px bg-white/10" />

              <button className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white">
                <Copy className="size-4" />
              </button>

              <button
                disabled={isExporting}
                onClick={async () => {
                  try {
                    setIsExporting(true);

                    await handleSaveCoverLetter();
                    await exportCoverLetterPdf(
                      coverLetter.id,
                    );
                  } finally {
                    setIsExporting(false);
                  }
                }}
                className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isExporting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
              </button>

              <div className="mx-1 h-5 w-px bg-white/10" />

              <button
                onClick={
                  handleSaveCoverLetter
                }
                className="
                  rounded-xl
                  bg-gradient-brand
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-primary-foreground
                  shadow-[0_10px_40px_rgba(168,85,247,0.35)]
                "
              >
                {saveStatus ===
                "saving"
                  ? t("common.saving")
                  : saveStatus ===
                      "saved"
                    ? t("resume.saved")
                    : t("common.save")}
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

          <div
            className="relative transition-all duration-300"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
          >

            {/* atmosphere */}
            <div className="absolute inset-0 translate-y-8 scale-[0.95] rounded-[50px] bg-black/60 blur-3xl" />

            <div
              ref={printRef}
              className="relative w-full max-w-[850px]"
            >
              <CoverLetterRenderer
                coverLetter={
                  coverLetter
                }
              />
            </div>

          </div>
        </div>
      </div>
    </Card>
  );
}
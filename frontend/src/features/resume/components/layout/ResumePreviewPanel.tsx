import {
  Wand2,
  Download,
  Loader2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { useState } from "react";

import { exportResumePdf } from "@/features/resume/api/resumePdfApi";

import { Card } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";

import { ResumePreview } from "@/components/resume/ResumePreview";

type Props = {
  resume: any;
  zoom: number;
  setZoom: React.Dispatch<
    React.SetStateAction<number>
  >;

  hasOverflow: boolean;

  saveStatus:
    | "idle"
    | "saving"
    | "saved";

  handleSaveResume: () => void | Promise<void>;

  printRef: React.RefObject<HTMLDivElement>;
  previewContentRef: React.RefObject<HTMLDivElement>;
};

export function ResumePreviewPanel({
  resume,
  zoom,
  setZoom,
  hasOverflow,
  saveStatus,
  handleSaveResume,
  printRef,
  previewContentRef,
}: Props) {
  const { t } = useI18n();
  const [isExporting, setIsExporting] = useState(false);
  return (
    <Card className="relative flex h-[calc(100vh-120px)] min-h-[900px] flex-col overflow-hidden p-0 lg:col-span-7">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_40%)]" />

      <div className="flex items-center justify-between px-6 pb-4 pt-6">

        <div>
          <div className="text-sm font-semibold">
            {t("resume.liveDocumentPreview")}
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            {t("resume.recruiterReadyFormatting")}
          </div>
        </div>

        <div className="relative z-50 rounded-2xl border border-white/10 bg-black/30 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">

          <div className="flex items-center gap-1">

            <button
              onClick={() =>
                setZoom((prev) =>
                  Math.max(0.45, prev - 0.1),
                )
              }
              className="grid size-9 place-items-center rounded-xl border border-transparent bg-white/[0.03] transition hover:border-white/10 hover:bg-white/[0.08]"
            >
              <ZoomOut className="size-4" />
            </button>

            <button
              onClick={() =>
                setZoom((prev) =>
                  Math.min(1.2, prev + 0.1),
                )
              }
              className="grid size-9 place-items-center rounded-xl border border-transparent bg-white/[0.03] transition hover:border-white/10 hover:bg-white/[0.08]"
            >
              <ZoomIn className="size-4" />
            </button>

            <div className="mx-1 h-5 w-px bg-white/10" />

            <button
              onClick={handleSaveResume}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              <Wand2 className="size-4" />

              {saveStatus === "saving"
                ? t("common.saving")
                : saveStatus === "saved"
                  ? t("resume.saved")
                  : t("common.save")}
            </button>

            <button
              disabled={isExporting}
              onClick={async () => {
                try {
                  setIsExporting(true);

                  await handleSaveResume();
                  await exportResumePdf(resume.id);
                } finally {
                  setIsExporting(false);
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(168,85,247,0.35)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExporting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="size-4" />
                  {t("resume.export")}
                </>
              )}
            </button>

          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden border-t border-white/5">

        <div className="flex h-full items-start justify-center overflow-auto bg-[#070b16] px-6 py-6">

          <div
            className="relative flex justify-center transition-transform duration-200"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
          >

            {hasOverflow && (
              <div
                className="pointer-events-none absolute left-0 right-0 z-10 border-t-2 border-dashed border-red-400/70"
                style={{
                  top: "1123px",
                }}
              >
                <div className="absolute -top-3 right-4 rounded-full border border-red-400/30 bg-red-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-200 backdrop-blur-xl">
                  {t("resume.contentExceedsA4")}
                </div>
              </div>
            )}

            <div
              className="relative overflow-hidden rounded-[6px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
              style={{
                width: "794px",
                minHeight: "1123px",
              }}
            >
              <div
                ref={(node) => {
                  printRef.current = node;
                  previewContentRef.current =
                    node;
                }}
              >
                <ResumePreview
                  resume={resume}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </Card>
  );
}
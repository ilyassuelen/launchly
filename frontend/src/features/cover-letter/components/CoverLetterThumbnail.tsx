import {
  Clock3,
} from "lucide-react";

import { useI18n } from "@/i18n/I18nContext";

type Props = {
  coverLetter: any;
};

export function CoverLetterThumbnail({
  coverLetter,
}: Props) {
  const { t } = useI18n();
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1020] transition hover:border-violet-400/30 hover:bg-[#0D1326]">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_35%)]" />

      {/* preview */}
      <div className="block">
        <div className="relative p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">
                {
                  coverLetter.recipient?.companyName ||
                  t("coverLetter.newCompany")
                }
              </div>

              <div className="mt-1 text-xs text-white/50">
                {
                  coverLetter.content?.subject ||
                  t("coverLetter.coverLetter")
                }
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-white/60">
              {
                coverLetter.tone
              }
            </div>
          </div>

          {/* paper preview */}
          <div className="mt-5 flex justify-center">
            <div className="aspect-[210/297] w-full max-w-[240px] overflow-hidden rounded-[18px] border border-black/5 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <div className="p-5">
                <div className="h-3 w-28 rounded-full bg-black/80" />

                <div className="mt-6 space-y-2">
                  <div className="h-2 rounded-full bg-black/10" />
                  <div className="h-2 rounded-full bg-black/10" />
                  <div className="h-2 w-[90%] rounded-full bg-black/10" />
                </div>

                <div className="mt-6 space-y-2">
                  <div className="h-2 rounded-full bg-black/10" />
                  <div className="h-2 rounded-full bg-black/10" />
                  <div className="h-2 w-[80%] rounded-full bg-black/10" />
                </div>

                <div className="mt-6 space-y-2">
                  <div className="h-2 rounded-full bg-black/10" />
                  <div className="h-2 rounded-full bg-black/10" />
                  <div className="h-2 w-[85%] rounded-full bg-black/10" />
                </div>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Clock3 className="size-3" />
              {t("coverLetter.updatedRecently")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
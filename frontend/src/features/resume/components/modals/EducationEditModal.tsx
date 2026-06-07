import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { ResumeTextarea } from "@/features/resume/components/ui/ResumeTextarea";
import { useI18n } from "@/i18n/I18nContext";

type EducationEditModalProps = {
  open: boolean;

  school: string;

  degree: string;

  startDate?: string;

  endDate?: string;

  description?: string;

  bullets: string[];

  onChangeSchool: (
    value: string,
  ) => void;

  onChangeDegree: (
    value: string,
  ) => void;

  onChangeStartDate: (
    value: string,
  ) => void;

  onChangeEndDate: (
    value: string,
  ) => void;

  onChangeDescription?: (
    value: string,
  ) => void;

  onChangeBullet: (
    index: number,
    value: string,
  ) => void;

  onAddBullet: () => void;

  onClose: () => void;

  onSave: () => void;
};

export function EducationEditModal({
  open,

  school,

  degree,

  startDate,

  endDate,

  description,

  bullets,

  onChangeSchool,

  onChangeDegree,

  onChangeStartDate,

  onChangeEndDate,

  onChangeDescription,

  onChangeBullet,

  onAddBullet,

  onClose,

  onSave,
}: EducationEditModalProps) {
  const { t } = useI18n();

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className="flex max-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[rgb(13,17,29)] shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-6 border-b border-white/10 px-7 py-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {school || t("resume.editEducation")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              {t("resume.educationModalSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            aria-label={t("common.cancel")}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              {t("resume.school")}
            </label>
            <ResumeInput
              value={school}
              onChange={(e) =>
                onChangeSchool(
                  e.target.value,
                )
              }
              placeholder={t("resume.schoolPlaceholder")}
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-white/80">
              {t("resume.degree")}
            </label>
            <ResumeInput
              value={degree}
              onChange={(e) =>
                onChangeDegree(
                  e.target.value,
                )
              }
              placeholder={t("resume.degreePlaceholder")}
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                {t("resume.startDate")}
              </label>
              <ResumeInput
                value={startDate || ""}
                onChange={(e) =>
                  onChangeStartDate(
                    e.target.value,
                  )
                }
                placeholder={t("resume.startDatePlaceholder")}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                {t("resume.endDate")}
              </label>
              <ResumeInput
                value={endDate || ""}
                onChange={(e) =>
                  onChangeEndDate(
                    e.target.value,
                  )
                }
                placeholder={t("resume.endDatePlaceholder")}
              />
            </div>
          </div>

          {onChangeDescription && (
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-white/80">
                {t("resume.description")}
              </label>
              <ResumeTextarea
                value={description || ""}
                onChange={(e) =>
                  onChangeDescription(
                    e.target.value,
                  )
                }
                rows={5}
                placeholder={t("resume.educationDescriptionPlaceholder")}
              />
            </div>
          )}

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium text-white/80">
                {t("resume.impactBullets")}
              </label>

              <button
                type="button"
                onClick={onAddBullet}
                className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.10] px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.16]"
              >
                {t("resume.addBullet")}
              </button>
            </div>

            <div className="space-y-4">
              {bullets.map((bullet, index) => (
                <div key={index}>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    {t("resume.bulletNumber", {
                      count: index + 1,
                    })}
                  </label>

                  <ResumeTextarea
                    value={bullet}
                    onChange={(e) =>
                      onChangeBullet(
                        index,
                        e.target.value,
                      )
                    }
                    rows={4}
                    placeholder={t("resume.bulletPlaceholder")}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-7 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:bg-white/[0.04] hover:text-white"
          >
            {t("common.cancel")}
          </button>

          <button
            type="button"
            onClick={onSave}
            className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.10] px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.16]"
          >
            {t("common.saveChanges")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
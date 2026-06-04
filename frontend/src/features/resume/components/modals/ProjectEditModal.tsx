import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { ResumeTextarea } from "@/features/resume/components/ui/ResumeTextarea";
import { useI18n } from "@/i18n/I18nContext";

type ProjectEditModalProps = {
  open: boolean;

  title: string;

  stack: string;

  bullets: string[];

  links?: string[];

  onChangeTitle: (
    value: string,
  ) => void;

  onChangeStack: (
    value: string,
  ) => void;

  onChangeBullet: (
    index: number,
    value: string,
  ) => void;

  onAddBullet: () => void;

  onChangeLink?: (
    index: number,
    value: string,
  ) => void;

  onAddLink?: () => void;

  onClose: () => void;

  onSave: () => void;
};

export function ProjectEditModal({
  open,

  title,

  stack,

  bullets,

  links = [],

  onChangeTitle,

  onChangeStack,

  onChangeBullet,

  onAddBullet,

  onChangeLink,

  onAddLink,

  onClose,

  onSave,
}: ProjectEditModalProps) {
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
              {title || t("resume.editProject")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              {t("resume.projectModalSubtitle")}
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
              {t("resume.projectTitle")}
            </label>
            <ResumeInput
              value={title}
              onChange={(e) =>
                onChangeTitle(
                  e.target.value,
                )
              }
              placeholder={t("resume.projectTitlePlaceholder")}
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-white/80">
              {t("resume.techStack")}
            </label>
            <ResumeInput
              value={stack}
              onChange={(e) =>
                onChangeStack(
                  e.target.value,
                )
              }
              placeholder={t("resume.techStackPlaceholder")}
            />
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <label className="block text-sm font-medium text-white/80">
                {t("resume.projectBullets")}
              </label>

              <button
                type="button"
                onClick={onAddBullet}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/[0.06] hover:text-white"
              >
                {t("resume.addBullet")}
              </button>
            </div>

            <div className="space-y-4">
              {bullets.map(
                (bullet, index) => (
                  <div key={index}>
                    <label className="mb-2 block text-xs font-medium text-white/50">
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
                      placeholder={t("resume.projectBulletPlaceholder")}
                    />
                  </div>
                ),
              )}
            </div>
          </div>

          {onChangeLink && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium text-white/80">
                  {t("resume.projectLinks")}
                </label>

                {onAddLink && (
                  <button
                    type="button"
                    onClick={onAddLink}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    {t("resume.addLink")}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {links.map((link, index) => (
                  <div key={index}>
                    <label className="mb-2 block text-xs font-medium text-white/50">
                      {t("resume.linkNumber", {
                        count: index + 1,
                      })}
                    </label>
                    <ResumeInput
                      value={link}
                      onChange={(e) =>
                        onChangeLink(
                          index,
                          e.target.value,
                        )
                      }
                      placeholder={t("resume.projectLinkPlaceholder")}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
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
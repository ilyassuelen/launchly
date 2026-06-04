import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { useI18n } from "@/i18n/I18nContext";

type SkillEditorModalProps = {
  editingSkillId: string | null;

  skillDraftName: string;
  setSkillDraftName: (
    value: string,
  ) => void;

  skillKeywordInput: string;
  setSkillKeywordInput: (
    value: string,
  ) => void;

  skillDraftKeywords: string[];

  addSkillKeyword: () => void;

  removeSkillKeyword: (
    keyword: string,
  ) => void;

  saveSkillEditor: () => void;

  setEditingSkillId: (
    value: string | null,
  ) => void;
};

export function SkillEditorModal({
  editingSkillId,

  skillDraftName,
  setSkillDraftName,

  skillKeywordInput,
  setSkillKeywordInput,

  skillDraftKeywords,

  addSkillKeyword,

  removeSkillKeyword,

  saveSkillEditor,

  setEditingSkillId,
}: SkillEditorModalProps) {
  const { t } = useI18n();

  if (!editingSkillId) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[rgb(13,17,29)] shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-6 border-b border-white/10 px-7 py-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {t("resume.editTechnicalSkill")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              {t("resume.editTechnicalSkillDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingSkillId(
                null,
              )
            }
            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            aria-label={t("common.cancel")}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-7 py-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              {t("resume.skillCategory")}
            </label>
            <ResumeInput
              value={skillDraftName}
              onChange={(e) =>
                setSkillDraftName(
                  e.target.value,
                )
              }
              placeholder={t("resume.skillCategoryPlaceholder")}
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-white/80">
              {t("resume.keywords")}
            </label>
            <ResumeInput
              value={skillKeywordInput}
              onChange={(e) =>
                setSkillKeywordInput(
                  e.target.value,
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key ===
                  "Enter"
                ) {
                  e.preventDefault();

                  addSkillKeyword();
                }
              }}
              placeholder={t("resume.keywordInputPlaceholder")}
            />

            <p className="mt-2 text-xs leading-5 text-white/40">
              {t("resume.keywordHelperText")}
            </p>

            {skillDraftKeywords.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {skillDraftKeywords.map(
                  (keyword) => (
                    <div
                      key={keyword}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-white/70"
                    >
                      {keyword}

                      <button
                        type="button"
                        onClick={() =>
                          removeSkillKeyword(
                            keyword,
                          )
                        }
                        className="text-white/40 transition hover:text-red-300"
                        aria-label={t("common.cancel")}
                      >
                        ✕
                      </button>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-7 py-5">
          <button
            type="button"
            onClick={() =>
              setEditingSkillId(
                null,
              )
            }
            className="rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:bg-white/[0.04] hover:text-white"
          >
            {t("common.cancel")}
          </button>

          <button
            type="button"
            onClick={saveSkillEditor}
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

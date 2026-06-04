import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { useI18n } from "@/i18n/I18nContext";

type LanguageItem = {
  id: string | number;
  name: string;
  level: string;
};

type LanguageEditModalProps = {
  open: boolean;
  language: LanguageItem | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (
    field: "name" | "level",
    value: string,
  ) => void;
};

export function LanguageEditModal({
  open,
  language,
  onClose,
  onSave,
  onChange,
}: LanguageEditModalProps) {
  const { t } = useI18n();
  if (!open || !language) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[rgb(13,17,29)] shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-6 border-b border-white/10 px-7 py-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {t("resume.editLanguage")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              {t("resume.languageModalSubtitle")}
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

        <div className="px-7 py-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              {t("resume.language")}
            </label>
            <ResumeInput
              value={language.name}
              onChange={(e) =>
                onChange(
                  "name",
                  e.target.value,
                )
              }
              placeholder={t("resume.languagePlaceholder")}
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-white/80">
              {t("resume.proficiencyLevel")}
            </label>
            <ResumeInput
              value={language.level}
              onChange={(e) =>
                onChange(
                  "level",
                  e.target.value,
                )
              }
              placeholder={t("resume.proficiencyLevelPlaceholder")}
            />
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
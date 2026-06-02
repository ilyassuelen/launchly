import { Globe2 } from "lucide-react";

import { ResumeEditModal } from "@/features/resume/components/ui/ResumeEditModal";
import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { ResumeFieldGroup } from "@/features/resume/components/ui/ResumeFieldGroup";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";
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
  if (!language) {
    return null;
  }

  return (
    <ResumeEditModal
      open={open}
      title={t("resume.editLanguage")}
      subtitle={t("resume.languageModalSubtitle")}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <ResumeActionButton
            variant="ghost"
            onClick={onClose}
          >
            {t("common.cancel")}
          </ResumeActionButton>

          <ResumeActionButton
            icon={<Globe2 className="size-4" />}
            variant="primary"
            onClick={onSave}
          >
            {t("common.saveChanges")}
          </ResumeActionButton>
        </div>
      }
    >
      <div className="space-y-6">

        <ResumeFieldGroup label={t("resume.language")}>
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
        </ResumeFieldGroup>

        <ResumeFieldGroup label={t("resume.proficiencyLevel")}>
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
        </ResumeFieldGroup>

      </div>
    </ResumeEditModal>
  );
}
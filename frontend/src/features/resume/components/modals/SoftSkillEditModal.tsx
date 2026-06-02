import {
  Brain,
} from "lucide-react";

import { ResumeEditModal } from "@/features/resume/components/ui/ResumeEditModal";
import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { ResumeFieldGroup } from "@/features/resume/components/ui/ResumeFieldGroup";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";
import { useI18n } from "@/i18n/I18nContext";

type SoftSkillItem = {
  id: string | number;
  name: string;
};

type SoftSkillEditModalProps = {
  open: boolean;

  softSkill: SoftSkillItem | null;

  onClose: () => void;

  onSave: () => void;

  onChange?: (
    field: "name",
    value: string,
  ) => void;
};

export function SoftSkillEditModal({
  open,
  softSkill,
  onClose,
  onSave,
  onChange,
}: SoftSkillEditModalProps) {
  const { t } = useI18n();
  if (!softSkill) {
    return null;
  }

  return (
    <ResumeEditModal
      open={open}
      title={t("resume.editSoftSkill")}
      subtitle={t("resume.softSkillModalSubtitle")}
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
            icon={<Brain className="size-4" />}
            variant="primary"
            onClick={onSave}
          >
            {t("common.saveChanges")}
          </ResumeActionButton>
        </div>
      }
    >
      <div className="space-y-6">

        <ResumeFieldGroup label={t("resume.softSkill")}>
          <ResumeInput
            value={softSkill.name}
            onChange={(e) =>
              onChange?.(
                "name",
                e.target.value,
              )
            }
            placeholder={t("resume.softSkillPlaceholder")}
          />
        </ResumeFieldGroup>

      </div>
    </ResumeEditModal>
  );
}
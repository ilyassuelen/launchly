import { GraduationCap } from "lucide-react";

import { ResumeEditModal } from "@/features/resume/components/ui/ResumeEditModal";
import { ResumeFieldGroup } from "@/features/resume/components/ui/ResumeFieldGroup";
import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { ResumeTextarea } from "@/features/resume/components/ui/ResumeTextarea";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";
import { useI18n } from "@/i18n/I18nContext";

type EducationEditModalProps = {
  open: boolean;

  school: string;

  degree: string;

  startDate?: string;

  endDate?: string;

  description?: string;

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

  onChangeSchool,

  onChangeDegree,

  onChangeStartDate,

  onChangeEndDate,

  onChangeDescription,

  onClose,

  onSave,
}: EducationEditModalProps) {
  const { t } = useI18n();
  return (
    <ResumeEditModal
      open={open}
      title={
        school || t("resume.editEducation")
      }
      subtitle={t("resume.educationModalSubtitle")}
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
            icon={<GraduationCap className="size-4" />}
            variant="primary"
            onClick={onSave}
          >
            {t("common.saveChanges")}
          </ResumeActionButton>
        </div>
      }
    >
      <div className="space-y-6">

        <ResumeFieldGroup label={t("resume.school")}>
          <ResumeInput
            value={school}
            onChange={(e) =>
              onChangeSchool(
                e.target.value,
              )
            }
            placeholder={t("resume.schoolPlaceholder")}
          />
        </ResumeFieldGroup>

        <ResumeFieldGroup label={t("resume.degree")}>
          <ResumeInput
            value={degree}
            onChange={(e) =>
              onChangeDegree(
                e.target.value,
              )
            }
            placeholder={t("resume.degreePlaceholder")}
          />
        </ResumeFieldGroup>

        <div className="grid gap-5 md:grid-cols-2">

          <ResumeFieldGroup label={t("resume.startDate")}>
            <ResumeInput
              value={startDate || ""}
              onChange={(e) =>
                onChangeStartDate(
                  e.target.value,
                )
              }
              placeholder={t("resume.startDatePlaceholder")}
            />
          </ResumeFieldGroup>

          <ResumeFieldGroup label={t("resume.endDate")}>
            <ResumeInput
              value={endDate || ""}
              onChange={(e) =>
                onChangeEndDate(
                  e.target.value,
                )
              }
              placeholder={t("resume.endDatePlaceholder")}
            />
          </ResumeFieldGroup>
        </div>

        {onChangeDescription && (
          <ResumeFieldGroup label={t("resume.description")}>
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
          </ResumeFieldGroup>
        )}
      </div>
    </ResumeEditModal>
  );
}
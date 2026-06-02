import {
  BriefcaseBusiness,
  Plus,
} from "lucide-react";

import { ResumeEditModal } from "@/features/resume/components/ui/ResumeEditModal";
import { ResumeFieldGroup } from "@/features/resume/components/ui/ResumeFieldGroup";
import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { ResumeTextarea } from "@/features/resume/components/ui/ResumeTextarea";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";

import { useI18n } from "@/i18n/I18nContext";

type ExperienceEditModalProps = {
  open: boolean;

  company: string;

  role: string;

  startDate?: string;

  endDate?: string;

  summary?: string;

  bullets: string[];

  onChangeCompany: (
    value: string,
  ) => void;

  onChangeRole: (
    value: string,
  ) => void;

  onChangeStartDate: (
    value: string,
  ) => void;

  onChangeEndDate: (
    value: string,
  ) => void;

  onChangeSummary?: (
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

export function ExperienceEditModal({
  open,

  company,

  role,

  startDate,

  endDate,

  summary,

  bullets,

  onChangeCompany,

  onChangeRole,

  onChangeStartDate,

  onChangeEndDate,

  onChangeSummary,

  onChangeBullet,

  onAddBullet,

  onClose,

  onSave,
}: ExperienceEditModalProps) {
  const { t } = useI18n();
  return (
    <ResumeEditModal
      open={open}
      title={
        role || t("resume.editExperience")
      }
      subtitle={t("resume.experienceModalSubtitle")}
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
            icon={<BriefcaseBusiness className="size-4" />}
            variant="primary"
            onClick={onSave}
          >
            {t("common.saveChanges")}
          </ResumeActionButton>
        </div>
      }
    >
      <div className="space-y-6">

        <ResumeFieldGroup label={t("resume.company")}>
          <ResumeInput
            value={company}
            onChange={(e) =>
              onChangeCompany(
                e.target.value,
              )
            }
            placeholder={t("resume.companyPlaceholder")}
          />
        </ResumeFieldGroup>

        <ResumeFieldGroup label={t("resume.role")}>
          <ResumeInput
            value={role}
            onChange={(e) =>
              onChangeRole(
                e.target.value,
              )
            }
            placeholder={t("resume.rolePlaceholder")}
          />
        </ResumeFieldGroup>

        <div className="grid gap-4 md:grid-cols-2">

          <ResumeFieldGroup label={t("resume.startDate")}>
            <ResumeInput
              value={startDate || ""}
              onChange={(e) =>
                onChangeStartDate(
                  e.target.value,
                )
              }
              placeholder={t("resume.experienceStartDatePlaceholder")}
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

        {onChangeSummary && (
          <ResumeFieldGroup label={t("resume.summary")}>
            <ResumeTextarea
              value={summary || ""}
              onChange={(e) =>
                onChangeSummary(
                  e.target.value,
                )
              }
              rows={5}
              placeholder={t("resume.experienceSummaryPlaceholder")}
            />
          </ResumeFieldGroup>
        )}

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">
              {t("resume.impactBullets")}
            </div>

            <ResumeActionButton
              icon={<Plus className="size-4" />}
              variant="primary"
              onClick={onAddBullet}
            >
              {t("resume.addBullet")}
            </ResumeActionButton>
          </div>

          <div className="space-y-5">
            {bullets.map(
              (bullet, index) => (
                <ResumeFieldGroup
                  key={index}
                  label={t("resume.bulletNumber", {
                    count: index + 1,
                  })}
                >
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
                </ResumeFieldGroup>
              ),
            )}
          </div>
        </div>
      </div>
    </ResumeEditModal>
  );
}
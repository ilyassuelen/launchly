import {
  FolderKanban,
  Link2,
  Plus,
} from "lucide-react";

import { ResumeEditModal } from "@/features/resume/components/ui/ResumeEditModal";
import { ResumeFieldGroup } from "@/features/resume/components/ui/ResumeFieldGroup";
import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { ResumeTextarea } from "@/features/resume/components/ui/ResumeTextarea";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";
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
  return (
    <ResumeEditModal
      open={open}
      title={
        title || t("resume.editProject")
      }
      subtitle={t("resume.projectModalSubtitle")}
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
            icon={<FolderKanban className="size-4" />}
            variant="primary"
            onClick={onSave}
          >
            {t("common.saveChanges")}
          </ResumeActionButton>
        </div>
      }
    >
      <div className="space-y-6">

        <ResumeFieldGroup label={t("resume.projectTitle")}>
          <ResumeInput
            value={title}
            onChange={(e) =>
              onChangeTitle(
                e.target.value,
              )
            }
            placeholder={t("resume.projectTitlePlaceholder")}
          />
        </ResumeFieldGroup>

        <ResumeFieldGroup label={t("resume.techStack")}>
          <ResumeInput
            value={stack}
            onChange={(e) =>
              onChangeStack(
                e.target.value,
              )
            }
            placeholder={t("resume.techStackPlaceholder")}
          />
        </ResumeFieldGroup>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">
              {t("resume.projectBullets")}
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
                    placeholder={t("resume.projectBulletPlaceholder")}
                  />
                </ResumeFieldGroup>
              ),
            )}
          </div>
        </div>

        {onChangeLink && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">
                {t("resume.projectLinks")}
              </div>

              {onAddLink && (
                <ResumeActionButton
                  icon={<Link2 className="size-4" />}
                  variant="primary"
                  onClick={onAddLink}
                >
                  {t("resume.addLink")}
                </ResumeActionButton>
              )}
            </div>

            <div className="space-y-5">
              {links.map((link, index) => (
                <ResumeFieldGroup
                  key={index}
                  label={t("resume.linkNumber", {
                    count: index + 1,
                  })}
                >
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
                </ResumeFieldGroup>
              ))}
            </div>
          </div>
        )}
      </div>
    </ResumeEditModal>
  );
}
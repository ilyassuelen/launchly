import {
  Github,
  Linkedin,
  User,
} from "lucide-react";

import { ResumeEditModal } from "@/features/resume/components/ui/ResumeEditModal";
import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { ResumeFieldGroup } from "@/features/resume/components/ui/ResumeFieldGroup";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";
import { useI18n } from "@/i18n/I18nContext";

type ProfileItem = {
  id: string | number;
  platform: string;
  url: string;
  label: string;
};

type ProfileEditModalProps = {
  open: boolean;
  profile: ProfileItem | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (
    field:
      | "platform"
      | "url"
      | "label",
    value: string,
  ) => void;
};

function getProfileIcon(
  platform?: string,
) {
  const normalized =
    platform?.toLowerCase();

  if (normalized === "linkedin") {
    return Linkedin;
  }

  if (normalized === "github") {
    return Github;
  }

  return User;
}

export function ProfileEditModal({
  open,
  profile,
  onClose,
  onSave,
  onChange,
}: ProfileEditModalProps) {
  const { t } = useI18n();
  if (!profile) {
    return null;
  }

  const Icon = getProfileIcon(
    profile.platform,
  );

  return (
    <ResumeEditModal
      open={open}
      title={t("resume.editProfile")}
      subtitle={t("resume.profileModalSubtitle")}
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
            icon={<Icon className="size-4" />}
            variant="primary"
            onClick={onSave}
          >
            {t("common.saveChanges")}
          </ResumeActionButton>
        </div>
      }
    >
      <div className="space-y-6">

        <ResumeFieldGroup label={t("resume.platform")}>
          <ResumeInput
            value={profile.platform}
            onChange={(e) =>
              onChange(
                "platform",
                e.target.value,
              )
            }
            placeholder={t("resume.platformPlaceholder")}
          />
        </ResumeFieldGroup>

        <ResumeFieldGroup label={t("resume.profileUrl")}>
          <ResumeInput
            value={profile.url}
            onChange={(e) =>
              onChange(
                "url",
                e.target.value,
              )
            }
            placeholder="https://..."
          />
        </ResumeFieldGroup>

        <ResumeFieldGroup label={t("resume.displayLabel")}>
          <ResumeInput
            value={profile.label}
            onChange={(e) =>
              onChange(
                "label",
                e.target.value,
              )
            }
            placeholder={t("resume.displayLabelPlaceholder")}
          />
        </ResumeFieldGroup>

      </div>
    </ResumeEditModal>
  );
}
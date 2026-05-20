import { Globe2 } from "lucide-react";

import { ResumeEditModal } from "@/features/resume/components/ui/ResumeEditModal";
import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { ResumeFieldGroup } from "@/features/resume/components/ui/ResumeFieldGroup";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";

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
  if (!language) {
    return null;
  }

  return (
    <ResumeEditModal
      open={open}
      title="Edit Language"
      subtitle="Manage language information and proficiency level."
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <ResumeActionButton
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </ResumeActionButton>

          <ResumeActionButton
            icon={<Globe2 className="size-4" />}
            variant="primary"
            onClick={onSave}
          >
            Save Changes
          </ResumeActionButton>
        </div>
      }
    >
      <div className="space-y-6">

        <ResumeFieldGroup label="Language">
          <ResumeInput
            value={language.name}
            onChange={(e) =>
              onChange(
                "name",
                e.target.value,
              )
            }
            placeholder="e.g. English"
          />
        </ResumeFieldGroup>

        <ResumeFieldGroup label="Proficiency Level">
          <ResumeInput
            value={language.level}
            onChange={(e) =>
              onChange(
                "level",
                e.target.value,
              )
            }
            placeholder="e.g. Fluent"
          />
        </ResumeFieldGroup>

      </div>
    </ResumeEditModal>
  );
}
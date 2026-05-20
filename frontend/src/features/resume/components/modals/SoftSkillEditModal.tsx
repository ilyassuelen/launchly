import {
  Brain,
} from "lucide-react";

import { ResumeEditModal } from "@/features/resume/components/ui/ResumeEditModal";
import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { ResumeFieldGroup } from "@/features/resume/components/ui/ResumeFieldGroup";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";

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
  if (!softSkill) {
    return null;
  }

  return (
    <ResumeEditModal
      open={open}
      title="Edit Soft Skill"
      subtitle="Manage your soft skill information."
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
            icon={<Brain className="size-4" />}
            variant="primary"
            onClick={onSave}
          >
            Save Changes
          </ResumeActionButton>
        </div>
      }
    >
      <div className="space-y-6">

        <ResumeFieldGroup label="Soft Skill">
          <ResumeInput
            value={softSkill.name}
            onChange={(e) =>
              onChange?.(
                "name",
                e.target.value,
              )
            }
            placeholder="e.g. Communication"
          />
        </ResumeFieldGroup>

      </div>
    </ResumeEditModal>
  );
}
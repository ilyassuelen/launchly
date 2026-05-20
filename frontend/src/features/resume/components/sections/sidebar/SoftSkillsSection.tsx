import {
  Brain,
  Sparkles,
  Plus,
} from "lucide-react";

import { ResumeEditorSection } from "@/features/resume/components/ui/ResumeEditorSection";
import { ResumeListItem } from "@/features/resume/components/ui/ResumeListItem";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";

type SoftSkillsSectionProps = {
  softSkills: {
    id: string;
    name: string;
  }[];

  openSoftSkillModal?: (
    skillId: string,
  ) => void;

  deleteSoftSkill?: (
    skillId: string,
  ) => void;

  addSoftSkill?: () => void;
};

export function SoftSkillsSection({
  softSkills,
  openSoftSkillModal,
  deleteSoftSkill,
  addSoftSkill,
}: SoftSkillsSectionProps) {
  return (
    <ResumeEditorSection
      title="Soft Skills"
      icon={Brain}
      count={softSkills.length}
    >
      <div className="space-y-2">
        {softSkills.map((skill) => (
          <ResumeListItem
            key={skill.id}
            title={skill.name}
            subtitle="Soft Skill"
            icon={Sparkles}
            onClick={() =>
              openSoftSkillModal?.(
                skill.id,
              )
            }
            onDelete={() =>
              deleteSoftSkill?.(
                skill.id,
              )
            }
          />
        ))}
      </div>
      <ResumeActionButton
          fullWidth
          icon={<Plus className="size-4" />}
          onClick={addSoftSkill}
      >
          Add soft skill
      </ResumeActionButton>
    </ResumeEditorSection>
  );
}
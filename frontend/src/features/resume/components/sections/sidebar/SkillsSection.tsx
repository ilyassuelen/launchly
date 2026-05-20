import {
  Plus,
  Sparkles,
} from "lucide-react";

import { ResumeListItem } from "@/features/resume/components/ui/ResumeListItem";
import { ResumeEditorSection } from "@/features/resume/components/ui/ResumeEditorSection";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";

type SkillGroup = {
  id: string;
  category: string;
  skills: string[];
};

type SkillsSectionProps = {
  skills: SkillGroup[];

  openSkillEditor: (
    skillId: string,
  ) => void;
  addSkillGroup: () => void;

  deleteSkillGroup: (
    skillId: string,
  ) => void;

  updateSkillCategory: (
    skillId: string,
    value: string,
  ) => void;
};

export function SkillsSection({
  skills,
  openSkillEditor,
  addSkillGroup,
  deleteSkillGroup,
  updateSkillCategory,
}: SkillsSectionProps) {
  return (
    <ResumeEditorSection
      title="Technical Skills"
      icon={Sparkles}
      count={skills.length}
    >
      <div className="space-y-2">
        {skills.map((group) => (
          <ResumeListItem
            key={group.id}
            title={group.category}
            subtitle={`${group.skills.length} keywords`}
            onClick={() =>
              openSkillEditor(group.id)
            }
            onDelete={() =>
              deleteSkillGroup(group.id)
            }
          />
        ))}
      </div>

      <ResumeActionButton
        fullWidth
        icon={<Plus className="size-4" />}
        onClick={addSkillGroup}
      >
        Add technical skill
      </ResumeActionButton>
    </ResumeEditorSection>
  );
}

import {
  BriefcaseBusiness,
  Plus,
} from "lucide-react";

import { ResumeEditorSection } from "@/features/resume/components/ui/ResumeEditorSection";
import { ResumeListItem } from "@/features/resume/components/ui/ResumeListItem";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";

type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  bullets: string[];
};

type ExperienceSectionProps = {
  experience: ExperienceItem[];

  updateExperienceBullet: (
    experienceId: string,
    bulletIndex: number,
    value: string,
  ) => void;

  updateExperienceField: (
    experienceId: string,
    field: "role" | "company",
    value: string,
  ) => void;

  addExperience: () => void;

  deleteExperience: (
    experienceId: string,
  ) => void;

  openExperienceModal?: (
    experienceId: string,
  ) => void;
};

export function ExperienceSection({
  experience,
  addExperience,
  deleteExperience,
  openExperienceModal,
}: ExperienceSectionProps) {
  return (
    <ResumeEditorSection
      title="Experience"
      icon={BriefcaseBusiness}
      count={experience.length}
    >
      <div className="space-y-2">
        {experience.map((exp) => (
          <ResumeListItem
            key={exp.id}
            title={exp.company}
            subtitle={exp.role}
            description={
              exp.bullets?.[0]
            }
            onClick={() =>
              openExperienceModal?.(
                exp.id,
              )
            }
            onDelete={() =>
              deleteExperience(exp.id)
            }
          />
        ))}
      </div>

      <ResumeActionButton
        fullWidth
        variant="primary"
        icon={<Plus className="size-4" />}
        onClick={addExperience}
      >
        Add experience
      </ResumeActionButton>
    </ResumeEditorSection>
  );
}
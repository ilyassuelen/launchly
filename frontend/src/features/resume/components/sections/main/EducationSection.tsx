import {
  GraduationCap,
  Plus,
} from "lucide-react";

import { ResumeEditorSection } from "@/features/resume/components/ui/ResumeEditorSection";
import { ResumeListItem } from "@/features/resume/components/ui/ResumeListItem";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";

type EducationItem = {
  id: string;
  school: string;
  degree: string;
};

type EducationSectionProps = {
  education: EducationItem[];

  addEducation: () => void;

  deleteEducation: (
    educationId: string,
  ) => void;

  updateEducationField: (
    educationId: string,
    field: "school" | "degree",
    value: string,
  ) => void;

  onSelectEducation?: (
    educationId: string,
  ) => void;
};

export function EducationSection({
  education,
  addEducation,
  deleteEducation,
  onSelectEducation,
}: EducationSectionProps) {
  return (
    <ResumeEditorSection
      title="Education"
      icon={GraduationCap}
      count={education.length}
      accent="emerald"
    >
      <div className="space-y-2">
        {education.map((edu) => (
          <ResumeListItem
            key={edu.id}
            title={
              edu.school ||
              "Untitled Education"
            }
            subtitle={
              edu.degree ||
              "No degree added"
            }
            accent="emerald"
            onClick={() =>
              onSelectEducation?.(
                edu.id,
              )
            }
            onDelete={() =>
              deleteEducation(edu.id)
            }
          />
        ))}
      </div>

      <ResumeActionButton
        fullWidth
        variant="primary"
        icon={<Plus className="size-4" />}
        onClick={addEducation}
      >
        Add education
      </ResumeActionButton>
    </ResumeEditorSection>
  );
}
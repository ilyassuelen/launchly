import {
  Globe2,
  Plus,
} from "lucide-react";

import { ResumeEditorSection } from "@/features/resume/components/ui/ResumeEditorSection";
import { ResumeListItem } from "@/features/resume/components/ui/ResumeListItem";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";

type LanguageItem = {
  id: string;
  name: string;
  level: string;
};

type LanguagesSectionProps = {
  languages: LanguageItem[];

  addLanguage: () => void;

  deleteLanguage: (
    languageId: string,
  ) => void;

  updateLanguageField: (
    languageId: string,
    field: "name" | "level",
    value: string,
  ) => void;

  openLanguageModal?: (
    languageId: string,
  ) => void;
};

export function LanguagesSection({
  languages,
  addLanguage,
  deleteLanguage,
  openLanguageModal,
}: LanguagesSectionProps) {
  return (
    <ResumeEditorSection
      title="Languages"
      icon={Globe2}
      count={languages.length}
    >
      <div className="space-y-2">
        {languages.map((lang) => (
          <ResumeListItem
            key={lang.id}
            title={lang.name}
            subtitle={lang.level}
            onClick={() =>
              openLanguageModal?.(lang.id)
            }
            onDelete={() =>
              deleteLanguage(lang.id)
            }
          />
        ))}
      </div>

      <ResumeActionButton
        fullWidth
        variant="primary"
        icon={<Plus className="size-4" />}
        onClick={addLanguage}
      >
        Add language
      </ResumeActionButton>
    </ResumeEditorSection>
  );
}
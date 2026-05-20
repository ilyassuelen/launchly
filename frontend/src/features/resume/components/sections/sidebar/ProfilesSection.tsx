import {
  Github,
  Linkedin,
  Plus,
  User,
} from "lucide-react";

import { ResumeEditorSection } from "@/features/resume/components/ui/ResumeEditorSection";
import { ResumeListItem } from "@/features/resume/components/ui/ResumeListItem";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";

import type { ResumeData } from "@/features/resume/types/resume";

type ExtraProfile = {
  id: string;
  platform: string;
  url: string;
  label: string;
};

type ProfilesSectionProps = {
  resume: ResumeData;

  linkedinLabel: string;
  setLinkedinLabel: (
    value: string,
  ) => void;

  githubLabel: string;
  setGithubLabel: (
    value: string,
  ) => void;

  hiddenProfiles: string[];

  toggleProfileVisibility: (
    profileId: string,
  ) => void;

  updateBasics: (
    field: any,
    value: string,
  ) => void;

  extraProfiles: ExtraProfile[];

  updateSocialProfile: (
    id: string,
    field:
      | "platform"
      | "url"
      | "label",
    value: string,
  ) => void;

  addSocialProfile: () => void;

  openProfileModal?: (
    profileId:
      | string
      | "linkedin"
      | "github",
  ) => void;
};

export function ProfilesSection({
  resume,

  linkedinLabel,
  setLinkedinLabel,

  githubLabel,
  setGithubLabel,

  hiddenProfiles,

  toggleProfileVisibility,

  updateBasics,

  extraProfiles,

  updateSocialProfile,

  addSocialProfile,
  openProfileModal,
}: ProfilesSectionProps) {
  return (
    <ResumeEditorSection
      title="Profiles"
      icon={User}
      count={
        2 + extraProfiles.length
      }
    >
      <div className="space-y-2">

        {resume.basics.linkedin && (
          <ResumeListItem
            title={
              linkedinLabel ||
              "LinkedIn"
            }
            subtitle={
              resume.basics.linkedin
            }
            icon={Linkedin}
            onClick={() =>
              openProfileModal?.(
                "linkedin",
              )
            }
            badge={
              hiddenProfiles.includes(
                "linkedin",
              )
                ? "Hidden"
                : "Visible"
            }
          />
        )}

        {resume.basics.github && (
          <ResumeListItem
            title={
              githubLabel || "GitHub"
            }
            subtitle={
              resume.basics.github
            }
            icon={Github}
            onClick={() =>
              openProfileModal?.(
                "github",
              )
            }
            badge={
              hiddenProfiles.includes(
                "github",
              )
                ? "Hidden"
                : "Visible"
            }
          />
        )}

        {extraProfiles.map(
          (profile) => (
            <ResumeListItem
              key={profile.id}
              title={profile.label}
              subtitle={
                profile.url
              }
              icon={User}
              onClick={() =>
                openProfileModal?.(
                  profile.id,
                )
              }
              onDelete={() =>
                toggleProfileVisibility(
                  profile.id,
                )
              }
              badge={
                hiddenProfiles.includes(
                  profile.id,
                )
                  ? "Hidden"
                  : "Visible"
              }
            />
          ),
        )}
      </div>

      <ResumeActionButton
        fullWidth
        variant="primary"
        icon={<Plus className="size-4" />}
        onClick={addSocialProfile}
      >
        Add profile
      </ResumeActionButton>
    </ResumeEditorSection>
  );
}
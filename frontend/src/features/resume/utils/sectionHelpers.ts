import {
  User,
  Target,
  Sparkles,
  Briefcase,
  Code2,
  GraduationCap,
  Type,
} from "lucide-react";

import type { Resume } from "@/features/resume/types/resume";

import type {
  SidebarSectionId,
  MainSectionId,
} from "@/features/resume/types/sections";

type SidebarSection = {
  id: SidebarSectionId;
  name: string;
  icon: any;
};

type MainSection = {
  id: MainSectionId;
  name: string;
  icon: any;
};

export function getSidebarSections({
  resume,
  sidebarSectionOrder,
}: {
  resume: Resume;
  sidebarSectionOrder: SidebarSectionId[];
}): SidebarSection[] {
  const sectionMap: Record<
    SidebarSectionId,
    SidebarSection
  > = {
    profiles: {
      id: "profiles",
      name: "Profiles",
      icon: User,
    },

    skills: {
      id: "skills",
      name: `Technical Skills (${resume.skills?.length || 0})`,
      icon: Target,
    },

    languages: {
      id: "languages",
      name: `Languages (${resume.languages?.length || 0})`,
      icon: Type,
    },

    softskills: {
      id: "softskills",
      name: "Soft Skills",
      icon: Sparkles,
    },
  };

  return sidebarSectionOrder
    .map((id) => sectionMap[id])
    .filter(Boolean);
}

export function getMainSections({
  resume,
  mainSectionOrder,
}: {
  resume: Resume;
  mainSectionOrder: MainSectionId[];
}): MainSection[] {
  const sectionMap: Record<
    MainSectionId,
    MainSection
  > = {
    experience: {
      id: "experience",
      name: `Experience (${resume.experience?.length || 0})`,
      icon: Briefcase,
    },

    projects: {
      id: "projects",
      name: `Projects (${resume.projects?.length || 0})`,
      icon: Code2,
    },

    education: {
      id: "education",
      name: `Education (${resume.education?.length || 0})`,
      icon: GraduationCap,
    },
  };

  return mainSectionOrder
    .map((id) => sectionMap[id])
    .filter(Boolean);
}
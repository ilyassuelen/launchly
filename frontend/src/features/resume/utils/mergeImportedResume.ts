import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  Resume,
  ResumeLanguage,
  ResumeSoftSkill,
  SkillGroup,
} from "@/features/resume/types/resume";

export interface ImportedResumeData {
  basics: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    location: string;
    bullets: string[];
  }[];
  education: {
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  projects: {
    title: string;
    stack: string;
    description: string;
    bullets: string[];
    technologies: string[];
  }[];
  skills: {
    category: string;
    skills: string[];
  }[];
  languages: {
    name: string;
    level: string;
  }[];
  softSkills: string[];
}

function orDefault(value: string, fallback: string): string {
  return value && value.trim() ? value : fallback;
}

export function mergeImportedResume(
  prev: Resume,
  imported: ImportedResumeData,
): Resume {
  const prevBasics = prev.basics || {};

  const experience: ExperienceItem[] =
    imported.experience.length > 0
      ? imported.experience.map((item) => ({
          id: crypto.randomUUID(),
          company: item.company,
          role: item.role,
          startDate: item.startDate,
          endDate: item.endDate,
          location: item.location,
          bullets: item.bullets,
        }))
      : prev.experience;

  const education: EducationItem[] =
    imported.education.length > 0
      ? imported.education.map((item) => ({
          id: crypto.randomUUID(),
          school: item.school,
          degree: item.degree,
          startDate: item.startDate,
          endDate: item.endDate,
          bullets: item.bullets,
        }))
      : prev.education;

  const projects: ProjectItem[] =
    imported.projects.length > 0
      ? imported.projects.map((item) => ({
          id: crypto.randomUUID(),
          title: item.title,
          stack: item.stack,
          description: item.description,
          bullets: item.bullets,
          technologies: item.technologies,
        }))
      : prev.projects;

  const skills: SkillGroup[] =
    imported.skills.length > 0
      ? imported.skills.map((item) => ({
          id: crypto.randomUUID(),
          category: item.category,
          skills: item.skills,
        }))
      : prev.skills;

  const languages: ResumeLanguage[] =
    imported.languages.length > 0
      ? imported.languages.map((item) => ({
          id: crypto.randomUUID(),
          name: item.name,
          level: item.level,
        }))
      : prev.languages;

  const softSkills: ResumeSoftSkill[] =
    imported.softSkills.length > 0
      ? imported.softSkills.map((name) => ({
          id: crypto.randomUUID(),
          name,
        }))
      : prev.softSkills || [];

  return {
    ...prev,

    basics: {
      ...prevBasics,
      fullName: orDefault(imported.basics.fullName, prevBasics.fullName || ""),
      title: orDefault(imported.basics.title, prevBasics.title || ""),
      email: orDefault(imported.basics.email, prevBasics.email || ""),
      phone: orDefault(imported.basics.phone, prevBasics.phone || ""),
      location: orDefault(imported.basics.location, prevBasics.location || ""),
      website: orDefault(imported.basics.website, prevBasics.website || ""),
      linkedin: orDefault(imported.basics.linkedin, prevBasics.linkedin || ""),
      github: orDefault(imported.basics.github, prevBasics.github || ""),
    },

    summary: {
      content: orDefault(imported.summary, prev.summary?.content || ""),
    },

    experience,
    education,
    projects,
    skills,
    languages,
    softSkills,
  };
}

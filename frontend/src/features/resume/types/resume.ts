import type {
  ResumeAnalysis,
} from "@/features/resume/types/resumeAnalysis";

export type ResumeTheme =
  | "aurora"
  | "mono"
  | "executive"
  | "gradient";

export type ResumeTemplate =
  | "aurora"
  | "mono"
  | "executive"
  | "gradient";

export interface ResumeTypography {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
}

export interface ResumeBasics {
  fullName: string;
  title: string;

  email: string;
  phone?: string;

  location?: string;

  website?: string;
  websiteLabel?: string;

  photo?: string;

  linkedin?: string;
  linkedinLabel?: string;

  github?: string;
  githubLabel?: string;

  socialProfiles?: {
    id: number | string;

    platform: string;

    url: string;

    label: string;
  }[];


}

export interface ResumeSummary {
  content: string;
}

export interface ExperienceItem {
  id: number | string;

  company: string;
  role: string;

  startDate: string;
  endDate: string;

  location?: string;

  bullets: string[];
}

export interface EducationItem {
  id: number | string;

  school: string;
  degree: string;

  startDate?: string;
  endDate?: string;

  description?: string[];

  bullets?: string[];
}

export interface ProjectItem {
  id: number | string;

  title: string;

  stack?: string;

  description: string;

  bullets?: string[];

  technologies: string[];
}

export interface SkillGroup {
  id: number | string;

  category: string;

  skills: string[];
}

export interface ResumeLanguage {
  id: number | string;

  name: string;

  level: string;
}

export interface ResumeSoftSkill {
  id: number | string;
  name: string;
}

export interface Resume {
  id: number | string;

  title: string;

  template: ResumeTemplate;
  theme: ResumeTheme;

  typography?: ResumeTypography;

  basics: ResumeBasics;

  summary: ResumeSummary;

  experience: ExperienceItem[];

  education: EducationItem[];

  projects: ProjectItem[];

  skills: SkillGroup[];

  languages: ResumeLanguage[];
  softSkills?: ResumeSoftSkill[];
  hiddenProfiles?: string[];

  sidebarSectionOrder?: string[];

  mainSectionOrder?: string[];

  latest_ats_score?: number | null;
  latest_resume_analysis?: ResumeAnalysis | null;
  analyzed_at?: string | null;
}
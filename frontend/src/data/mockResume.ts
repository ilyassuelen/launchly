import type { Resume } from "@/features/resume/types/resume";

export const mockResume: Resume = {
  id: "mock-resume",

  title: "New Resume",

  template: "aurora",
  theme: "aurora",

  typography: {
    fontFamily: "Inter",
    fontSize: 13,
    lineHeight: 1.7,
  },

  sidebarSectionOrder: [
    "profiles",
    "skills",
    "languages",
    "softskills",
  ],

  hiddenProfiles: [],

  mainSectionOrder: [
    "experience",
    "projects",
    "education",
  ],

  basics: {
    fullName: "",

    title: "",

    email: "",

    phone: "",

    location: "",

    website: "",

    websiteLabel: "Portfolio",

    linkedin: "",

    linkedinLabel: "LinkedIn",

    github: "",

    githubLabel: "GitHub",

    socialProfiles: [],
    photo: "",
  },

  summary: {
    content:
      "Write a short professional summary about yourself.",
  },

  experience: [],

  education: [],

  projects: [],

  skills: [],

  languages: [],

  softSkills: [
      {
        id: "communication",
        name: "Communication",
      },
      {
        id: "problem-solving",
        name: "Problem Solving",
      },
      {
        id: "leadership",
        name: "Leadership",
      },
      {
        id: "teamwork",
        name: "Teamwork",
      },
      {
        id: "adaptability",
        name: "Adaptability",
      },
  ],
};
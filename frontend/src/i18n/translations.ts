import { common } from "./translations/common";
import { nav } from "./translations/nav";
import { settings } from "./translations/settings";
import { auth } from "./translations/auth";
import { dashboard } from "./translations/dashboard";
import { resume } from "./translations/resume";
import { coverLetter } from "./translations/coverLetter";
import { recruiterView } from "./translations/recruiterView";
import { interview } from "./translations/interview";
import { linkedin } from "./translations/linkedin";
import { portfolio } from "./translations/portfolio";
import { careerPath } from "./translations/careerPath";
import { applications } from "./translations/applications";

export const translations = {
  english: {
    common: common.english,
    nav: nav.english,
    settings: settings.english,
    auth: auth.english,
    dashboard: dashboard.english,
    resume: resume.english,
    coverLetter: coverLetter.english,
    recruiterView: recruiterView.english,
    interview: interview.english,
    linkedin: linkedin.english,
    portfolio: portfolio.english,
    careerPath: careerPath.english,
    applications: applications.english,
  },

  german: {
    common: common.german,
    nav: nav.german,
    settings: settings.german,
    auth: auth.german,
    dashboard: dashboard.german,
    resume: resume.german,
    coverLetter: coverLetter.german,
    recruiterView: recruiterView.german,
    interview: interview.german,
    linkedin: linkedin.german,
    portfolio: portfolio.german,
    careerPath: careerPath.german,
    applications: applications.german,
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.english;
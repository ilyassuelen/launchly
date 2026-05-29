import type React from "react";

import type {
  Resume,
  ExperienceItem,
  ProjectItem,
  SkillGroup,
  ResumeLanguage,
  EducationItem,
  ResumeSoftSkill,
} from "@/features/resume/types/resume";

import {
  sidebarSectionTitles,
  mainSectionTitles,
} from "@/components/resume/shared/resumeSectionTitles";

import { scaleFont } from "@/components/resume/shared/resumeUtils";

interface Props {
  resume: Resume;
  sidebarSectionOrder?: string[];
  mainSectionOrder?: string[];

  typography: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
  };

  websiteLabel?: string;
  linkedinLabel?: string;
  githubLabel?: string;
  hiddenProfiles?: string[];
  photoUrl?: string;
}

export function GradientTemplate({
  resume,
  sidebarSectionOrder = [
    "profiles",
    "skills",
    "languages",
    "softskills",
  ],
  mainSectionOrder = [
    "projects",
    "experience",
    "education",
  ],
  typography,
  websiteLabel,
  linkedinLabel,
  githubLabel,
  hiddenProfiles = [],
  photoUrl,
}: Props) {
  const basics = resume.basics || {};
  const skills = resume.skills || [];
  const languages = resume.languages || [];
  const projects = resume.projects || [];
  const experience = resume.experience || [];
  const education = resume.education || [];
  const softSkills = resume.softSkills || [];
  const summary = resume.summary || {};

  const hasProfiles =
    (!!basics.linkedin &&
      !hiddenProfiles.includes("linkedin")) ||
    (!!basics.github &&
      !hiddenProfiles.includes("github")) ||
    (basics.socialProfiles?.filter((profile) => {
      const platform = profile.platform?.toLowerCase();

      return (
        !hiddenProfiles.includes(String(profile.id)) &&
        profile.url &&
        platform !== "linkedin" &&
        platform !== "github"
      );
    }).length ?? 0) > 0;

  const hasSkills = skills.length > 0;
  const hasLanguages = languages.length > 0;
  const hasEducation = education.length > 0;
  const hasSoftSkills = softSkills.length > 0;
  const hasSummary = !!summary.content?.trim();
  const hasProjects = projects.length > 0;
  const hasExperience = experience.length > 0;

  const getTextItems = (value?: string | string[]) => {
    if (Array.isArray(value)) {
      return value.filter((text) => text?.trim());
    }

    if (typeof value === "string" && value.trim()) {
      return [value.trim()];
    }

    return [];
  };

  const SectionTitle = ({
    children,
    compact = false,
  }: {
    children: React.ReactNode;
    compact?: boolean;
  }) => (
    <div className="flex items-center gap-2">
      <span className="h-px w-7 bg-[#c08457]" />

      <div
        className="font-bold uppercase tracking-[0.18em] text-[#8a5a44]"
        style={{
          fontSize: scaleFont(compact ? 10.5 : 11.5, typography),
        }}
      >
        {children}
      </div>
    </div>
  );

  const Bullet = ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <li
      className="grid grid-cols-[7px_1fr] gap-2 text-[#4b4a45]"
      style={{
        fontSize: scaleFont(12, typography),
        lineHeight: typography.lineHeight,
      }}
    >
      <span
        className="mt-[0.55em] block size-1 rounded-full bg-[#c08457]"
        aria-hidden="true"
      />

      <span>{children}</span>
    </li>
  );

  const InfoBlock = ({
    title,
    children,
  }: {
    title: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <section>
      <SectionTitle compact>{title}</SectionTitle>
      <div className="mt-2">{children}</div>
    </section>
  );

  const sideSectionMap = {
    profiles:
      hasProfiles ? (
        <InfoBlock
          key="profiles"
          title={sidebarSectionTitles.profiles}
        >
          <div
            className="grid gap-2 text-[#3f3a36] font-medium"
            style={{
              fontSize: scaleFont(12.5, typography),
              lineHeight: typography.lineHeight,
            }}
          >
            {!hiddenProfiles.includes("linkedin") &&
              basics.linkedin && (
                <a
                  href={basics.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  {linkedinLabel || "LinkedIn"}
                </a>
              )}

            {!hiddenProfiles.includes("github") &&
              basics.github && (
                <a
                  href={basics.github}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  {githubLabel || "GitHub"}
                </a>
              )}

            {basics.socialProfiles
              ?.filter((profile) => {
                const platform = profile.platform?.toLowerCase();

                return (
                  !hiddenProfiles.includes(String(profile.id)) &&
                  profile.url &&
                  platform !== "linkedin" &&
                  platform !== "github"
                );
              })
              .map((profile) => (
                <a
                  key={profile.id}
                  href={profile.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  {profile.label}
                </a>
              ))}
          </div>
        </InfoBlock>
      ) : null,

    skills:
      hasSkills ? (
        <InfoBlock
          key="skills"
          title={sidebarSectionTitles.skills}
        >
          <div className="space-y-2.5">
            {skills.map((group: SkillGroup) => (
              <div key={group.id}>
                <div
                  className="font-black text-[#1c1917] tracking-[-0.01em]"
                  style={{
                    fontSize: scaleFont(12.5, typography),
                  }}
                >
                  {group.category}
                </div>

                <div
                  className="mt-1 text-[#4b4a45] font-medium"
                  style={{
                    fontSize: scaleFont(11.5, typography),
                    lineHeight: typography.lineHeight,
                  }}
                >
                  {group.skills.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </InfoBlock>
      ) : null,

    languages:
      hasLanguages ? (
        <InfoBlock
          key="languages"
          title={sidebarSectionTitles.languages}
        >
          <div className="space-y-1.5">
            {languages.map((lang: ResumeLanguage) => (
              <div
                key={lang.id}
                className="flex items-center justify-between gap-3 text-[#3f3a36] font-medium"
                style={{
                  fontSize: scaleFont(12, typography),
                }}
              >
                <span>{lang.name}</span>
                <span className="font-semibold text-[#9a6a45]">{lang.level}</span>
              </div>
            ))}
          </div>
        </InfoBlock>
      ) : null,

    softskills:
      hasSoftSkills ? (
        <InfoBlock
          key="softskills"
          title={sidebarSectionTitles.softskills}
        >
          <div className="flex flex-wrap gap-1.5">
            {(softSkills || []).map((skill: ResumeSoftSkill) => (
              <span
                key={skill.id}
                className="border border-[#ddb892] bg-[#fff8ef] px-2.5 py-1 font-semibold text-[#6f4e37]"
                style={{
                  fontSize: scaleFont(11, typography),
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </InfoBlock>
      ) : null,
  };

  const mainSectionMap = {
    projects:
      hasProjects ? (
        <section key="projects">
          <SectionTitle>{mainSectionTitles.projects}</SectionTitle>

          <div className="mt-3 space-y-3.5">
            {projects.map((project: ProjectItem) => (
              <div
                key={project.id}
                className="border-l-2 border-[#d6a16d] pl-4"
              >
                <div
                  className="font-bold leading-tight text-[#27211d]"
                  style={{
                    fontSize: scaleFont(16, typography),
                  }}
                >
                  {project.title}
                </div>

                {project.stack && (
                  <div
                    className="mt-0.5 font-semibold uppercase tracking-[0.08em] text-[#9a6a45]"
                    style={{
                      fontSize: scaleFont(9.5, typography),
                    }}
                  >
                    {project.stack}
                  </div>
                )}

                {project.description && (
                  <p
                    className="mt-1.5 text-[#4b4a45]"
                    style={{
                      fontSize: scaleFont(12, typography),
                      lineHeight: typography.lineHeight,
                    }}
                  >
                    {project.description}
                  </p>
                )}

                <ul className="mt-2 space-y-1">
                  {project.bullets
                    ?.filter((bullet) => bullet?.trim())
                    .map((bullet) => (
                      <Bullet key={bullet}>{bullet}</Bullet>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null,

    experience:
      hasExperience ? (
        <section key="experience">
          <SectionTitle>{mainSectionTitles.experience}</SectionTitle>

          <div className="mt-3 space-y-3.5">
            {experience.map((item: ExperienceItem) => (
              <div key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      className="font-bold leading-tight text-[#27211d]"
                      style={{
                        fontSize: scaleFont(15, typography),
                      }}
                    >
                      {item.role}
                    </div>

                    <div
                      className="mt-0.5 font-semibold uppercase tracking-[0.08em] text-[#9a6a45]"
                      style={{
                        fontSize: scaleFont(9.5, typography),
                      }}
                    >
                      {item.company}
                    </div>
                  </div>

                  <div
                    className="shrink-0 border border-[#e7c8a8] bg-[#fffaf3] px-2 py-1 text-right font-semibold text-[#7a5a45]"
                    style={{
                      fontSize: scaleFont(9.5, typography),
                    }}
                  >
                    {item.startDate} — {item.endDate}
                  </div>
                </div>

                <ul className="mt-2 space-y-1">
                  {(item.bullets || [])
                    .filter((bullet) => bullet?.trim())
                    .map((bullet) => (
                      <Bullet key={bullet}>{bullet}</Bullet>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null,

    education:
      hasEducation ? (
        <section key="education">
          <SectionTitle>{mainSectionTitles.education}</SectionTitle>

          <div className="mt-3 space-y-3">
            {education.map((item: EducationItem) => (
              <div key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      className="font-bold leading-tight text-[#27211d]"
                      style={{
                        fontSize: scaleFont(15, typography),
                      }}
                    >
                      {item.degree}
                    </div>

                    <div
                      className="mt-0.5 font-semibold uppercase tracking-[0.08em] text-[#9a6a45]"
                      style={{
                        fontSize: scaleFont(9.5, typography),
                      }}
                    >
                      {item.school}
                    </div>
                  </div>

                  <div
                    className="shrink-0 border border-[#e7c8a8] bg-[#fffaf3] px-2 py-1 text-right font-semibold text-[#7a5a45]"
                    style={{
                      fontSize: scaleFont(9.5, typography),
                    }}
                  >
                    {item.startDate} — {item.endDate}
                  </div>
                </div>

                {getTextItems(item.description).length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {getTextItems(item.description).map((text) => (
                      <Bullet key={text}>{text}</Bullet>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null,
  };

  return (
    <div
      className="
        resume-page
        relative
        w-[210mm]
        min-h-[297mm]
        h-auto
        overflow-visible
        bg-[#fbf7f1]
        text-[#27211d]
        shadow-[0_24px_90px_rgba(0,0,0,0.18)]
      "
      style={{
        fontFamily: typography.fontFamily,
        fontSize: `${typography.fontSize}px`,
        lineHeight: typography.lineHeight,
      }}
    >
      <div className="h-2 bg-gradient-to-r from-[#7a5a45] via-[#c08457] to-[#ead7bd]" />

      <header className="grid grid-cols-[1fr_120px] gap-7 border-b border-[#e1c7aa] px-8 py-6">
        <div>
          <div
            className="max-w-[95%] font-black uppercase leading-[0.95] tracking-[-0.045em] text-[#27211d]"
            style={{
              fontSize: scaleFont(38, typography),
            }}
          >
            {basics.fullName}
          </div>

          <div
            className="mt-2 inline-block border border-[#d8b894] bg-[#fffaf3] px-3 py-1 font-bold uppercase tracking-[0.14em] text-[#7a5a45]"
            style={{
              fontSize: scaleFont(9.5, typography),
              lineHeight: typography.lineHeight,
            }}
          >
            {basics.title}
          </div>

          <div
            className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[#6b6258]"
            style={{
              fontSize: scaleFont(10.5, typography),
            }}
          >
            {basics.location && <span>{basics.location}</span>}
            {basics.email && <span>{basics.email}</span>}
            {basics.website && (
              <a
                href={basics.website}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-2 hover:underline"
              >
                {websiteLabel || "Website"}
              </a>
            )}
          </div>
        </div>

        <img
          src={
            photoUrl ||
            "https://ui-avatars.com/api/?name=User"
          }
          alt={basics.fullName || "Profile"}
          className="size-30 object-cover"
        />
      </header>

      <div className="grid grid-cols-[1fr_190px] gap-7 px-8 py-6">
        <main>
          {hasSummary && (
            <section className="mb-5 border border-[#ead7bd] bg-[#fffaf3] px-4 py-3">
              <p
                className="text-[#4b4a45]"
                style={{
                  fontSize: scaleFont(12, typography),
                  lineHeight: typography.lineHeight,
                }}
              >
                {summary.content}
              </p>
            </section>
          )}

          <div className="space-y-5">
            {mainSectionOrder.map(
              (sectionId) =>
                mainSectionMap[
                  sectionId as keyof typeof mainSectionMap
                ],
            )}
          </div>
        </main>

        <aside className="space-y-5 border-l border-[#e1c7aa] pl-5">
          {sidebarSectionOrder.map(
            (sectionId) =>
              sideSectionMap[
                sectionId as keyof typeof sideSectionMap
              ],
          )}
        </aside>
      </div>
    </div>
  );
}
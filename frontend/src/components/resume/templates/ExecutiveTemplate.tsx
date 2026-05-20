import type {
  Resume,
  ExperienceItem,
  ProjectItem,
  SkillGroup,
  EducationItem,
  ResumeLanguage,
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
}

export function ExecutiveTemplate({
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
}: Props) {
  const hasProfiles =
    (!!resume.basics.linkedin &&
      !hiddenProfiles.includes("linkedin")) ||
    (!!resume.basics.github &&
      !hiddenProfiles.includes("github")) ||
    (!!resume.basics.website) ||
    (resume.basics.socialProfiles?.filter((profile) => {
      const platform =
        profile.platform?.toLowerCase();

      return (
        !hiddenProfiles.includes(
          String(profile.id),
        ) &&
        profile.url &&
        platform !== "linkedin" &&
        platform !== "github"
      );
    }).length ?? 0) > 0;

  const hasSkills =
    resume.skills.length > 0;

  const hasLanguages =
    resume.languages.length > 0;

  const hasSoftSkills =
    (resume.softSkills || []).length > 0;

  const hasProjects =
    resume.projects.length > 0;

  const hasExperience =
    resume.experience.length > 0;

  const hasEducation =
    resume.education.length > 0;

  const hasSummary =
    !!resume.summary.content?.trim();

  const sidebarSectionMap = {
    profiles:
      hasProfiles ? (
        <section key="profiles">

          <div
            className="font-bold uppercase tracking-[0.25em] text-[#8b6b3f]"
            style={{
              fontSize: scaleFont(11, typography),
            }}
          >
            {sidebarSectionTitles.profiles}
          </div>

          <div
            className="mt-4 grid grid-cols-2 gap-3"
            style={{
              fontSize: scaleFont(13, typography),
            }}
          >
            {!hiddenProfiles.includes(
              "linkedin",
            ) &&
              resume.basics.linkedin && (
                <a
                  href={resume.basics.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="block underline-offset-2 hover:underline"
                >
                  {linkedinLabel || "LinkedIn"}
                </a>
              )}

            {!hiddenProfiles.includes(
              "github",
            ) &&
              resume.basics.github && (
                <a
                  href={resume.basics.github}
                  target="_blank"
                  rel="noreferrer"
                  className="block underline-offset-2 hover:underline"
                >
                  {githubLabel || "GitHub"}
                </a>
              )}

            {resume.basics.website && (
              <a
                href={resume.basics.website}
                target="_blank"
                rel="noreferrer"
                className="block underline-offset-2 hover:underline"
              >
                {websiteLabel || "Website"}
              </a>
            )}

            {resume.basics.socialProfiles
              ?.filter((profile) => {
                const platform =
                  profile.platform?.toLowerCase();

                return (
                  !hiddenProfiles.includes(
                    String(profile.id),
                  ) &&
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
                  className="block underline-offset-2 hover:underline"
                >
                  {profile.label}
                </a>
              ))}
          </div>

        </section>
      ) : null,

    skills:
      hasSkills ? (
        <section key="skills">

          <div
            className="font-bold uppercase tracking-[0.25em] text-[#8b6b3f]"
            style={{
              fontSize: scaleFont(11, typography),
            }}
          >
            {sidebarSectionTitles.skills}
          </div>

          <div className="mt-4 space-y-4">
            {resume.skills.map(
              (group: SkillGroup) => (
                <div key={group.id}>

                  <div className="font-semibold text-[#111827]">
                    {group.category}
                  </div>

                  <div
                    className="mt-2 text-[#4b5563]"
                    style={{
                      fontSize: scaleFont(13, typography),
                      lineHeight: typography.lineHeight,
                    }}
                  >
                    {group.skills.join(", ")}
                  </div>

                </div>
              ),
            )}
          </div>

        </section>
      ) : null,

    languages:
      hasLanguages ? (
        <section key="languages">

          <div
            className="font-bold uppercase tracking-[0.25em] text-[#8b6b3f]"
            style={{
              fontSize: scaleFont(11, typography),
            }}
          >
            {sidebarSectionTitles.languages}
          </div>

          <div className="mt-3 space-y-2">
            {resume.languages.map((lang: ResumeLanguage) => (
              <div
                key={lang.id}
                className="flex items-center justify-between"
                style={{
                  fontSize: scaleFont(13, typography),
                }}
              >
                <span>{lang.name}</span>

                <span className="text-[#6b7280]">
                  {lang.level}
                </span>
              </div>
            ))}
          </div>

        </section>
      ) : null,

    softskills:
      hasSoftSkills ? (
        <section key="softskills">

          <div
            className="font-bold uppercase tracking-[0.25em] text-[#8b6b3f]"
            style={{
              fontSize: scaleFont(11, typography),
            }}
          >
            {sidebarSectionTitles.softskills}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(resume.softSkills || []).map(
              (skill: ResumeSoftSkill) => (
                <span
                  key={skill.id}
                  className="rounded-full border border-[#d7c3a0] bg-[#efe5d4] px-3 py-1 font-medium text-[#6b4f2d]"
                  style={{
                    fontSize: scaleFont(11, typography),
                  }}
                >
                  {skill.name}
                </span>
              ),
            )}
          </div>

        </section>
      ) : null,
  };

  const mainSectionMap = {
    projects:
      hasProjects ? (
        <section key="projects">

          <div
            className="font-bold uppercase tracking-[0.25em] text-[#8b6b3f]"
            style={{
              fontSize: scaleFont(11, typography),
            }}
          >
            {mainSectionTitles.projects}
          </div>

          <div className="mt-5 space-y-6">
            {resume.projects.map(
              (project: ProjectItem) => (
                <div key={project.id}>

                  <div
                    className="font-bold leading-tight text-[#111827]"
                    style={{
                      fontSize: scaleFont(24, typography),
                    }}
                  >
                    {project.title}
                  </div>

                  <div
                    className="mt-2 text-[#8b6b3f]"
                    style={{
                      fontSize: scaleFont(13, typography),
                    }}
                  >
                    {project.stack}
                  </div>

                  <p
                    className="mt-3 text-[#4b5563]"
                    style={{
                      fontSize: scaleFont(13, typography),
                      lineHeight: typography.lineHeight,
                    }}
                  >
                    {project.description}
                  </p>

                  <ul className="mt-3 space-y-1.5">
                    {project.bullets?.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-2 text-[#374151]"
                        style={{
                          fontSize: scaleFont(13, typography),
                          lineHeight: typography.lineHeight,
                        }}
                      >
                        <span className="mt-2 size-2 rounded-full bg-[#8b6b3f]" />

                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                </div>
              ),
            )}
          </div>

        </section>
      ) : null,

    experience:
      hasExperience ? (
        <section key="experience">

          <div
            className="font-bold uppercase tracking-[0.25em] text-[#8b6b3f]"
            style={{
              fontSize: scaleFont(11, typography),
            }}
          >
            {mainSectionTitles.experience}
          </div>

          <div className="mt-5 space-y-6">
            {resume.experience.map(
              (item: ExperienceItem) => (
                <div key={item.id}>

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <div
                        className="font-bold leading-tight"
                        style={{
                          fontSize: scaleFont(20, typography),
                        }}
                      >
                        {item.role}
                      </div>

                      <div
                        className="mt-1 text-[#8b6b3f]"
                        style={{
                          fontSize: scaleFont(13, typography),
                        }}
                      >
                        {item.company}
                      </div>
                    </div>

                    <div
                      className="text-[#6b7280]"
                      style={{
                        fontSize: scaleFont(13, typography),
                      }}
                    >
                      {item.startDate} — {item.endDate}
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {(item.bullets || []).map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-[#374151]"
                        style={{
                          fontSize: scaleFont(13, typography),
                          lineHeight: typography.lineHeight,
                        }}
                      >
                        <span className="mt-2 size-2 rounded-full bg-[#8b6b3f]" />

                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                </div>
              ),
            )}
          </div>

        </section>
      ) : null,

    education:
      hasEducation ? (
        <section key="education">

          <div
            className="font-bold uppercase tracking-[0.25em] text-[#8b6b3f]"
            style={{
              fontSize: scaleFont(11, typography),
            }}
          >
            {mainSectionTitles.education}
          </div>

          <div className="mt-5 space-y-5">
            {resume.education.map(
              (item: EducationItem) => (
                <div key={item.id}>

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <div
                        className="font-bold leading-tight"
                        style={{
                          fontSize: scaleFont(20, typography),
                        }}
                      >
                        {item.degree}
                      </div>

                      <div
                        className="mt-1 text-[#8b6b3f]"
                        style={{
                          fontSize: scaleFont(13, typography),
                        }}
                      >
                        {item.school}
                      </div>
                    </div>

                    <div
                      className="text-[#6b7280]"
                      style={{
                        fontSize: scaleFont(12, typography),
                      }}
                    >
                      {item.startDate} — {item.endDate}
                    </div>
                  </div>

                </div>
              ),
            )}
          </div>

        </section>
      ) : null,
  };
  return (
    <div
      className="relative min-h-[297mm] w-[210mm] overflow-hidden bg-[#f8f5ef] text-[#1f2937] shadow-[0_25px_90px_rgba(0,0,0,0.18)]"
      style={{
        fontFamily: typography.fontFamily,
        fontSize: `${typography.fontSize}px`,
        lineHeight: typography.lineHeight,
      }}
    >

      {/* HEADER */}

      <div className="border-b border-[#d7c3a0] px-10 py-8">

        <div className="flex items-start justify-between">

          <div>

            <div
              className="font-serif font-semibold leading-none tracking-tight"
              style={{
                fontSize: scaleFont(42, typography),
              }}
            >
              {resume.basics.fullName}
            </div>

            <div
              className="mt-2 font-medium text-[#8b6b3f]"
              style={{
                fontSize: scaleFont(15, typography),
              }}
            >
              {resume.basics.title}
            </div>

            <div
              className="mt-4 flex flex-wrap gap-4 text-[#4b5563]"
              style={{
                fontSize: scaleFont(12, typography),
              }}
            >
              <span>{resume.basics.location}</span>
              <span>{resume.basics.email}</span>

              {resume.basics.website && (
                <a
                  href={resume.basics.website}
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
              resume.basics.photo
                ? `${
                    import.meta.env
                      .VITE_API_URL ||
                    "http://127.0.0.1:8000"
                  }${resume.basics.photo}`
                : "https://ui-avatars.com/api/?name=User"
            }
            alt={resume.basics.fullName}
            className="size-32 rounded-3xl object-cover shadow-2xl"
          />
        </div>
      </div>

      {/* BODY */}

      <div className="grid grid-cols-[220px_1fr] gap-10 px-10 py-8">

        {/* SIDEBAR */}
        <div className="space-y-8">
          {sidebarSectionOrder.map(
            (sectionId) =>
              sidebarSectionMap[
                sectionId as keyof typeof sidebarSectionMap
              ],
          )}
        </div>

        {/* MAIN */}

        <div className="space-y-9">

          {hasSummary && (
            <section
              className="
                -mt-2
                rounded-[22px]
                border
                border-[#d7c3a0]
                bg-gradient-to-r
                from-[#f3ede2]
                via-[#f8f5ef]
                to-[#efe5d4]
                px-7
                py-6
              "
            >
              <p
                className="text-[#374151]"
                style={{
                  fontSize: scaleFont(14, typography),
                  lineHeight: typography.lineHeight,
                }}
              >
                {resume.summary.content}
              </p>
            </section>
          )}

        {mainSectionOrder.map(
          (sectionId) =>
            mainSectionMap[
              sectionId as keyof typeof mainSectionMap
            ],
        )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[18px] border-t border-dashed border-red-400/70" />

      <div className="absolute bottom-[6px] right-6 rounded-full border border-red-400/40 bg-red-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-500">
      </div>
    </div>
  );
}
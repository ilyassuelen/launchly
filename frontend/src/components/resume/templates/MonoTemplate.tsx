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
  photoUrl?: string;
}

export function MonoTemplate({
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

  const hasLanguages =
    languages.length > 0;

  const hasSoftSkills = softSkills.length > 0;

  const hasSummary =
    !!summary.content?.trim();

  const hasProjects =
    projects.length > 0;

  const hasExperience =
    experience.length > 0;

  const hasEducation =
    education.length > 0;

  const getTextItems = (
    value?: string | string[],
  ) => {
    if (Array.isArray(value)) {
      return value.filter((text) =>
        text?.trim(),
      );
    }

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return [value.trim()];
    }

    return [];
  };

  const sidebarSectionMap = {
    profiles: hasProfiles ? (
      <section key="profiles">

        <div
          className="font-black uppercase tracking-[0.25em]"
          style={{
            fontSize: scaleFont(11, typography),
          }}
        >
          {sidebarSectionTitles.profiles}
        </div>

        <div
          className="mt-2 flex flex-col gap-1.5"
          style={{
            fontSize: scaleFont(13, typography),
          }}
        >

          {/* LINKEDIN */}

          {!hiddenProfiles.includes(
            "linkedin",
          ) &&
            basics.linkedin && (
              <a
                href={basics.linkedin}
                target="_blank"
                rel="noreferrer"
                className="block underline-offset-2 hover:underline"
              >
                {linkedinLabel || "LinkedIn"}
              </a>
            )}

          {/* GITHUB */}

          {!hiddenProfiles.includes(
            "github",
          ) &&
            basics.github && (
              <a
                href={basics.github}
                target="_blank"
                rel="noreferrer"
                className="block underline-offset-2 hover:underline"
              >
                {githubLabel || "GitHub"}
              </a>
            )}

          {/* EXTRA SOCIALS */}

          {basics.socialProfiles
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

    skills: hasSkills ? (
      <section key="skills">

        <div
          className="font-black uppercase tracking-[0.25em]"
          style={{
            fontSize: scaleFont(11, typography),
          }}
        >
          {sidebarSectionTitles.skills}
        </div>

        <div className="mt-2 space-y-2.5">
          {skills.map(
            (group: SkillGroup) => (
              <div key={group.id}>

                <div className="font-semibold">
                  {group.category}
                </div>

                <div
                  className="mt-1 text-black/70"
                  style={{
                    fontSize: scaleFont(13, typography),
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

    languages: hasLanguages ? (
      <section key="languages">

        <div
          className="font-black uppercase tracking-[0.25em]"
          style={{
            fontSize: scaleFont(11, typography),
          }}
        >
          {sidebarSectionTitles.languages}
        </div>

        <div className="mt-2 space-y-1.5">
          {languages.map((lang: ResumeLanguage) => (
            <div
              key={lang.id}
              className="flex items-center justify-between"
              style={{
                fontSize: scaleFont(12, typography),
              }}
            >
              <span>{lang.name}</span>

              <span className="text-black/50">
                {lang.level}
              </span>
            </div>
          ))}
        </div>

      </section>
    ) : null,

    softskills: hasSoftSkills ? (
      <section key="softskills">

        <div
          className="font-black uppercase tracking-[0.25em]"
          style={{
            fontSize: scaleFont(11, typography),
          }}
        >
          {sidebarSectionTitles.softskills}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {(softSkills || []).map(
            (skill: ResumeSoftSkill) => (
              <span
                key={skill.id}
                className="rounded-full border border-black/10 px-3 py-1 font-medium text-black/70"
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
    projects: hasProjects ? (
      <section key="projects">

        <div
          className="font-black uppercase tracking-[0.25em]"
          style={{
            fontSize: scaleFont(11, typography),
          }}
        >
          {mainSectionTitles.projects}
        </div>

        <div className="mt-3 space-y-3.5">
          {projects.map(
            (project: ProjectItem) => (
              <div key={project.id}>

                <div
                  className="font-bold leading-tight"
                  style={{
                    fontSize: scaleFont(18, typography),
                  }}
                >
                  {project.title}
                </div>

                <div
                  className="mt-1 text-black/50"
                  style={{
                    fontSize: scaleFont(12, typography),
                  }}
                >
                  {project.stack}
                </div>

                <p
                  className="mt-1.5 text-black/75"
                  style={{
                    fontSize: scaleFont(13, typography),
                    lineHeight: typography.lineHeight,
                  }}
                >
                  {project.description}
                </p>

                <ul className="mt-2 space-y-1">
                  {project.bullets
                      ?.filter((bullet) => bullet?.trim())
                      .map((bullet) => (
                    <li
                      key={bullet}
                      className="grid grid-cols-[7px_1fr] gap-2 text-black/75"
                      style={{
                        fontSize: scaleFont(13, typography),
                        lineHeight: typography.lineHeight,
                      }}
                    >
                      <span
                        className="mt-[0.55em] block size-1 rounded-full bg-black/70"
                        aria-hidden="true"
                      />
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

    experience: hasExperience ? (
      <section key="experience">

        <div
          className="font-black uppercase tracking-[0.25em]"
          style={{
            fontSize: scaleFont(11, typography),
          }}
        >
          {mainSectionTitles.experience}
        </div>

        <div className="mt-3 space-y-3.5">
          {experience.map(
            (item: ExperienceItem) => (
              <div key={item.id}>

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <div
                      className="font-bold leading-tight"
                      style={{
                        fontSize: scaleFont(16, typography),
                      }}
                    >
                      {item.role}
                    </div>

                    <div
                      className="mt-0.5 text-black/55"
                      style={{
                        fontSize: scaleFont(12, typography),
                      }}
                    >
                      {item.company}
                    </div>
                  </div>

                  <div
                    className="text-black/45"
                    style={{
                      fontSize: scaleFont(11, typography),
                    }}
                  >
                    {item.startDate} — {item.endDate}
                  </div>
                </div>

                <ul className="mt-2 space-y-1">
                  {(item.bullets || [])
                      .filter((bullet) => bullet?.trim())
                      .map((bullet) => (
                    <li
                      key={bullet}
                      className="grid grid-cols-[7px_1fr] gap-2 text-black/75"
                      style={{
                        fontSize: scaleFont(13, typography),
                        lineHeight: typography.lineHeight,
                      }}
                    >
                      <span
                        className="mt-[0.55em] block size-1 rounded-full bg-black/70"
                        aria-hidden="true"
                      />
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

    education: hasEducation ? (
      <section key="education">

        <div
          className="font-black uppercase tracking-[0.25em]"
          style={{
            fontSize: scaleFont(11, typography),
          }}
        >
          {mainSectionTitles.education}
        </div>

        <div className="mt-3 space-y-3">
          {education.map(
            (item: EducationItem) => (
              <div key={item.id}>

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <div
                      className="font-bold leading-tight"
                      style={{
                        fontSize: scaleFont(16, typography),
                      }}
                    >
                      {item.degree}
                    </div>

                    <div
                      className="mt-0.5 text-black/55"
                      style={{
                        fontSize: scaleFont(12, typography),
                      }}
                    >
                      {item.school}
                    </div>
                  </div>

                  <div
                    className="text-black/45"
                    style={{
                      fontSize: scaleFont(11, typography),
                    }}
                  >
                    {item.startDate} — {item.endDate}
                  </div>
                </div>

                {getTextItems(item.description).length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {getTextItems(item.description).map((text) => (
                          <li
                            key={text}
                            className="grid grid-cols-[8px_1fr] gap-2 text-black/75"
                            style={{
                              fontSize: scaleFont(13, typography),
                              lineHeight: typography.lineHeight,
                            }}
                          >
                            <span
                              className="mt-[0.55em] block size-1 rounded-full bg-black/70"
                              aria-hidden="true"
                            />

                            <span>{text}</span>
                          </li>
                        ))}
                      </ul>
                ) : null}

              </div>
            ),
          )}
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
        bg-white
        px-9
        py-7
        text-black
        shadow-[0_20px_70px_rgba(0,0,0,0.15)]
      "
      style={{
        fontFamily: typography.fontFamily,
        fontSize: `${typography.fontSize}px`,
        lineHeight: typography.lineHeight,
      }}
    >

      {/* HEADER */}

      <div className="border-b border-black/80 pb-4">

        <div className="flex items-start justify-between">

          <div>

            <div
              className="font-black tracking-tight leading-none"
              style={{
                fontSize: scaleFont(34, typography),
              }}
            >
              {basics.fullName}
            </div>

            <div
              className="mt-1 font-medium"
              style={{
                fontSize: scaleFont(13, typography),
              }}
            >
              {basics.title}
            </div>

            <div
              className="mt-2 flex flex-wrap gap-3 text-black/60"
              style={{
                fontSize: scaleFont(12, typography),
              }}
            >
              <span>{basics.location}</span>
              <span>{basics.email}</span>
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
              className="size-30 rounded-2xl object-cover shadow-xl"
          />
        </div>
      </div>

      {/* BODY */}

      <div className="mt-5 grid grid-cols-[185px_1fr] gap-7">

        {/* SIDEBAR */}

        <div className="space-y-5">
          {sidebarSectionOrder.map(
            (sectionId) =>
              sidebarSectionMap[
                sectionId as keyof typeof sidebarSectionMap
              ],
          )}
        </div>

        {/* MAIN */}

<div className="space-y-5">

  {hasSummary && (
    <section
      className="
        -mt-2
        border
        border-black/10
        bg-black/[0.03]
        px-4
        py-3
      "
    >
      <p
        className="text-black/75"
        style={{
          fontSize: scaleFont(13, typography),
          lineHeight: typography.lineHeight,
        }}
      >
        {summary.content}
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


    </div>
  );
}
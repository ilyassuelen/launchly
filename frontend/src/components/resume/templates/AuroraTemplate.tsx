import type {
  Resume,
  ExperienceItem,
  ProjectItem,
  SkillGroup,
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


export function AuroraTemplate({
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
  const hasProfiles =
    (!!resume.basics.linkedin &&
      !hiddenProfiles.includes("linkedin")) ||
    (!!resume.basics.github &&
      !hiddenProfiles.includes("github")) ||
    (resume.basics.socialProfiles?.filter((profile) => {
      const platform = profile.platform?.toLowerCase();
      return (
        !hiddenProfiles.includes(String(profile.id)) &&
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
        <section key="profiles" className="mt-8">
          <div
            className="font-bold uppercase tracking-[0.25em] text-violet-300"
            style={{
              fontSize: scaleFont(11, typography),
            }}
          >
            {sidebarSectionTitles.profiles}
          </div>

          <div
            className="mt-4 space-y-2.5"
            style={{
              fontSize: scaleFont(13, typography),
            }}
          >

            {/* LINKEDIN */}

            {!hiddenProfiles.includes(
              "linkedin",
            ) &&
              resume.basics.linkedin && (
                <a
                  href={resume.basics.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-white/80 transition hover:border-violet-400/20 hover:bg-white/[0.05]"
                >
                  {linkedinLabel || "LinkedIn"}
                </a>
              )}

            {/* GITHUB */}

            {!hiddenProfiles.includes(
              "github",
            ) &&
              resume.basics.github && (
                <a
                  href={resume.basics.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-white/80 transition hover:border-violet-400/20 hover:bg-white/[0.05]"
                >
                  {githubLabel || "GitHub"}
                </a>
              )}

            {/* EXTRA SOCIALS */}

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
                  className="flex items-center rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-white/80 transition hover:border-violet-400/20 hover:bg-white/[0.05]"
                >
                  {profile.label}
                </a>
              ))}

          </div>
        </section>
      ) : null,

    skills:
      hasSkills ? (
        <section key="skills" className="mt-8">
          <div
            className="font-bold uppercase tracking-[0.25em] text-violet-300"
            style={{
              fontSize: scaleFont(11, typography),
            }}
          >
            {sidebarSectionTitles.skills}
          </div>

          <div className="mt-4 space-y-3">
            {resume.skills.map(
              (group: SkillGroup) => (
                <div
                  key={group.id}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] p-3"
                >
                  <div
                    className="font-semibold text-white"
                    style={{
                      fontSize: scaleFont(13, typography),
                    }}
                  >
                    {group.category}
                  </div>

                  <div
                    className="mt-1.5 text-white/50"
                    style={{
                      fontSize: scaleFont(12, typography),
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
        <section key="languages" className="mt-8">
          <div
            className="font-bold uppercase tracking-[0.25em] text-violet-300"
            style={{
              fontSize: scaleFont(11, typography),
            }}
          >
            {sidebarSectionTitles.languages}
          </div>

          <div className="mt-4 space-y-2.5">
            {resume.languages.map((lang) => (
              <div
                key={lang.id}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2"
                style={{
                  fontSize: scaleFont(13, typography),
                }}
              >
                <span>{lang.name}</span>

                <span className="text-white/50">
                  {lang.level}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null,

    softskills:
      hasSoftSkills ? (
        <section key="softskills" className="mt-6">
          <div
            className="font-bold uppercase tracking-[0.25em] text-violet-300"
            style={{
              fontSize: scaleFont(11, typography),
            }}
          >
            {sidebarSectionTitles.softskills}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {(resume.softSkills || []).map((skill) => (
              <div
                key={skill.id}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-medium tracking-[0.04em] text-white/75"
                style={{
                  fontSize: scaleFont(11, typography),
                }}
              >
                {skill.name}
              </div>
            ))}
          </div>
        </section>
      ) : null,
  };

  const mainSectionMap = {
    projects:
      hasProjects ? (
        <section key="projects" className="mt-8">
        <div
          className="border-b border-slate-300 pb-1 font-bold uppercase tracking-[0.22em] text-violet-600"
          style={{
            fontSize: scaleFont(11, typography),
          }}
        >
          {mainSectionTitles.projects}
        </div>

        <div className="mt-5 space-y-5">
          {resume.projects.map(
            (project: ProjectItem) => (
              <div key={project.id}>

                <div
                  className="font-bold leading-tight tracking-[-0.02em]"
                  style={{
                    fontSize: scaleFont(18, typography),
                  }}
                >
                  {project.title}
                </div>

                <div
                  className="mt-1 text-violet-700"
                  style={{
                    fontSize: scaleFont(12, typography),
                  }}
                >
                  {project.stack}
                </div>

                <p
                  className="mt-3 text-slate-700"
                  style={{
                    fontSize: scaleFont(14, typography),
                    lineHeight: typography.lineHeight,
                  }}
                >
                  {project.description}
                </p>

                <ul className="mt-3 space-y-1.5">
                  {project.bullets
                      ?.filter((bullet) => bullet?.trim())
                      .map((bullet) => (
                    <li
                      key={bullet}
                      className="grid grid-cols-[8px_1fr] gap-3 text-slate-700"
                      style={{
                        fontSize: scaleFont(13, typography),
                        lineHeight: typography.lineHeight,
                      }}
                    >
                      <span
                        className="mt-[0.55em] block size-1.5 rounded-full bg-violet-500"
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

    experience:
      hasExperience ? (
        <section key="experience" className="mt-8">
        <div
          className="border-b border-slate-300 pb-1 font-bold uppercase tracking-[0.22em] text-violet-600"
          style={{
            fontSize: scaleFont(11, typography),
          }}
        >
          {mainSectionTitles.experience}
        </div>

        <div className="mt-5 space-y-5">
          {resume.experience.map(
            (item: ExperienceItem) => (
              <div key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      className="font-bold"
                      style={{
                        fontSize: scaleFont(18, typography),
                      }}
                    >
                      {item.role}
                    </div>

                    <div
                      className="mt-1 text-violet-700"
                      style={{
                        fontSize: scaleFont(12, typography),
                      }}
                    >
                      {item.company}
                    </div>
                  </div>

                  <div
                    className="text-slate-500"
                    style={{
                      fontSize: scaleFont(11, typography),
                    }}
                  >
                    {item.startDate} — {item.endDate}
                  </div>
                </div>

                <ul className="mt-3 space-y-1.5">
                  {(item.bullets || [])
                      .filter((bullet) => bullet?.trim())
                      .map((bullet) => (
                    <li
                      key={bullet}
                      className="grid grid-cols-[8px_1fr] gap-3 text-slate-700"
                      style={{
                        fontSize: scaleFont(13, typography),
                        lineHeight: typography.lineHeight,
                      }}
                    >
                      <span
                        className="mt-[0.55em] block size-1.5 rounded-full bg-violet-500"
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

    education:
      hasEducation ? (
        <section key="education" className="mt-8">
        <div
          className="border-b border-slate-300 pb-1 font-bold uppercase tracking-[0.22em] text-violet-600"
          style={{
            fontSize: scaleFont(11, typography),
          }}
        >
          {mainSectionTitles.education}
        </div>

        <div className="mt-5 space-y-4">
          {resume.education.map((edu) => (
            <div key={edu.id}>
              <div
                className="font-bold"
                style={{
                  fontSize: scaleFont(18, typography),
                }}
              >
                {edu.school}
              </div>

              <div
                className="mt-1 text-violet-700"
                style={{
                  fontSize: scaleFont(12, typography),
                }}
              >
                {edu.degree}
              </div>

              <div
                className="mt-1 text-slate-500"
                style={{
                  fontSize: scaleFont(11, typography),
                }}
              >
                {edu.startDate} — {edu.endDate}
              </div>
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
        rounded-[20px]
        bg-white
        shadow-[0_30px_120px_rgba(0,0,0,0.18)]
      "
      style={{
        fontFamily: typography.fontFamily,
        fontSize: `${typography.fontSize}px`,
        lineHeight: typography.lineHeight,
      }}
    >

      <div className="grid grid-cols-[245px_1fr]">

        {/* SIDEBAR */}

        <div className="flex min-h-[297mm] flex-col bg-[#111827] px-6 py-5 text-white">

          <div className="flex flex-col items-center text-center">

            <img
              src={
                photoUrl ||
                "https://ui-avatars.com/api/?name=User"
              }
              alt={resume.basics.fullName}
              className="size-36 rounded-3xl object-cover shadow-2xl"
            />

            <div
              className="mt-4 font-black leading-tight tracking-[-0.03em]"
              style={{
                fontSize: scaleFont(27, typography),
              }}
            >
              {resume.basics.fullName}
            </div>

            <div
              className="mt-2 tracking-[0.08em] text-cyan-300 uppercase"
              style={{
                fontSize: scaleFont(12, typography),
                lineHeight: typography.lineHeight,
              }}
            >
              {resume.basics.title}
            </div>
          </div>

          {/* CONTACT */}

          <section className="mt-8">
            <div
              className="font-bold uppercase tracking-[0.25em] text-violet-300"
              style={{
                fontSize: scaleFont(11, typography),
              }}
            >
              Contact
            </div>

            <div
              className="mt-4 space-y-3 text-white/80"
              style={{
                fontSize: scaleFont(12, typography),
              }}
            >
              <div>{resume.basics.location}</div>
              <div>{resume.basics.email}</div>
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
          </section>


          {sidebarSectionOrder.map(
            (sectionId) =>
              sidebarSectionMap[
                sectionId as keyof typeof sidebarSectionMap
              ],
          )}
        </div>

        {/* MAIN */}

        <div className="flex flex-col px-8 py-7 text-[#111827]">

          {/* SUMMARY */}
          {hasSummary && (
            <section
              className="
                -mx-8
                -mt-7
                mb-0
                border-b
                border-violet-100
                bg-gradient-to-r
                from-violet-50
                via-white
                to-cyan-50
                px-10
                py-8
              "
            >
              <p
                className="max-w-[95%] text-slate-700"
                style={{
                  fontSize: scaleFont(13, typography),
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
    </div>
  );
}
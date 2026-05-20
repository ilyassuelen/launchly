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
}


export function GradientTemplate({
  resume,
  sidebarSectionOrder = [
    "profiles",
    "skills",
    "languages",
    "education",
    "softskills",
  ],
  mainSectionOrder = [
    "projects",
    "experience",
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
    (resume.basics.socialProfiles?.filter((profile) => {
      const platform = profile.platform?.toLowerCase();
      return (
        !hiddenProfiles.includes(String(profile.id)) &&
        profile.url &&
        platform !== "linkedin" &&
        platform !== "github"
      );
    }).length ?? 0) > 0;

  const hasSkills = resume.skills.length > 0;

  const hasLanguages =
    resume.languages.length > 0;

  const hasEducation =
    resume.education.length > 0;

  const hasSoftSkills =
    (resume.softSkills || []).length > 0;

  const hasSummary =
    !!resume.summary.content?.trim();

  const hasProjects =
    resume.projects.length > 0;

  const hasExperience =
    resume.experience.length > 0;

  const sidebarSectionMap = {
    profiles: hasProfiles ? (
      <section key="profiles">
        <div
          className="font-bold uppercase tracking-[0.28em] text-cyan-300"
          style={{
            fontSize: scaleFont(10, typography),
          }}
        >
          {sidebarSectionTitles.profiles}
        </div>
        <div
          className="mt-3 grid grid-cols-1 gap-2 text-white/80"
          style={{
            fontSize: scaleFont(14, typography),
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
    skills: hasSkills ? (
      <section key="skills">
        <div
          className="font-bold uppercase tracking-[0.28em] text-cyan-300"
          style={{
            fontSize: scaleFont(10, typography),
          }}
        >
          {sidebarSectionTitles.skills}
        </div>
        <div className="mt-4 space-y-4">
          {resume.skills.map(
            (group: SkillGroup) => (
              <div key={group.id}>
                <div
                  className="font-semibold"
                  style={{
                    fontSize: scaleFont(14, typography),
                  }}
                >
                  {group.category}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-medium text-white/75 backdrop-blur-xl"
                      style={{
                        fontSize: scaleFont(14 * 0.8, typography),
                      }}
                    >
                      {skill}
                    </span>
                  ))}
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
          className="font-bold uppercase tracking-[0.28em] text-cyan-300"
          style={{
            fontSize: scaleFont(10, typography),
          }}
        >
          {sidebarSectionTitles.languages}
        </div>
        <div className="mt-3 space-y-2.5">
          {resume.languages.map((lang: ResumeLanguage) => (
            <div
              key={lang.id}
              className="flex items-center justify-between"
              style={{
                fontSize: scaleFont(14 * 0.95, typography),
              }}
            >
              <span>{lang.name}</span>
              <span className="text-white/45">
                {lang.level}
              </span>
            </div>
          ))}
        </div>
      </section>
    ) : null,
    education: hasEducation ? (
      <section key="education">
        <div
          className="font-bold uppercase tracking-[0.28em] text-cyan-300"
          style={{
            fontSize: scaleFont(10, typography),
          }}
        >
          {sidebarSectionTitles.education}
        </div>
        <div className="mt-4 space-y-4">
          {resume.education.map((item: EducationItem) => (
            <div key={item.id}>
              <div
                className="font-semibold leading-5"
                style={{
                  fontSize: scaleFont(14, typography),
                }}
              >
                {item.degree}
              </div>
              <div
                className="mt-1 text-cyan-200"
                style={{
                  fontSize: scaleFont(14 * 0.95, typography),
                }}
              >
                {item.school}
              </div>
              <div
                className="mt-1 text-white/45"
                style={{
                  fontSize: scaleFont(14 * 0.8, typography),
                }}
              >
                {item.startDate} — {item.endDate}
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : null,
    softskills: hasSoftSkills ? (
      <section key="softskills">
        <div
          className="font-bold uppercase tracking-[0.28em] text-cyan-300"
          style={{
            fontSize: scaleFont(10, typography),
          }}
        >
          {sidebarSectionTitles.softskills}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(resume.softSkills || []).map(
            (skill: ResumeSoftSkill) => (
              <span
                key={skill.id}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-white/75"
                style={{
                  fontSize: scaleFont(14 * 0.8, typography),
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
          className="font-bold uppercase tracking-[0.28em] text-cyan-300"
          style={{
            fontSize: scaleFont(10, typography),
          }}
        >
          {mainSectionTitles.projects}
        </div>
        <div className="mt-5 space-y-5">
          {resume.projects.map(
            (project: ProjectItem) => (
              <div
                key={project.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl"
              >
                <div
                  className="font-bold leading-tight"
                  style={{
                    fontSize: scaleFont(18, typography),
                  }}
                >
                  {project.title}
                </div>
                <div
                  className="mt-2 text-cyan-300"
                  style={{
                    fontSize: scaleFont(14 * 0.9, typography),
                  }}
                >
                  {project.stack}
                </div>
                <p
                  className="mt-3 text-white/75"
                  style={{
                    fontSize: scaleFont(14, typography),
                  }}
                >
                  {project.description}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {project.bullets?.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-white/75"
                      style={{
                        fontSize: scaleFont(14, typography),
                      }}
                    >
                      <span className="mt-2 size-1.5 rounded-full bg-cyan-300" />
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
          className="font-bold uppercase tracking-[0.28em] text-cyan-300"
          style={{
            fontSize: scaleFont(10, typography),
          }}
        >
          {mainSectionTitles.experience}
        </div>
        <div className="mt-5 space-y-5">
          {resume.experience.map(
            (item: ExperienceItem) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      className="font-bold"
                      style={{
                        fontSize: scaleFont(17, typography),
                      }}
                    >
                      {item.role}
                    </div>
                    <div
                      className="mt-1 text-cyan-300"
                      style={{
                        fontSize: scaleFont(14 * 0.9, typography),
                      }}
                    >
                      {item.company}
                    </div>
                  </div>
                  <div
                    className="text-white/45"
                    style={{
                      fontSize: scaleFont(14 * 0.8, typography),
                    }}
                  >
                    {item.startDate} — {item.endDate}
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {(item.bullets || []).map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-white/75"
                      style={{
                        fontSize: scaleFont(14, typography),
                      }}
                    >
                      <span className="mt-2 size-1.5 rounded-full bg-cyan-300" />
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
        rounded-[18px]
        bg-gradient-to-br
        from-cyan-400
        via-blue-500
        to-violet-600
        p-[1px]
        shadow-[0_30px_120px_rgba(0,0,0,0.25)]
      "
      style={{
        fontFamily: typography.fontFamily,
        fontSize: `${typography.fontSize}px`,
        lineHeight: typography.lineHeight,
      }}
    >


      <div className="rounded-[17px] bg-[#0b1020] text-white">

        {/* HEADER */}

        <div className="border-b border-white/10 px-10 py-8">

          <div className="flex items-start justify-between gap-8">

            <div className="flex-1">

              <div
                className="font-black leading-none tracking-tight"
                style={{
                  fontSize: scaleFont(42, typography),
                }}
              >
                {resume.basics.fullName}
              </div>

              <div
                className="mt-3 font-medium text-cyan-300"
                style={{
                  fontSize: scaleFont(16, typography),
                }}
              >
                {resume.basics.title}
              </div>

              <div
                className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-white/60"
                style={{
                  fontSize: scaleFont(14 * 0.9, typography),
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
              className="size-36 rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>

        {/* BODY */}

        <div className="grid grid-cols-[235px_1fr] gap-10 px-10 py-8">

          {/* SIDEBAR */}
          <div className="space-y-7">
            {sidebarSectionOrder.map(
              (sectionId) =>
                sidebarSectionMap[
                  sectionId as keyof typeof sidebarSectionMap
                ],
            )}
          </div>

          {/* MAIN */}
          <div className="space-y-8">
            {hasSummary && (
              <section
                className="
                  -mt-1
                  rounded-[24px]
                  border
                  border-white/10
                  bg-gradient-to-r
                  from-cyan-500/10
                  via-blue-500/10
                  to-violet-500/10
                  px-7
                  py-6
                  backdrop-blur-xl
                "
              >
                <p
                  className="text-white/80"
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
      </div>
    </div>
  );
}
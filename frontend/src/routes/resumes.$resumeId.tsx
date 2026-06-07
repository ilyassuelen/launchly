import {
  createFileRoute,
  redirect,
} from "@tanstack/react-router";

import { useParams } from "@tanstack/react-router";

import { useResume } from "@/features/resume/hooks/useResume";

import {
  analyzeResume,
} from "@/features/resume/api/resumeApi";

import type {
  ResumeAnalysis,
} from "@/features/resume/types/resumeAnalysis";

import {
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

import {
  AppShell,
} from "@/components/launchly/AppShell";

import { useI18n } from "@/i18n/I18nContext";

import { templates } from "@/features/resume/constants/templates";
import { FONT_OPTIONS } from "@/features/resume/constants/typography";

import type {
  SidebarSectionId,
  MainSectionId,
} from "@/features/resume/types/sections";

import {
  getSidebarSections,
  getMainSections,
} from "@/features/resume/utils/sectionHelpers";

import { ProfilesSection } from "@/features/resume/components/sections/sidebar/ProfilesSection";
import { SkillsSection } from "@/features/resume/components/sections/sidebar/SkillsSection";
import { LanguagesSection } from "@/features/resume/components/sections/sidebar/LanguagesSection";
import { SoftSkillsSection } from "@/features/resume/components/sections/sidebar/SoftSkillsSection";
import { ExperienceSection } from "@/features/resume/components/sections/main/ExperienceSection";
import { ProjectsSection } from "@/features/resume/components/sections/main/ProjectsSection";
import { EducationSection } from "@/features/resume/components/sections/main/EducationSection";
import { SkillEditorModal } from "@/features/resume/components/modals/SkillEditorModal";
import { ExperienceEditModal } from "@/features/resume/components/modals/ExperienceEditModal";
import { ProjectEditModal } from "@/features/resume/components/modals/ProjectEditModal";
import { EducationEditModal } from "@/features/resume/components/modals/EducationEditModal";
import { LanguageEditModal } from "@/features/resume/components/modals/LanguageEditModal";
import { ProfileEditModal } from "@/features/resume/components/modals/ProfileEditModal";
import { SoftSkillEditModal } from "@/features/resume/components/modals/SoftSkillEditModal";
import { ResumeRightPanel } from "@/features/resume/components/layout/ResumeRightPanel";
import { ResumePreviewPanel } from "@/features/resume/components/layout/ResumePreviewPanel";
import { ResumeLeftPanel } from "@/features/resume/components/layout/ResumeLeftPanel";
import { ResumeInsightsPanel } from "@/features/resume/components/layout/ResumeInsightsPanel";


import { useReactToPrint } from "react-to-print";

export const Route = createFileRoute("/resumes/$resumeId")({
  beforeLoad: () => {
    if (typeof window === "undefined") {
      return;
    }

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      throw redirect({
        to: "/login",
      });
    }
  },

  head: () => ({
    meta: [
      {
        title:
          "AI Resume Builder — Launchly",
      },
      {
        name: "description",
        content:
          "Build a recruiter-ready resume with live AI feedback and ATS scoring.",
      },
    ],
  }),

  component: ResumeBuilder,
});

function ResumeBuilder() {
  const { language, t } = useI18n();
  const { resumeId } = useParams({
      from: "/resumes/$resumeId",
  });

  const {
      resume,
      setResume,
      isLoading,
      saveResume,
  } = useResume(resumeId);

  const [zoom, setZoom] = useState(0.82);

  const [
      analysis,
      setAnalysis,
  ] = useState<ResumeAnalysis | null>(
      null,
  );

  const [
      isAnalyzing,
      setIsAnalyzing,
  ] = useState(false);

  const typography =
      resume?.typography || {
        fontFamily: "Inter",
        fontSize: 13,
        lineHeight: 1.7,
      };

  const printRef =
    useRef<HTMLDivElement>(null);
  const previewContentRef =
    useRef<HTMLDivElement>(null);

  const [hasOverflow, setHasOverflow] =
    useState(false);

  const handlePrint =
    useReactToPrint({
      contentRef: printRef,

      documentTitle:
        `${resume?.basics?.fullName || "Resume"}_Resume`,

      pageStyle: `
        @page {
          size: A4;
          margin: 0;
        }

        body {
          margin: 0;
          background: white;
        }

        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `,
    });

  const [saveStatus, setSaveStatus] =
    useState<"idle" | "saving" | "saved">(
      "idle",
    );

  const [activeSection, setActiveSection] =
    useState<string>("");

  const [
    selectedExperienceId,
    setSelectedExperienceId,
  ] = useState<
    number | string | null
  >(null);

  const [
    selectedProjectId,
    setSelectedProjectId,
  ] = useState<
    number | string | null
  >(null);

  const [
    selectedEducationId,
    setSelectedEducationId,
  ] = useState<
    number | string | null
  >(null);

  const [
    selectedLanguageId,
    setSelectedLanguageId,
  ] = useState<
    number | string | null
  >(null);

  const [
      selectedSoftSkillId,
      setSelectedSoftSkillId,
  ] = useState<
    number | string | null
  >(null);

  const [
    selectedProfileId,
    setSelectedProfileId,
  ] = useState<
    number | string | null
  >(null);

  const [editingSkillId, setEditingSkillId] =
    useState<number | string | null>(null);

  const [skillKeywordInput, setSkillKeywordInput] =
    useState("");

  const [skillDraftName, setSkillDraftName] =
    useState("");



  const [
    skillDraftKeywords,
    setSkillDraftKeywords,
  ] = useState<string[]>([]);

  const softSkills =
    resume?.softSkills || [
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
    ];

  const setSoftSkills = (
    updater:
      | typeof softSkills
      | ((
          prev: typeof softSkills,
        ) => typeof softSkills),
  ) => {
    setResume((prev) => ({
      ...prev,
      softSkills:
        typeof updater === "function"
          ? updater(
              prev.softSkills || [],
            )
          : updater,
    }));
  };

  const hiddenProfiles =
    resume?.hiddenProfiles || [];

  const socialProfiles =
      (
        resume?.basics?.socialProfiles || []
      ).filter((profile) => {
        const platform =
          profile.platform?.toLowerCase();
        return (
          platform !== "linkedin" &&
          platform !== "github"
        );
      });

  const selectedExperience =
    resume?.experience?.find(
      (item) =>
        item.id ===
        selectedExperienceId,
    ) || null;

  const selectedProject =
    resume?.projects?.find(
      (item) =>
        item.id ===
        selectedProjectId,
    ) || null;

  const selectedEducation =
    resume?.education?.find(
      (item) =>
        item.id ===
        selectedEducationId,
    ) || null;

  const selectedLanguage =
    resume?.languages?.find(
      (item) =>
        item.id ===
        selectedLanguageId,
    ) || null;

  const selectedSoftSkill =
    softSkills.find(
        (skill) =>
            skill.id ===
            selectedSoftSkillId,
    ) || null;

  const linkedinLabel =
    resume?.basics?.linkedinLabel ||
    "LinkedIn";

  const githubLabel =
    resume?.basics?.githubLabel ||
    "GitHub";

const selectedProfile =
  selectedProfileId ===
  "linkedin"
      ? {
          id: "linkedin",
          platform: "LinkedIn",
          url:
              resume?.basics?.linkedin ||
              "",
          label: linkedinLabel,
        }
      : selectedProfileId ===
          "github"
        ? {
            id: "github",
            platform: "GitHub",
            url:
              resume?.basics?.github ||
              "",
            label: githubLabel,
          }
        :
            resume?.basics?.socialProfiles?.find(
                (item) =>
                  item.id ===
                  selectedProfileId,
            ) || null;

  useEffect(() => {
    const hasOpenModal =
      !!selectedExperience ||
      !!selectedProject ||
      !!selectedEducation ||
      !!selectedLanguage ||
      !!selectedSoftSkill ||
      !!selectedProfile ||
      !!editingSkillId;

    document.body.style.overflow = hasOpenModal
      ? "hidden"
      : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [
    selectedExperience,
    selectedProject,
    selectedEducation,
    selectedLanguage,
    selectedSoftSkill,
    selectedProfile,
    editingSkillId,
  ]);

  useEffect(() => {
    const element =
      previewContentRef.current;

    if (!element) {
      return;
    }

    const A4_HEIGHT = 1123;

    const detectOverflow = () => {
      const contentHeight =
        element.scrollHeight;

      setHasOverflow(
        contentHeight > A4_HEIGHT,
      );
    };

    detectOverflow();

    const resizeObserver =
      new ResizeObserver(() => {
        detectOverflow();
      });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [resume, typography]);

  useEffect(() => {
      if (!resume) {
        setAnalysis(null);
        return;
      }

      setAnalysis(resume.latest_resume_analysis || null);
  }, [resume?.id, resume?.latest_resume_analysis]);


  const websiteLabel =
    resume?.basics?.websiteLabel ||
    "Website";


  const sidebarSectionOrder =
    resume?.sidebarSectionOrder || [
      "profiles",
      "skills",
      "languages",
      "softskills",
    ];

  const mainSectionOrder =
    resume?.mainSectionOrder || [
      "experience",
      "projects",
      "education",
    ];

  const sidebarSections = useMemo(() => {
    if (!resume) {
      return [];
    }

    return getSidebarSections({
      resume,
      sidebarSectionOrder,
    });
  }, [resume, sidebarSectionOrder]);

  const mainSections = useMemo(() => {
    if (!resume) {
      return [];
    }

    return getMainSections({
      resume,
      mainSectionOrder,
    });
  }, [resume, mainSectionOrder]);

  if (isLoading || !resume) {
    return (
      <div className="p-10 text-white">
        {t("resume.loadingResume")}
      </div>
    );
  }

  const handleSaveResume = async () => {
    if (!resume) {
      return;
    }

    try {
      setSaveStatus("saving");

      await saveResume();

      setSaveStatus("saved");

      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (error) {
      console.error(error);

      setSaveStatus("idle");
    }
  };

  const updateExperienceField = (
    experienceId: number | string,
    field: "role" | "company",
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      experience: (prev.experience || []).map(
        (exp) =>
          exp.id === experienceId
            ? {
                ...exp,
                [field]: value,
              }
            : exp,
      ),
    }));
  };

  const updateResumeBasicsField = (
    field: keyof NonNullable<typeof resume.basics>,
    value: string,
  ) => {
    if (!resume) {
      return;
    }
    setResume((prev) => {
      const updatedBasics = {
        ...(prev.basics || {}),
        [field]: value,
      };

      const fullName =
        updatedBasics.fullName?.trim() ||
        "AI Engineer";

      const targetRole =
        updatedBasics.title?.trim() ||
        "Resume";

      return {
        ...prev,

        title: `${fullName} - ${targetRole}`,

        basics: updatedBasics,
      };
    });
  };

  const updateHiddenProfiles = (
    profiles: string[],
  ) => {
    setResume((prev) => ({
      ...prev,
      hiddenProfiles: profiles,
    }));
  };

  const updateSidebarOrder = (
    order: SidebarSectionId[],
  ) => {
    setResume((prev) => ({
      ...prev,
      sidebarSectionOrder: order,
    }));
  };

  const updateMainOrder = (
    order: MainSectionId[],
  ) => {
    setResume((prev) => ({
      ...prev,
      mainSectionOrder: order,
    }));
  };

  const updateSummary = (
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      summary: {
        ...(prev.summary || {}),
        content: value,
      },
    }));
  };

  const updateTypography = (
      updates: Partial<typeof typography>,
  ) => {
      setResume((prev) => ({
        ...prev,

        typography: {
          ...(prev.typography || {
            fontFamily: "Inter",
            fontSize: 13,
            lineHeight: 1.7,
          }),

          ...updates,
        },
      }));
  };

  const buildResumeContext = () => {
      return `

Candidate:
${resume?.basics?.fullName || ""}
${resume?.basics?.email || ""}
${resume?.basics?.phone || ""}
${resume?.basics?.location || ""}
${resume?.basics?.website || ""}
${resume?.basics?.linkedin || ""}
${resume?.basics?.github || ""}

Headline:
${resume?.basics?.title || ""}

Summary:
${resume?.summary?.content || ""}

Skills:
${resume?.skills
  ?.flatMap((group: any) => group.skills || [])
  .join(", ") || ""}

Experience:
${resume?.experience
  ?.map(
    (e: any) => `
${e.role || ""} at ${e.company || ""}
${e.summary || ""}
${(e.bullets || []).join(" ")}
`,
  )
  .join("\n") || ""}

Projects:
${resume?.projects
  ?.map(
    (p: any) => `
${p.title || ""}
${p.description || ""}
${(p.bullets || []).join(" ")}
`,
  )
  .join("\n") || ""}

Education:
${resume?.education
  ?.map(
    (e: any) => `
${e.school || ""}
${e.degree || ""}
${e.startDate || ""} ${e.endDate || ""}
${Array.isArray(e.description) ? e.description.join(" ") : e.description || ""}
${(e.bullets || []).join(" ")}
`,
  )
  .join("\n") || ""}

Languages:
${resume?.languages
  ?.map(
    (l: any) => `${l.name || ""} ${l.level || ""}`,
  )
  .join(", ") || ""}
`;
  };

  const handleAnalyzeResume =
    async () => {
      try {
        setIsAnalyzing(true);

        const response =
          await analyzeResume({
            resume_id: resume.id,

            language,

            tone:
              "professional",

            resume_content:
              buildResumeContext(),

            target_role:
              resume?.basics?.title || "",
          });

        setAnalysis(response);

        setResume((prev) => {
            if (!prev) {
                return prev;
            }

            return {
                ...prev,
                latest_ats_score: response.ats_score.score,
                latest_resume_analysis: response,
                analyzed_at: new Date().toISOString(),
            };
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsAnalyzing(false);
      }
    };

  const updateExperienceBullet = (
    experienceId: number | string,
    bulletIndex: number,
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      experience: (prev.experience || []).map(
        (exp) =>
          exp.id === experienceId
            ? {
                ...exp,
                bullets: (exp.bullets || []).map(
                  (bullet, index) =>
                    index === bulletIndex
                      ? value
                      : bullet,
                ),
              }
            : exp,
      ),
    }));
  };

  const updateEducationBullet = (
      educationId: number | string,
      bulletIndex: number,
      value: string,
  ) => {
      setResume((prev) => ({
        ...prev,
        education: (prev.education || []).map(
          (edu) =>
            edu.id === educationId
              ? {
                  ...edu,
                  bullets: (edu.bullets || []).map(
                    (bullet, index) =>
                      index === bulletIndex
                        ? value
                        : bullet,
                  ),
                }
              : edu,
        ),
      }));
  };

  const updateProjectBullet = (
    projectId: number | string,
    bulletIndex: number,
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      projects: (prev.projects || []).map(
        (project) =>
          project.id === projectId
            ? {
                ...project,
                bullets:
                  (project.bullets || []).map(
                    (bullet, index) =>
                      index === bulletIndex
                        ? value
                        : bullet,
                  ),
              }
            : project,
      ),
    }));
  };

  const updateProjectField = (
    projectId: number | string,
    field: "title" | "stack",
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      projects: (prev.projects || []).map(
        (project) =>
          project.id === projectId
            ? {
                ...project,
                [field]: value,
              }
            : project,
      ),
    }));
  };

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          id: crypto.randomUUID(),
          company: t("resume.newCompany"),
          role: t("resume.newRole"),
          startDate: "",
          endDate: "",
          location: "",
          bullets: [
            t("resume.describeYourImpact"),
          ],
        },
      ],
    }));
  };

  const deleteExperience = (
    experienceId: number | string,
  ) => {
    setResume((prev) => ({
      ...prev,
      experience:
        (prev.experience || []).filter(
          (exp) =>
            exp.id !== experienceId,
        ),
    }));
  };

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          id: crypto.randomUUID(),
          title: t("resume.newProject"),
          stack:
            "React · TypeScript",
          description:
            t("resume.projectDescription"),
          bullets: [
            t("resume.describeWhatYouBuilt"),
          ],
          technologies: [],
        },
      ],
    }));
  };

  const deleteProject = (
    projectId: number | string,
  ) => {
    setResume((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter(
        (project) =>
          project.id !== projectId,
      ),
    }));
  };

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          id: crypto.randomUUID(),
          school: t("resume.newSchool"),
          degree: t("resume.newDegree"),
          startDate: "",
          endDate: "",
          description: [],
          bullets: [
              t("resume.describeYourImpact"),
          ],
        },
      ],
    }));
  };

  const deleteEducation = (
    educationId: number | string,
  ) => {
    setResume((prev) => ({
      ...prev,
      education:
        (prev.education || []).filter(
          (edu) =>
            edu.id !== educationId,
        ),
    }));
  };

  const updateEducationField = (
    educationId: number | string,
    field: "school" | "degree",
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      education: (prev.education || []).map(
        (edu) =>
          edu.id === educationId
            ? {
                ...edu,
                [field]: value,
              }
            : edu,
      ),
    }));
  };

  const updateExperienceDetails = (
    experienceId: number | string,
    updates: Record<string, any>,
  ) => {
    setResume((prev) => ({
      ...prev,
      experience: (prev.experience || []).map(
        (exp) =>
          exp.id === experienceId
            ? {
                ...exp,
                ...updates,
              }
            : exp,
      ),
    }));
  };

  const updateProjectDetails = (
    projectId: number | string,
    updates: Record<string, any>,
  ) => {
    setResume((prev) => ({
      ...prev,
      projects: (prev.projects || []).map(
        (project) =>
          project.id === projectId
            ? {
                ...project,
                ...updates,
              }
            : project,
      ),
    }));
  };

  const updateEducationDetails = (
    educationId: number | string,
    updates: Record<string, any>,
  ) => {
    setResume((prev) => ({
      ...prev,
      education: (prev.education || []).map(
        (edu) =>
          edu.id === educationId
            ? {
                ...edu,
                ...updates,
              }
            : edu,
      ),
    }));
  };

  const updateLanguageDetails = (
    languageId: number | string,
    updates: Record<string, any>,
  ) => {
    setResume((prev) => ({
      ...prev,
      languages: (prev.languages || []).map(
        (lang) =>
          lang.id === languageId
            ? {
                ...lang,
                ...updates,
              }
            : lang,
      ),
    }));
  };

  const addLanguage = () => {
    setResume((prev) => ({
      ...prev,
      languages: [
        ...(prev.languages || []),
        {
          id: crypto.randomUUID(),
          name: t("resume.newLanguage"),
          level: t("resume.beginner"),
        },
      ],
    }));
  };

  const deleteLanguage = (
    languageId: number | string,
  ) => {
    setResume((prev) => ({
      ...prev,
      languages:
        (prev.languages || []).filter(
          (lang) =>
            lang.id !== languageId,
        ),
    }));
  };

  const deleteSoftSkill = (
    skillId: string,
  ) => {
    setSoftSkills((prev) =>
      prev.filter(
        (skill) =>
          skill.id !== skillId,
      ),
    );

    if (
      selectedSoftSkillId ===
      skillId
    ) {
      setSelectedSoftSkillId(
        null,
      );
    }
  };

  const addSoftSkill = () => {
      setSoftSkills((prev) => [
          ...prev,
          {
              id: crypto.randomUUID(),
              name: t("resume.newSoftSkill"),
          },
      ]);
  };

  const updateLanguageField = (
    languageId: number | string,
    field: "name" | "level",
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      languages: (prev.languages || []).map(
        (lang) =>
          lang.id === languageId
            ? {
                ...lang,
                [field]: value,
              }
            : lang,
      ),
    }));
  };

  const addSkillGroup = () => {
    setResume((prev) => ({
      ...prev,
      skills: [
        ...(prev.skills || []),
        {
          id: crypto.randomUUID(),
          category: t("resume.newSkillGroup"),
          skills: [t("resume.newSkill")],
        },
      ],
    }));
  };

  const deleteSkillGroup = (
    skillId: number | string,
  ) => {
    setResume((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter(
        (group) =>
          group.id !== skillId,
      ),
    }));
  };

  const updateSkillCategory = (
    skillId: number | string,
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      skills: (prev.skills || []).map(
        (group) =>
          group.id === skillId
            ? {
                ...group,
                category: value,
              }
            : group,
      ),
    }));
  };

  const openSkillEditor = (
    skillId: number | string,
  ) => {
    const skill =
      resume.skills?.find(
        (s) => s.id === skillId,
      );

    if (!skill) {
      return;
    }

    setEditingSkillId(skillId);

    setSkillDraftName(skill.category);

    setSkillDraftKeywords(
      skill.skills,
    );

    setSkillKeywordInput("");
  };

  const saveSkillEditor = () => {
    if (!editingSkillId) {
      return;
    }

    setResume((prev) => ({
      ...prev,
      skills: (prev.skills || []).map(
        (group) =>
          group.id === editingSkillId
            ? {
                ...group,
                category:
                  skillDraftName,
                skills:
                  skillDraftKeywords,
              }
            : group,
      ),
    }));

    setEditingSkillId(null);
  };

  const addSkillKeyword = () => {
    const keyword =
      skillKeywordInput.trim();

    if (!keyword) {
      return;
    }

    if (
      skillDraftKeywords.includes(
        keyword,
      )
    ) {
      return;
    }

    setSkillDraftKeywords((prev) => [
      ...prev,
      keyword,
    ]);

    setSkillKeywordInput("");
  };

  const removeSkillKeyword = (
    keyword: string,
  ) => {
    setSkillDraftKeywords((prev) =>
      prev.filter(
        (item) => item !== keyword,
      ),
    );
  };

  const addSocialProfile = () => {
    setResume((prev) => ({
      ...prev,
      basics: {
        ...(prev.basics || {}),
        socialProfiles: [
          ...(prev.basics?.socialProfiles || []),
          {
            id: crypto.randomUUID(),
            platform: "X",
            url: "",
            label: "X",
          },
        ],
      },
    }));
  };

  const toggleProfileVisibility = (
    profileId: number | string,
  ) => {
    const profileExists =
      (
        resume?.basics
          ?.socialProfiles || []
      ).some(
        (profile) =>
          profile.id === profileId,
      );

    if (profileExists) {
      setResume((prev) => ({
        ...prev,
        basics: {
          ...(prev.basics || {}),
          socialProfiles: (
            prev.basics
              ?.socialProfiles || []
          ).filter(
            (profile) =>
              profile.id !== profileId,
          ),
        },
      }));

      return;
    }

    const updatedProfiles =
      hiddenProfiles.includes(
        String(profileId),
      )
        ? hiddenProfiles.filter(
            (id) => id !== String(profileId),
          )
        : [
            ...hiddenProfiles,
            String(profileId),
          ];

    updateHiddenProfiles(
      updatedProfiles,
    );
  };

  const updateSocialProfile = (
    id: number | string,
    field:
      | "platform"
      | "url"
      | "label",
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      basics: {
        ...(prev.basics || {}),
        socialProfiles: (
          prev.basics?.socialProfiles || []
        ).map((profile) =>
          profile.id === id
            ? {
                ...profile,
                [field]: value,
              }
            : profile,
        ),
      },
    }));
  };



  const renderSidebarSectionContent = (
    sectionId: SidebarSectionId,
  ) => {
    switch (sectionId) {
      case "profiles":
        return (
          <ProfilesSection
            resume={resume}
            hiddenProfiles={
              hiddenProfiles
            }
            linkedinLabel={
              linkedinLabel
            }
            githubLabel={githubLabel}
            extraProfiles={socialProfiles}
            toggleProfileVisibility={
              toggleProfileVisibility
            }
            updateBasics={
              updateResumeBasicsField
            }
            setLinkedinLabel={(
              value,
            ) =>
              updateResumeBasicsField(
                "linkedinLabel",
                value,
              )
            }
            setGithubLabel={(value) =>
              updateResumeBasicsField(
                "githubLabel",
                value,
              )
            }
            updateSocialProfile={
              updateSocialProfile
            }
            addSocialProfile={
                addSocialProfile
            }
            openProfileModal={(
                id,
            ) =>
                setSelectedProfileId(
                    id,
                )
            }
          />
        );

      case "skills":
        return (
          <SkillsSection
            skills={resume.skills || []}
            openSkillEditor={
              openSkillEditor
            }
            addSkillGroup={
              addSkillGroup
            }
            deleteSkillGroup={
              deleteSkillGroup
            }
            updateSkillCategory={
              updateSkillCategory
            }
          />
        );

      case "languages":
        return (
          <LanguagesSection
            languages={
              resume.languages || []
            }
            addLanguage={
              addLanguage
            }
            deleteLanguage={
              deleteLanguage
            }
            updateLanguageField={
              updateLanguageField
            }
            openLanguageModal={(
              id,
            ) =>
              setSelectedLanguageId(
                id,
              )
            }
          />
        );

      case "softskills":
          return (
            <SoftSkillsSection
              softSkills={softSkills}
              openSoftSkillModal={(
                id,
              ) =>
                setSelectedSoftSkillId(
                  id,
                )
              }
              deleteSoftSkill={
                deleteSoftSkill
              }
              addSoftSkill={
                  addSoftSkill
              }
            />
          );

      default:
        return null;
    }
  };

  const renderMainSectionContent = (
    sectionId: MainSectionId,
  ) => {
    switch (sectionId) {
      case "experience":
        return (
          <ExperienceSection
              experience={
                resume.experience || []
              }
              updateExperienceBullet={
                updateExperienceBullet
              }
              updateExperienceField={
                updateExperienceField
              }
              addExperience={
                addExperience
              }
              deleteExperience={
                deleteExperience
              }
              openExperienceModal={(
                id,
              ) =>
                setSelectedExperienceId(
                  id,
                )
              }
          />
        );

      case "projects":
        return (
          <ProjectsSection
            projects={resume.projects || []}
            updateProjectBullet={
              updateProjectBullet
            }
            updateProjectField={
              updateProjectField
            }
            addProject={addProject}
            deleteProject={
              deleteProject
            }
            openProjectModal={(
              id,
            ) =>
              setSelectedProjectId(
                id,
              )
            }
          />
        );

      case "education":
        return (
          <EducationSection
            education={
              resume.education || []
            }
            addEducation={
              addEducation
            }
            deleteEducation={
              deleteEducation
            }
            updateEducationField={
              updateEducationField
            }
            onSelectEducation={(
              id,
            ) =>
              setSelectedEducationId(
                id,
              )
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <AppShell

    >
      <div className="grid gap-4 lg:grid-cols-12">

        <ResumeLeftPanel
          resume={resume}
          setResume={setResume}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          updateBasics={updateResumeBasicsField}
          summary={resume.summary?.content || ""}
          updateSummary={updateSummary}
          sidebarSections={sidebarSections}
          mainSections={mainSections}
          updateSidebarOrder={updateSidebarOrder}
          updateMainOrder={updateMainOrder}
          renderSidebarSectionContent={
            renderSidebarSectionContent
          }
          renderMainSectionContent={
            renderMainSectionContent
          }
        />

        <div className="space-y-4 lg:col-span-7">

          <ResumePreviewPanel
            resume={resume}
            zoom={zoom}
            setZoom={setZoom}
            hasOverflow={hasOverflow}
            saveStatus={saveStatus}
            handleSaveResume={handleSaveResume}
            handlePrint={handlePrint}
            printRef={printRef}
            previewContentRef={previewContentRef}
          />

          <div className="max-w-[794px]">
            <div className="space-y-4">
              <ResumeInsightsPanel
                analysis={analysis}
                isAnalyzing={isAnalyzing}
                canAnalyze={true}
                onAnalyze={handleAnalyzeResume}
              />
            </div>
          </div>

        </div>

        <ResumeRightPanel
          resume={resume}
          setResume={setResume}
          analysis={analysis}
          typography={typography}
          updateTypography={updateTypography}
        />

      </div>

      <ExperienceEditModal
          open={!!selectedExperience}
          company={
            selectedExperience?.company ||
            ""
          }
          role={
            selectedExperience?.role ||
            ""
          }
          startDate={
            selectedExperience?.startDate ||
            ""
          }
          endDate={
            selectedExperience?.endDate ||
            ""
          }
          summary={
            selectedExperience?.summary ||
            ""
          }
          bullets={
            selectedExperience?.bullets ||
            []
          }
          onClose={() =>
            setSelectedExperienceId(
              null,
            )
          }
          onSave={() =>
            setSelectedExperienceId(
              null,
            )
          }
          onChangeCompany={(
            value,
          ) => {
            if (!selectedExperience) {
              return;
            }

            updateExperienceDetails(
              selectedExperience.id,
              {
                company: value,
              },
            );
          }}
          onChangeRole={(
            value,
          ) => {
            if (!selectedExperience) {
              return;
            }

            updateExperienceDetails(
              selectedExperience.id,
              {
                role: value,
              },
            );
          }}
          onChangeStartDate={(
            value,
          ) => {
            if (!selectedExperience) {
              return;
            }

            updateExperienceDetails(
              selectedExperience.id,
              {
                startDate: value,
              },
            );
          }}
          onChangeEndDate={(
            value,
          ) => {
            if (!selectedExperience) {
              return;
            }

            updateExperienceDetails(
              selectedExperience.id,
              {
                endDate: value,
              },
            );
          }}
          onChangeSummary={(
            value,
          ) => {
            if (!selectedExperience) {
              return;
            }

            updateExperienceDetails(
              selectedExperience.id,
              {
                summary: value,
              },
            );
          }}
          onChangeBullet={(
            index,
            value,
          ) => {
            if (!selectedExperience) {
              return;
            }

            updateExperienceBullet(
              selectedExperience.id,
              index,
              value,
            );
          }}
          onAddBullet={() => {
            if (!selectedExperience) {
              return;
            }

            updateExperienceDetails(
              selectedExperience.id,
              {
                bullets: [
                  ...(selectedExperience.bullets ||
                    []),
                  "",
                ],
              },
            );
          }}
      />

      <ProjectEditModal
        open={!!selectedProject}
        title={
          selectedProject?.title ||
          ""
        }
        stack={
          selectedProject?.stack ||
          ""
        }
        description={
          selectedProject?.description ||
          ""
        }
        bullets={
          selectedProject?.bullets ||
          []
        }
        links={
          selectedProject?.links ||
          []
        }
        onClose={() =>
          setSelectedProjectId(
            null,
          )
        }
        onSave={() =>
          setSelectedProjectId(
            null,
          )
        }
        onChangeTitle={(
          value,
        ) => {
          if (!selectedProject) {
            return;
          }

          updateProjectDetails(
            selectedProject.id,
            {
              title: value,
            },
          );
        }}
        onChangeStack={(
          value,
        ) => {
          if (!selectedProject) {
            return;
          }

          updateProjectDetails(
            selectedProject.id,
            {
              stack: value,
            },
          );
        }}
        onChangeDescription={(
          value,
        ) => {
          if (!selectedProject) {
            return;
          }

          updateProjectDetails(
            selectedProject.id,
            {
              description: value,
            },
          );
        }}
        onChangeBullet={(
          index,
          value,
        ) => {
          if (!selectedProject) {
            return;
          }

          updateProjectBullet(
            selectedProject.id,
            index,
            value,
          );
        }}
        onAddBullet={() => {
          if (!selectedProject) {
            return;
          }

          updateProjectDetails(
            selectedProject.id,
            {
              bullets: [
                ...(selectedProject.bullets || []),
                "",
              ],
            },
          );
        }}
      />

      <EducationEditModal
          open={!!selectedEducation}
          school={
            selectedEducation?.school ||
            ""
          }
          degree={
            selectedEducation?.degree ||
            ""
          }
          startDate={
            selectedEducation?.startDate ||
            ""
          }
          endDate={
            selectedEducation?.endDate ||
            ""
          }
          description={
              Array.isArray(selectedEducation?.description)
                ? selectedEducation.description.join("\n")
                : selectedEducation?.description || ""
          }
          bullets={
              selectedEducation?.bullets ||
              []
          }
          onClose={() =>
            setSelectedEducationId(
              null,
            )
          }
          onSave={() =>
            setSelectedEducationId(
              null,
            )
          }
          onChangeSchool={(
            value,
          ) => {
            if (!selectedEducation) {
              return;
            }

            updateEducationDetails(
              selectedEducation.id,
              {
                school: value,
              },
            );
          }}
          onChangeDegree={(
            value,
          ) => {
            if (!selectedEducation) {
              return;
            }

            updateEducationDetails(
              selectedEducation.id,
              {
                degree: value,
              },
            );
          }}
          onChangeStartDate={(
            value,
          ) => {
            if (!selectedEducation) {
              return;
            }

            updateEducationDetails(
              selectedEducation.id,
              {
                startDate: value,
              },
            );
          }}
          onChangeEndDate={(
            value,
          ) => {
            if (!selectedEducation) {
              return;
            }

            updateEducationDetails(
              selectedEducation.id,
              {
                endDate: value,
              },
            );
          }}
          onChangeDescription={(
            value,
          ) => {
            if (!selectedEducation) {
              return;
            }

            updateEducationDetails(
              selectedEducation.id,
              {
                description: value,
              },
            );
          }}
          onChangeBullet={(
              index,
              value,
          ) => {
              if (!selectedEducation) {
                return;
              }

              updateEducationBullet(
                selectedEducation.id,
                index,
                value,
              );
          }}
          onAddBullet={() => {
              if (!selectedEducation) {
                return;
              }

              updateEducationDetails(
                selectedEducation.id,
                {
                  bullets: [
                    ...(selectedEducation.bullets || []),
                    "",
                  ],
                },
              );
          }}
      />

      <LanguageEditModal
        open={
          !!selectedLanguage
        }
        language={
          selectedLanguage
        }
        onClose={() =>
          setSelectedLanguageId(
            null,
          )
        }
        onSave={() =>
          setSelectedLanguageId(
            null,
          )
        }
        onChange={(
          field,
          value,
        ) => {
          if (
            !selectedLanguage
          ) {
            return;
          }

          updateLanguageDetails(
            selectedLanguage.id,
            {
              [field]: value,
            },
          );
        }}
      />

      <ProfileEditModal
        open={
          !!selectedProfile
        }
        profile={
          selectedProfile
        }
        onClose={() =>
          setSelectedProfileId(
            null,
          )
        }
        onSave={() => {
            if (
                selectedProfile &&
                selectedProfile.id !==
                    "linkedin" &&
                selectedProfile.id !==
                    "github" &&
                !selectedProfile.url.trim()
            ) {
                setResume((prev) => ({
                    ...prev,
                    basics: {
                        ...(prev.basics || {}),
                        socialProfiles: (
                            prev.basics
                                ?.socialProfiles || []
                        ).filter(
                            (profile) =>
                                profile.id !==
                                selectedProfile.id,
                        ),
                    },
                }));
            }

            setSelectedProfileId(
                null,
            );
        }}
        onChange={(
            field,
            value,
        ) => {
            if (
                !selectedProfile
            ) {
                return;
            }

            if (
                selectedProfile.id ===
                "linkedin"
            ) {
                if (field === "url") {
                    updateResumeBasicsField(
                        "linkedin",
                        value,
                    );
                }

                if (field === "label") {
                    updateResumeBasicsField(
                        "linkedinLabel",
                        value,
                    );
                }

                return;
            }

            if (
                selectedProfile.id ===
                "github"
            ) {
                if (field === "url") {
                    updateResumeBasicsField(
                        "github",
                        value,
                    );
                }

                if (field === "label") {
                    updateResumeBasicsField(
                        "githubLabel",
                        value,
                    );
                }

                return;
            }

            updateSocialProfile(
                selectedProfile.id,
                field,
                value,
            );
        }}
      />

      <SoftSkillEditModal
          open={
            !!selectedSoftSkill
          }
          softSkill={
            selectedSoftSkill
          }
          onClose={() =>
            setSelectedSoftSkillId(
              null,
            )
          }
          onSave={() =>
            setSelectedSoftSkillId(
              null,
            )
          }
          onChange={(
              field,
              value,
          ) => {
              if (
                  !selectedSoftSkill
              ) {
                  return;
              }

              setSoftSkills((prev) =>
                prev.map((skill) =>
                    skill.id ===
                    selectedSoftSkill.id
                        ? {
                            ...skill,
                            [field]: value,
                          }
                        : skill,
                ),
              );
          }}
      />

      <SkillEditorModal
        editingSkillId={editingSkillId}
        skillDraftName={skillDraftName}
        setSkillDraftName={setSkillDraftName}
        skillKeywordInput={skillKeywordInput}
        setSkillKeywordInput={setSkillKeywordInput}
        skillDraftKeywords={skillDraftKeywords}
        addSkillKeyword={addSkillKeyword}
        removeSkillKeyword={removeSkillKeyword}
        setEditingSkillId={setEditingSkillId}
        saveSkillEditor={saveSkillEditor}
      />

    </AppShell>
  );
}

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  AppShell,
  Card,
  Progress,
} from "@/components/launchly/AppShell";

import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";

import {
  Linkedin,
  Sparkles,
  Wand2,
  Plus,
  TrendingUp,
  Search,
  Eye,
  Check,
  AlertTriangle,
  ScanSearch,
  Target,
  MessageSquare,
  Loader2,
  Save,
} from "lucide-react";

import {
  useLinkedInAnalyzer,
} from "@/features/linkedin/hooks/useLinkedInAnalyzer";

import {
  AddProjectModal,
} from "@/features/linkedin/modals/AddProjectModal";

import type {
  LinkedInProjectDraft,
} from "@/features/linkedin/modals/AddProjectModal";

export const Route = createFileRoute("/linkedin")({
  head: () => ({
    meta: [
      {
        title: "LinkedIn Analyzer — Launchly",
      },
      {
        name: "description",
        content:
          "Optimize your LinkedIn headline, About and keywords for recruiters in your niche.",
      },
    ],
  }),
  component: LinkedInPage,
});

const createProjectId = () =>
  crypto.randomUUID?.() || String(Date.now());

const formatLinkedInProject = (
  project: LinkedInProjectDraft,
) => {
  const skills =
    project.skills.length > 0
      ? ` Skills: ${project.skills.join(", ")}.`
      : "";

  return `${project.title} – ${project.description}.${skills}`;
};

function LinkedInPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  const {
    analysis,
    profile,
    isAnalyzing,
    isLoadingProfile,
    isSavingProfile,
    error,
    analyze,
    loadProfile,
    saveProfile,
    resetAnalysis,
    setAnalysis,
  } = useLinkedInAnalyzer();

  const hasLoadedProfileRef = useRef(false);

  const [headline, setHeadline] = useState("");
  const [about, setAbout] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [projectDrafts, setProjectDrafts] = useState<LinkedInProjectDraft[]>([]);
  const [editingProject, setEditingProject] =
    useState<LinkedInProjectDraft | null>(null);
  const [projectSkillInput, setProjectSkillInput] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saved"
  >("idle");
  const [linkedinTextLanguage, setLinkedinTextLanguage] =
    useState<"en" | "de">("en");

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (loading || !user || hasLoadedProfileRef.current) {
      return;
    }

    hasLoadedProfileRef.current = true;

    loadProfile().then((savedProfile) => {
      if (!savedProfile) {
        return;
      }


      setHeadline(savedProfile.headline || "");
      setAbout(savedProfile.about || "");
      setSkillsInput((savedProfile.skills || []).join(", "));
      setProjectDrafts(
          (savedProfile.projects || []).map((project, index) => {
            const [projectContent, skillsContent] =
              project.split(" Skills: ");

            const parsedSkills =
              skillsContent
                ?.replace(/\.$/, "")
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean) || [];

            return {
              id: String(index),
              title:
                projectContent.split("–")[0]?.trim() ||
                t("linkedin.linkedInProject"),
              description:
                projectContent
                  .split("–")
                  .slice(1)
                  .join("–")
                  .trim()
                  .replace(/\.$/, "") || projectContent,
              skills: parsedSkills,
            };
          }),
      );
      setTargetRole(savedProfile.target_role || "");
      setLinkedinTextLanguage(savedProfile.language === "de" ? "de" : "en");
      setAnalysis(savedProfile.analysis || null);
    });
  }, [user, loading]);


  const skills = useMemo(
    () =>
      skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    [skillsInput],
  );

  const projects = useMemo(
      () =>
        projectDrafts
            .filter(
                (project) =>
                    project.title.trim() ||
                    project.description.trim() ||
                    project.skills.length > 0,
            )
            .map(formatLinkedInProject),
      [projectDrafts],
  );

  const canAnalyze =
    headline.trim().length > 0 &&
    about.trim().length > 0 &&
    targetRole.trim().length > 0;

  const profileScore = analysis?.profile_score || 0;
  const headlineScore = analysis?.signals?.headline || 0;
  const aboutScore = analysis?.signals?.about || 0;
  const skillsScore = analysis?.signals?.skills || 0;
  const searchVisibilityScore =
    analysis?.signals?.search_visibility || 0;

  const handleAnalyzeLinkedInProfile = async () => {
    if (!canAnalyze || isAnalyzing) {
      return;
    }

    await analyze({
      language: linkedinTextLanguage,
      headline,
      about,
      skills,
      projects,
      target_role: targetRole,
    });

    setSaveStatus("saved");

    window.setTimeout(() => {
        setSaveStatus("idle");
    }, 1800);
  };

  const handleSaveLinkedInProfile = async () => {
    if (isSavingProfile) {
      return;
    }

    await saveProfile({
      language: linkedinTextLanguage,
      headline,
      about,
      skills,
      projects,
      target_role: targetRole,
      analysis,
      latest_profile_score: analysis?.profile_score ?? null,
      analyzed_at:
        profile?.analyzed_at ||
        (analysis ? new Date().toISOString() : null),
    });

    setSaveStatus("saved");

    window.setTimeout(() => {
      setSaveStatus("idle");
    }, 1800);
  };

  const handleInputChange = (
    setter: (value: string) => void,
    value: string,
  ) => {
    setter(value);
    resetAnalysis();
    setSaveStatus("idle");
  };

  const openNewProjectModal = () => {
    setEditingProject({
      id: createProjectId(),
      title: "",
      description: "",
      skills: [],
    });
    setProjectSkillInput("");
  };

  const addProjectSkill = () => {
    const value = projectSkillInput.trim();

    if (!value || !editingProject) return;

    if (editingProject.skills.includes(value)) {
      setProjectSkillInput("");
      return;
    }

    setEditingProject({
      ...editingProject,
      skills: [...editingProject.skills, value],
    });

    setProjectSkillInput("");
  };

  const removeProjectSkill = (skill: string) => {
    if (!editingProject) return;

    setEditingProject({
      ...editingProject,
      skills: editingProject.skills.filter(
        (item) => item !== skill,
      ),
    });
  };

  const deleteProject = (projectId: string) => {
    setProjectDrafts((prev) =>
      prev.filter(
        (project) => project.id !== projectId,
      ),
    );

    resetAnalysis();
    setSaveStatus("idle");
  };

  const saveProjectEditor = () => {
    if (!editingProject) return;

    setProjectDrafts((prev) => {
      const exists = prev.some(
        (item) => item.id === editingProject.id,
      );

      if (exists) {
        return prev.map((item) =>
          item.id === editingProject.id
            ? editingProject
            : item,
        );
      }

      return [...prev, editingProject];
    });

    resetAnalysis();
    setSaveStatus("idle");
    setEditingProject(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="text-sm text-white/60">
          {t("linkedin.loading")}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell
      title={t("linkedin.title")}
      subtitle={t("linkedin.subtitle")}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSaveLinkedInProfile}
            disabled={isSavingProfile || isLoadingProfile}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-cyan-300/25 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingProfile ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}

            {isSavingProfile
              ? t("common.saving")
              : saveStatus === "saved"
                ? t("resume.saved")
                : t("linkedin.saveProfile")}
          </button>

          <div className="flex rounded-xl border border-white/10 bg-white/[0.04] p-1 text-xs">
            {[
              ["en", t("common.english")],
              ["de", t("common.german")],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setLinkedinTextLanguage(value as "en" | "de");
                  resetAnalysis();
                  setSaveStatus("idle");
                }}
                className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                  linkedinTextLanguage === value
                    ? "bg-cyan-400/15 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.10)]"
                    : "text-white/45 hover:text-white/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={handleAnalyzeLinkedInProfile}
            disabled={!canAnalyze || isAnalyzing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Wand2 className="size-4" />
            )}

            {isAnalyzing
              ? t("linkedin.analyzing")
              : t("linkedin.analyzeLinkedInProfile")}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <Card className="relative overflow-hidden border-cyan-300/15 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(8,13,24,0.98)_48%,rgba(18,32,58,0.88))] shadow-[0_28px_90px_rgba(6,182,212,0.10),0_0_0_1px_rgba(255,255,255,0.03)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.20),transparent_34%),radial-gradient(circle_at_86%_10%,rgba(139,92,246,0.16),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.045),transparent_34%)]" />
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

            <div className="relative grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
              <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-black/25 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_80px_rgba(0,0,0,0.26)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_58%)]" />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/75">
                    <Linkedin className="size-3.5 text-cyan-300" />
                    {t("linkedin.profileStrength")}
                  </div>

                  <div className="relative isolate mx-auto mt-6 grid size-40 place-items-center overflow-hidden rounded-full border border-cyan-300/20 bg-white/[0.045] shadow-[0_28px_85px_rgba(34,211,238,0.16)]">
                    <div className="pointer-events-none absolute inset-4 rounded-full border border-violet-300/10" />
                    <div className="pointer-events-none absolute inset-8 rounded-full bg-black/20" />

                    <div className="relative z-10 text-center">
                      <div className="text-6xl font-semibold tracking-[-0.04em] text-white">
                        {profileScore}
                      </div>

                      <div className="mt-1 text-[10px] uppercase tracking-[0.24em] text-cyan-100/70">
                        /100
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Progress value={profileScore} />
                  </div>

                  <div className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/[0.08] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100">
                    <Check className="size-3.5 text-emerald-300" />
                    {profileScore >= 85
                      ? t("linkedin.recruiterReady")
                      : profileScore >= 70
                        ? t("linkedin.strongFoundation")
                        : profileScore > 0
                          ? t("linkedin.needsPolish")
                          : t("linkedin.awaitingAnalysis")}
                  </div>

                  <div className="mt-4 text-xs leading-5 text-white/55">
                    {analysis
                      ? profileScore >= 85
                        ? t("linkedin.strongRecruiterVisibility")
                        : t("linkedin.usefulBaseImproveVisibility")
                      : isLoadingProfile
                        ? t("linkedin.loadingSavedProfile")
                        : t("linkedin.addDetailsUnlockScore")}
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                      {t("linkedin.linkedinReadiness")}
                    </div>

                    <div className="mt-4 text-3xl font-semibold tracking-tight text-white">
                      {t("linkedin.heroTitle")}
                    </div>

                    <div className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                      {t("linkedin.heroDescription")}
                    </div>
                  </div>

                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/7 bg-white/[0.035] p-4">
                    <Progress
                      label={t("linkedin.headline")}
                      value={headlineScore}
                      color={headlineScore < 65 ? "pink" : undefined}
                    />
                  </div>

                  <div className="rounded-2xl border border-white/7 bg-white/[0.035] p-4">
                    <Progress
                      label={t("linkedin.about")}
                      value={aboutScore}
                    />
                  </div>

                  <div className="rounded-2xl border border-white/7 bg-white/[0.035] p-4">
                    <Progress
                      label={t("resume.skills")}
                      value={skillsScore}
                      color={skillsScore >= 80 ? "green" : undefined}
                    />
                  </div>

                  <div className="rounded-2xl border border-white/7 bg-white/[0.035] p-4">
                    <Progress
                      label={t("linkedin.searchVisibility")}
                      value={searchVisibilityScore}
                      color={searchVisibilityScore < 65 ? "pink" : "green"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-white/7 bg-white/[0.025]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_42%)]" />

            <div className="relative">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Search className="size-4 text-violet-300" />
                    {t("linkedin.missingRecruiterKeywords")}
                  </div>

                  <div className="mt-1 text-xs leading-5 text-white/45">
                    {t("linkedin.missingRecruiterKeywordsDescription")}
                  </div>
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[10px] text-white/45">
                  {t("linkedin.gapsCount", {
                    count: analysis?.missing_keywords?.length || 0,
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {analysis?.missing_keywords?.length ? (
                  analysis.missing_keywords.map((item) => (
                    <div
                      key={item.keyword}
                      className="rounded-2xl border border-violet-300/10 bg-violet-400/[0.045] px-3 py-3"
                    >
                      <div className="flex items-center gap-1 text-violet-100">
                        <Plus className="size-3" />
                        {item.keyword}
                      </div>

                      <div className="mt-1 text-[10px] leading-4 text-white/45">
                        {item.reason}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm leading-6 text-white/50">
                    {t("linkedin.missingKeywordsEmpty")}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <Card className="relative overflow-hidden border-cyan-300/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.96),rgba(8,13,24,0.98)_52%,rgba(24,18,54,0.78))] shadow-[0_24px_80px_rgba(6,182,212,0.08)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_90%_12%,rgba(139,92,246,0.16),transparent_38%)]" />

            <div className="relative">
              <div className="mb-5 flex flex-col gap-3 border-b border-white/5 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                <div className="flex items-center gap-2 text-base font-semibold text-white">
                  <Linkedin className="size-5 text-[oklch(0.78_0.16_200)]" />
                  {t("linkedin.headlineOptimizer")}
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  {t("linkedin.headlineOptimizerDescription")}
                </div>
                </div>

                <div className="rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-medium text-cyan-200">
                  {t("linkedin.primaryOptimizationArea")}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[1.75rem] border border-white/7 bg-black/25 p-5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("linkedin.currentHeadline")}
                  </div>

                  <textarea
                    value={headline}
                    onChange={(event) =>
                      handleInputChange(
                        setHeadline,
                        event.target.value,
                      )
                    }
                    rows={5}
                    placeholder={t("linkedin.headlinePlaceholder")}
                    className="w-full resize-none rounded-2xl border border-white/7 bg-white/[0.035] p-4 text-sm leading-7 text-white/75 outline-none transition placeholder:text-white/30 focus:border-cyan-300/25"
                  />

                  <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="size-3.5 text-orange-300" />
                      {t("linkedin.addRoleSkillsKeywords")}
                    </div>

                    <div className="flex items-center gap-2">
                      <AlertTriangle className="size-3.5 text-orange-300" />
                      {t("linkedin.avoidVagueDescriptions")}
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[1.75rem] border border-violet-400/15 bg-gradient-to-br from-violet-500/12 to-cyan-400/6 p-5 shadow-[0_24px_70px_rgba(139,92,246,0.12)]">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] animate-pulse" />

                  <div className="relative">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-200">
                      <Sparkles className="size-3.5" />
                      {t("linkedin.optimizedVersion")}
                    </div>

                    <div className="min-h-[138px] rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-7 text-white/90 shadow-[0_20px_60px_rgba(168,85,247,0.15)]">
                      {analysis?.headline_rewrite ||
                        t("linkedin.optimizedHeadlineEmpty")}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-[10px]">
                      <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-200">
                        {t("linkedin.searchOptimized")}
                      </span>

                      <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-cyan-200">
                        {t("linkedin.recruiterFriendly")}
                      </span>

                      <span className="rounded-full bg-violet-400/10 px-2 py-1 text-violet-200">
                        {t("linkedin.targetRoleAligned")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <input
                  value={targetRole}
                  onChange={(event) =>
                    handleInputChange(
                      setTargetRole,
                      event.target.value,
                    )
                  }
                  placeholder={t("interview.targetRole")}
                  className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80 outline-none transition placeholder:text-white/30 focus:border-violet-400/30 md:col-span-1"
                />

                <input
                  value={skillsInput}
                  onChange={(event) =>
                    handleInputChange(
                      setSkillsInput,
                      event.target.value,
                    )
                  }
                  placeholder={t("linkedin.skillsKeywordsPlaceholder")}
                  className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80 outline-none transition placeholder:text-white/30 focus:border-violet-400/30 md:col-span-2"
                />
              </div>

              {error && (
                <div className="mt-4 rounded-2xl border border-orange-400/10 bg-orange-400/[0.06] p-4 text-sm text-orange-200">
                  {error}
                </div>
              )}
            </div>
          </Card>

          <Card className="relative overflow-hidden border-white/7 bg-white/[0.025]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_45%)]" />

            <div className="relative">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                <Eye className="size-4 text-cyan-300" />
                {t("linkedin.recruiterVisibilityPreview")}
              </div>

              <div className="rounded-[1.75rem] border border-white/5 bg-black/20 p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <ScanSearch className="size-3.5" />
                  {t("linkedin.simulatedRecruiterSearch")}
                </div>

                <div className="mt-4 space-y-3">
                  {analysis?.recruiter_search_visibility?.length ? (
                    analysis.recruiter_search_visibility.map((item) => (
                      <div
                        key={item.title}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                      >
                        <div>
                          <div className="text-sm font-medium text-white/85">
                            {item.title}
                          </div>

                          <div className="mt-1 text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        </div>

                        <div className="shrink-0 rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                          {item.rank}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm text-white/55">
                      {t("linkedin.searchVisibilityEmpty")}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-[1.75rem] border border-emerald-400/10 bg-emerald-400/[0.045] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Check className="size-4 text-emerald-300" />
                  {t("linkedin.recruiterConclusion")}
                </div>

                <div className="mt-2 text-sm leading-7 text-white/70">
                  {analysis?.ai_conclusion ||
                    t("linkedin.recruiterConclusionEmpty")}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="relative overflow-hidden border-cyan-300/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_32%)]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent)]" />

          <div className="relative">
            <div className="mb-5 flex flex-col gap-3 border-b border-white/5 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-base font-semibold text-white">
                  <Plus className="size-4 text-cyan-300" />
                  {t("linkedin.proofPointsFeaturedWork")}
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  {t("linkedin.proofPointsDescription")}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/50">
                  {t("linkedin.addedCount", {
                    count: projectDrafts.length,
                  })}
                </div>

                <button
                  type="button"
                  onClick={openNewProjectModal}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
                >
                  <Plus className="size-4" />
                  {t("linkedin.addProject")}
                </button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="rounded-[1.75rem] border border-cyan-300/10 bg-cyan-300/[0.045] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/70">
                  {t("linkedin.evidenceStrength")}
                </div>

                <div className="mt-4 flex items-end gap-2">
                  <div className="text-4xl font-semibold tracking-tight text-white">
                    {projectDrafts.length}
                  </div>

                  <div className="mb-1 text-sm text-white/45">
                    {t("linkedin.projectsLower")}
                  </div>
                </div>

                <div className="mt-3 text-xs leading-5 text-white/55">
                  {t("linkedin.evidenceStrengthDescription")}
                </div>
              </div>

              <div>
                {projectDrafts.length === 0 ? (
                  <button
                    type="button"
                    onClick={openNewProjectModal}
                    className="flex min-h-[150px] w-full items-center justify-center rounded-[1.75rem] border border-dashed border-cyan-400/20 bg-cyan-400/[0.035] px-5 py-7 text-sm font-medium text-cyan-100/80 transition hover:bg-cyan-400/[0.06]"
                  >
                    <Plus className="mr-2 size-4" />
                    {t("linkedin.addFirstFeaturedProject")}
                  </button>
                ) : (
                  <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                    {projectDrafts.map((project) => (
                      <div
                        key={project.id}
                        className="group flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-3 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.04]"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(project);
                            setProjectSkillInput("");
                          }}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="truncate text-sm font-semibold text-white/90">
                            {project.title || t("linkedin.untitledProject")}
                          </div>

                          <div className="mt-1 flex items-center gap-2 text-[11px] text-white/40">
                            <span>
                              {t("linkedin.skillsCount", {
                                count: project.skills.length,
                              })}
                            </span>

                            {project.description && (
                              <>
                                <span className="size-1 rounded-full bg-white/20" />
                                <span>{t("linkedin.clickToEditDetails")}</span>
                              </>
                            )}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProject(project.id)}
                          className="shrink-0 rounded-xl border border-red-400/10 bg-red-400/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-red-200/80 opacity-70 transition hover:border-red-400/25 hover:bg-red-400/[0.10] hover:opacity-100"
                        >
                          {t("common.delete")}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <Card className="relative overflow-hidden border-violet-300/10 bg-white/[0.025]">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent)]" />

            <div className="relative">
              <div className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
                <MessageSquare className="size-4 text-violet-300" />
                {t("linkedin.aboutSectionPositioning")}
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("linkedin.currentAbout")}
                  </div>

                  <textarea
                    value={about}
                    onChange={(event) =>
                      handleInputChange(
                        setAbout,
                        event.target.value,
                      )
                    }
                    className="h-64 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-8 text-white/80 outline-none transition placeholder:text-white/30 focus:border-violet-400/30"
                    placeholder={t("linkedin.currentAboutPlaceholder")}
                  />
                </div>

                <div className="rounded-[1.75rem] border border-violet-400/10 bg-violet-400/[0.04] p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-200">
                    <Sparkles className="size-3.5" />
                    {t("linkedin.improvedAboutVersion")}
                  </div>

                  <div className="max-h-64 overflow-y-auto pr-2 text-sm leading-7 text-white/75">
                    {analysis?.about_rewrite ||
                      t("linkedin.improvedAboutEmpty")}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  [t("linkedin.headline"), headlineScore ? `${headlineScore}/100` : t("interview.pending")],
                  [
                    t("linkedin.profileClarity"),
                    analysis
                      ? `${analysis.match_breakdown.profile_clarity}/100`
                      : t("interview.pending"),
                  ],
                  [t("linkedin.projectEvidence"), projects.length ? t("linkedin.addedCount", { count: projects.length }) : t("linkedin.optional")],
                ].map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                  >
                    <div className="text-xs text-muted-foreground">
                      {key}
                    </div>

                    <div className="mt-2 text-lg font-semibold text-white/85">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </Card>

          <Card className="relative overflow-hidden border-white/7 bg-white/[0.025]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.08),transparent_40%)]" />

            <div className="relative">
              <div className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
                <Target className="size-4 text-cyan-300" />
                {t("linkedin.recruiterMatchBreakdown")}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  [
                    t("interview.targetRole"),
                    analysis?.match_breakdown?.target_role_match || 0,
                  ],
                  [
                    t("linkedin.keywords"),
                    analysis?.match_breakdown?.keyword_coverage || 0,
                  ],
                  [
                    t("linkedin.visibility"),
                    analysis?.match_breakdown?.search_visibility || 0,
                  ],
                  [
                    t("linkedin.clarity"),
                    analysis?.match_breakdown?.profile_clarity || 0,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[1.35rem] border border-white/7 bg-black/15 p-4"
                  >
                    <div className="text-xs text-white/45">
                      {label}
                    </div>

                    <div className="mt-2 flex items-end gap-1">
                      <div className="text-3xl font-semibold tracking-tight text-white">
                        {value}
                      </div>

                      <div className="mb-1 text-xs text-white/45">
                        /100
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress
                        value={Number(value)}
                        color={Number(value) >= 80 ? "green" : undefined}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[1.75rem] border border-orange-400/10 bg-orange-400/[0.045] p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <AlertTriangle className="size-4 text-orange-300" />
                  {t("linkedin.missingProofPoints")}
                </div>

                <div className="space-y-2 text-sm text-white/65">
                  {analysis?.match_breakdown?.missing_proof_points?.length ? (
                    analysis.match_breakdown.missing_proof_points.map(
                      (item) => (
                        <div
                          key={item}
                          className="flex gap-2"
                        >
                          <span className="mt-2 size-1.5 rounded-full bg-orange-300" />
                          <span>{item}</span>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="text-white/45">
                      {t("linkedin.missingProofPointsEmpty")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <AddProjectModal
        editingProject={editingProject}
        setEditingProject={setEditingProject}
        projectSkillInput={projectSkillInput}
        setProjectSkillInput={setProjectSkillInput}
        addProjectSkill={addProjectSkill}
        removeProjectSkill={removeProjectSkill}
        saveProjectEditor={saveProjectEditor}
      />
    </AppShell>
  );
}

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
                "LinkedIn Project",
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
      setAnalysis(savedProfile.analysis || null);
    });
  }, [user, loading]);

  useEffect(() => {
    if (!editingProject) {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [editingProject]);

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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    window.setTimeout(() => {
      setEditingProject({
        id: createProjectId(),
        title: "",
        description: "",
        skills: [],
      });
      setProjectSkillInput("");
    }, 250);
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
          Loading LinkedIn analyzer...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell
      title="LinkedIn Analyzer"
      subtitle="Headline, About and keyword strategy tuned for the recruiters in your niche."
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
              ? "Saving..."
              : saveStatus === "saved"
                ? "Saved"
                : "Save profile"}
          </button>

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
              ? "Analyzing..."
              : "Analyze LinkedIn Profile"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-4">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_40%)]" />

            <div className="relative">
              <div className="text-xs text-muted-foreground">
                Profile strength
              </div>

              <div className="mt-2 flex items-end gap-2">
                <div className="text-5xl font-semibold tracking-tight text-gradient">
                  {profileScore}
                </div>

                <div className="mb-2 text-sm text-muted-foreground">
                  /100
                </div>
              </div>

              <div className="mt-3">
                <Progress value={profileScore} />
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                {analysis
                  ? "Based on your provided LinkedIn profile inputs."
                  : isLoadingProfile
                    ? "Loading your saved LinkedIn profile..."
                    : "Enter your LinkedIn details, save them, and run an analysis."}
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="size-4 text-cyan-300" />
              Recruiter signals
            </div>

            <div className="space-y-3">
              <Progress
                label="Headline"
                value={headlineScore}
                color={headlineScore < 65 ? "pink" : undefined}
              />

              <Progress
                label="About"
                value={aboutScore}
              />

              <Progress
                label="Skills"
                value={skillsScore}
                color={skillsScore >= 80 ? "green" : undefined}
              />

              <Progress
                label="Search visibility"
                value={searchVisibilityScore}
                color={searchVisibilityScore < 65 ? "pink" : "green"}
              />
            </div>
          </Card>

          <Card className="relative overflow-hidden lg:col-span-2">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.10),transparent_40%)]" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Search className="size-4 text-violet-300" />
                Missing recruiter keywords
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {analysis?.missing_keywords?.length ? (
                  analysis.missing_keywords.map((item) => (
                    <div
                      key={item.keyword}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3"
                    >
                      <div className="flex items-center gap-1 text-[oklch(0.85_0.14_250)]">
                        <Plus className="size-3" />
                        {item.keyword}
                      </div>

                      <div className="mt-1 text-[10px] text-muted-foreground">
                        {item.reason}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm text-white/55">
                    Missing keywords will appear here after your analysis.
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <Card className="relative overflow-hidden lg:col-span-7">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />

            <div className="relative">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Linkedin className="size-4 text-[oklch(0.78_0.16_200)]" />
                    Headline AI Optimizer
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    Manual LinkedIn input, recruiter visibility analysis.
                  </div>
                </div>

                <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/10 px-2 py-1 text-[11px] text-cyan-200">
                  {isLoadingProfile
                    ? "Loading saved profile"
                    : saveStatus === "saved"
                      ? "Profile saved"
                      : analysis
                        ? "Analysis ready"
                        : "Input required"}
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Current headline
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
                    placeholder="Example: AI Engineer | Python, FastAPI, RAG, LLM"
                    className="w-full resize-none rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm leading-7 text-white/75 outline-none transition placeholder:text-white/30 focus:border-cyan-300/25"
                  />

                  <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="size-3.5 text-orange-300" />
                      Add role, core skills and searchable keywords.
                    </div>

                    <div className="flex items-center gap-2">
                      <AlertTriangle className="size-3.5 text-orange-300" />
                      Avoid vague descriptions without target-role context.
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/10 to-cyan-400/5 p-5">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] animate-pulse" />

                  <div className="relative">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-200">
                      <Sparkles className="size-3.5" />
                          Optimized Version
                    </div>

                    <div className="min-h-[138px] rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/90 shadow-[0_20px_60px_rgba(168,85,247,0.15)]">
                      {analysis?.headline_rewrite ||
                        "Your optimized LinkedIn headline will appear here after the analysis."}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-[10px]">
                      <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-200">
                        Search optimized
                      </span>

                      <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-cyan-200">
                        Recruiter friendly
                      </span>

                      <span className="rounded-full bg-violet-400/10 px-2 py-1 text-violet-200">
                        Target-role aligned
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
                  placeholder="Target role"
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 outline-none transition placeholder:text-white/30 focus:border-violet-400/30 md:col-span-1"
                />

                <input
                  value={skillsInput}
                  onChange={(event) =>
                    handleInputChange(
                      setSkillsInput,
                      event.target.value,
                    )
                  }
                  placeholder="Skills / keywords, separated by commas"
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 outline-none transition placeholder:text-white/30 focus:border-violet-400/30 md:col-span-2"
                />
              </div>

              {error && (
                <div className="mt-4 rounded-2xl border border-orange-400/10 bg-orange-400/[0.06] p-4 text-sm text-orange-200">
                  {error}
                </div>
              )}


            </div>
          </Card>

          <Card className="relative overflow-hidden lg:col-span-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_45%)]" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Eye className="size-4 text-cyan-300" />
                Recruiter search visibility
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <ScanSearch className="size-3.5" />
                  Simulated recruiter search
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
                      Search visibility scenarios will appear after the analysis.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Check className="size-4 text-emerald-300" />
                  Conclusion
                </div>

                <div className="mt-2 text-sm leading-7 text-white/70">
                  {analysis?.ai_conclusion ||
                    "Run an analysis to receive a concise recruiter-facing conclusion."}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="relative overflow-hidden border-white/5 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.06),transparent_32%)]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent)]" />

          <div className="relative">
            <div className="mb-4 flex flex-col gap-3 border-b border-white/5 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Plus className="size-4 text-cyan-300" />
                  LinkedIn projects / featured work
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  Add proof points that support your headline, About section and target role.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/50">
                  {projectDrafts.length} added
                </div>

                <button
                  type="button"
                  onClick={openNewProjectModal}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
                >
                  <Plus className="size-4" />
                  Add Project
                </button>
              </div>
            </div>

            {projectDrafts.length === 0 ? (
              <button
                type="button"
                onClick={openNewProjectModal}
                className="flex w-full items-center justify-center rounded-2xl border border-dashed border-cyan-400/20 bg-cyan-400/[0.035] px-5 py-7 text-sm font-medium text-cyan-100/80 transition hover:bg-cyan-400/[0.06]"
              >
                <Plus className="mr-2 size-4" />
                Add your first featured LinkedIn project
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
                        {project.title || "Untitled project"}
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-[11px] text-white/40">
                        <span>
                          {project.skills.length} skills
                        </span>

                        {project.description && (
                          <>
                            <span className="size-1 rounded-full bg-white/20" />
                            <span>Click to edit details</span>
                          </>
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProject(project.id)}
                      className="shrink-0 rounded-xl border border-red-400/10 bg-red-400/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-red-200/80 opacity-70 transition hover:border-red-400/25 hover:bg-red-400/[0.10] hover:opacity-100"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-12">
          <Card className="relative overflow-hidden lg:col-span-7">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <MessageSquare className="size-4 text-violet-300" />
                LinkedIn About Section
              </div>

              <textarea
                value={about}
                onChange={(event) =>
                  handleInputChange(
                    setAbout,
                    event.target.value,
                  )
                }
                className="h-52 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-8 text-white/80 outline-none transition placeholder:text-white/30 focus:border-violet-400/30"
                placeholder="Paste your current LinkedIn About section here..."
              />

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  ["Headline", headlineScore ? `${headlineScore}/100` : "Pending"],
                  [
                    "Profile clarity",
                    analysis
                      ? `${analysis.match_breakdown.profile_clarity}/100`
                      : "Pending",
                  ],
                  ["Project evidence", projects.length ? `${projects.length} added` : "Optional"],
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

              <div className="mt-4 rounded-2xl border border-violet-400/10 bg-violet-400/[0.04] p-5">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-200">
                  <Sparkles className="size-3.5" />
                  Improved About version
                </div>

                <div className="text-sm leading-7 text-white/75">
                  {analysis?.about_rewrite ||
                    "Your improved LinkedIn About section will appear here after the analysis."}
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden lg:col-span-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.08),transparent_40%)]" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Target className="size-4 text-cyan-300" />
                Recruiter match breakdown
              </div>

              <div className="space-y-3">
                <Progress
                  label="Target role match"
                  value={analysis?.match_breakdown?.target_role_match || 0}
                />

                <Progress
                  label="Keyword coverage"
                  value={analysis?.match_breakdown?.keyword_coverage || 0}
                  color="green"
                />

                <Progress
                  label="Search visibility"
                  value={analysis?.match_breakdown?.search_visibility || 0}
                />

                <Progress
                  label="Profile clarity"
                  value={analysis?.match_breakdown?.profile_clarity || 0}
                  color="green"
                />
              </div>

              <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="size-4 text-orange-300" />
                  Missing proof points
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
                      Missing proof points will appear after the analysis.
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

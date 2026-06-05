import { useEffect, useState } from "react";

import {
  useRecruiterView,
} from "@/features/recruiter/hooks/useRecruiterView";

import {
  useResumes,
} from "@/features/resume/hooks/useResumes";

import { ResumePreview } from "@/components/resume/ResumePreview";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, Card, Progress } from "@/components/launchly/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import {
  Eye,
  AlertTriangle,
  Check,
  Sparkles,
  ScanSearch,
  Activity,
  MousePointer2,
  Radar,
  Loader2,
  Zap,
  Target,
  SearchCheck,
} from "lucide-react";

export const Route = createFileRoute("/recruiter-view")({
  head: () => ({ meta: [{ title: "Recruiter View — Launchly" }, { name: "description", content: "See your profile through a recruiter's eyes with attention heatmaps and weak-spot detection." }] }),
  component: RecruiterView,
});

function RecruiterView() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language, t } = useI18n();


  const {
      analysis,
      isAnalyzing,
      isLoadingSavedAnalysis,
      analyze,
      loadSavedAnalysis,
      resetAnalysis,
  } = useRecruiterView();

  const [, setHasAnalyzed] =
      useState(false);

  const [previewZoom] =
      useState(0.62);

  const previewWidth = 794;
  const previewHeight = 1123;

  const scaledPreviewWidth =
      previewWidth * previewZoom;

  const scaledPreviewHeight =
      previewHeight * previewZoom;

  const [scanReplayKey, setScanReplayKey] =
      useState(0);

  const [animatedScore, setAnimatedScore] =
      useState(0);

  const [scanPhase, setScanPhase] =
      useState(0);

  const scanSteps = [
    t("recruiterView.scanningHeadlineClarity"),
    t("recruiterView.checkingRecruiterFirstImpression"),
    t("recruiterView.detectingMeasurableImpact"),
    t("recruiterView.mappingAttentionHotspots"),
    t("recruiterView.evaluatingTechnicalProof"),
    t("recruiterView.rankingStrongestEvidence"),
  ];

  const liveReasoning = [
    t("recruiterView.reasoningHeadlineFirst"),
    t("recruiterView.reasoningMetricsTrust"),
    t("recruiterView.reasoningProjectEvidence"),
    t("recruiterView.reasoningVisualHierarchy"),
  ];

  const fallbackGazePoints = [
      { x: 23, y: 13, label: t("recruiterView.headline"), second: 0.5, section: "headline" },
      { x: 63, y: 25, label: t("resume.skills"), second: 2, section: "skills" },
      { x: 38, y: 42, label: t("resume.experience"), second: 4, section: "experience" },
      { x: 71, y: 58, label: t("resume.projects"), second: 6, section: "projects" },
  ];

  const scanPath =
      analysis?.scan_path?.length
        ? analysis.scan_path
        : fallbackGazePoints;

  const attentionZones =
      analysis?.attention_zones || [];

  const getHeatmapColor = (attention: number) => {
      if (attention >= 75) {
        return "oklch(0.7 0.22 25)";
      }

      if (attention >= 45) {
        return "oklch(0.78 0.16 65)";
      }

      return "oklch(0.78 0.17 155)";
  };

  const timelineEvents =
      analysis?.recruiter_timeline || [];

  const dropOffPoints =
      analysis?.drop_off_points || [];

  const detectedKeywords = [
    t("recruiterView.metrics"),
    t("recruiterView.impact"),
    t("resume.projects"),
    t("resume.experience"),
  ];

  const {
      resumes,
      isLoading: resumesLoading,
  } = useResumes();

  const [
      selectedResumeId,
      setSelectedResumeId,
  ] = useState<number | string | null>(
      null,
  );

  useEffect(() => {
      if (
          !selectedResumeId &&
          resumes.length > 0
      ) {
          setSelectedResumeId(
              resumes[0].id,
          );
      }
  }, [resumes, selectedResumeId]);

  const selectedResumeRecord =
    resumes.find(
        (item) =>
            String(item.id) ===
            String(selectedResumeId),
    ) || null;

  const resume =
    selectedResumeRecord
        ? {
            ...selectedResumeRecord.data,
            id: selectedResumeRecord.id,
            title: selectedResumeRecord.title,
            template:
                selectedResumeRecord.template ||
                selectedResumeRecord.data?.template,
           }
        : null;

  const buildResumeContext = () => {
    return `
Name:
${resume?.basics?.fullName || ""}

Headline:
${resume?.basics?.title || ""}

Summary:
${resume?.summary?.content || ""}

Skills:
${resume?.skills
  ?.flatMap(
    (group: any) =>
      group.skills || [],
  )
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
`;
  };

  const handleAnalyzeRecruiterView =
    async () => {

      if (isAnalyzing) {
        return;
      }

      if (!resume) {
        console.warn(
          "No resume selected for recruiter scan",
        );
        return;
      }

      try {
        const response =
          await analyze({
            resume_id: selectedResumeId || resume.id,

            language,

            resume_content:
              buildResumeContext(),

            target_role:
              resume?.basics?.title || "",
          });

        setHasAnalyzed(true);

        return response;
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
      if (!loading && !user) {
          navigate({ to: "/login" });
      }
  }, [user, loading, navigate]);

  useEffect(() => {
      if (!selectedResumeId) {
        resetAnalysis();
        setHasAnalyzed(false);
        setAnimatedScore(0);
        setScanPhase(0);
        return;
      }

      setHasAnalyzed(false);
      setAnimatedScore(0);
      setScanPhase(0);

      loadSavedAnalysis(selectedResumeId).then((saved) => {
        if (saved?.analysis) {
          setHasAnalyzed(true);
        }
      });
  }, [
      selectedResumeId,
  ]);



  useEffect(() => {
    const target = analysis?.recruiter_score || 0;

    if (!target) {
      setAnimatedScore(0);
      return;
    }

    let current = 0;
    const step = Math.max(
      1,
      Math.ceil(target / 40),
    );

    const interval = window.setInterval(() => {
      current += step;

      if (current >= target) {
        setAnimatedScore(target);
        window.clearInterval(interval);
      } else {
        setAnimatedScore(current);
      }
    }, 28);

    return () => window.clearInterval(interval);
  }, [analysis?.recruiter_score]);

  useEffect(() => {
    if (!isAnalyzing) {
      setScanPhase(0);
      return;
    }

    const interval = window.setInterval(() => {
      setScanPhase(
        (prev) => (prev + 1) % scanSteps.length,
      );
    }, 900);

    return () => window.clearInterval(interval);
  }, [isAnalyzing, scanSteps.length]);


  if (loading || resumesLoading || isLoadingSavedAnalysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="text-sm text-white/60">
          {t("recruiterView.loading")}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <AppShell
      action={
        <div className="relative z-50 flex items-center pointer-events-auto">
          <button
            type="button"
            onClick={async () => {
              console.log("Recruiter scan triggered");

              setScanReplayKey((prev) => prev + 1);
              setAnimatedScore(0);
              setScanPhase(0);
              setHasAnalyzed(false);
              await handleAnalyzeRecruiterView();
            }}
            disabled={isAnalyzing}
            className="relative z-[9999] inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAnalyzing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Eye className="size-4" />
            )}

            {isAnalyzing
              ? t("recruiterView.analyzing")
              : analysis
                ? t("recruiterView.rerunScan")
                : t("recruiterView.startScan")}
          </button>
        </div>
      }
    >

      <div className="relative z-0 grid items-stretch gap-4 lg:grid-cols-12">
        <Card className="relative h-full overflow-hidden border-white/5 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_45%)] lg:col-span-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />

          {/* cinematic scanner glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 animate-[scan_6s_linear_infinite] bg-[linear-gradient(180deg,rgba(34,211,238,0),rgba(34,211,238,0.10),rgba(34,211,238,0))] blur-2xl" />

          {/* subtle grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />

          <div className="relative">
            <div className="mb-5 flex flex-col gap-4 border-b border-white/5 pb-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Radar className="size-4 text-cyan-300" />
                  {t("recruiterView.attentionHeatmap")}
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  {t("recruiterView.attentionHeatmapDescription")}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="group relative min-w-[220px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:border-cyan-300/25 hover:bg-white/[0.07]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_42%)] opacity-80" />

                  <div className="pointer-events-none absolute left-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-200">
                    <Radar className="size-3.5" />
                  </div>

                  <select
                    value={selectedResumeId || ""}
                    onChange={(event) => {
                      setSelectedResumeId(
                        event.target.value,
                      );

                      resetAnalysis();
                      setHasAnalyzed(false);
                      setAnimatedScore(0);
                      setScanPhase(0);
                    }}
                    className="relative z-10 h-11 w-full cursor-pointer appearance-none bg-transparent pl-12 pr-10 text-xs font-semibold text-white outline-none transition"
                  >
                    {resumes.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        className="bg-[#0b0f1a] text-white"
                      >
                        {item.title || t("recruiterView.untitledResume")}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/45 transition group-hover:text-cyan-200">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] px-4 py-2 text-xs text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
                  <Activity className="size-10" />
                  {isAnalyzing
                    ? t("recruiterView.scanningRecruiterAttention")
                    : t("recruiterView.simulationReady")}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_40%)] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
              {/* floating paper shadow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[92%] w-[82%] rounded-[36px] bg-black/40 blur-3xl" />
              </div>

              {/* recruiter scan line */}
              <div className="pointer-events-none absolute left-0 right-0 top-0 h-px animate-[scan_5s_linear_infinite] bg-cyan-300/60 shadow-[0_0_30px_rgba(34,211,238,0.8)]" />



              <div
                  className="relative mx-auto flex items-start justify-center overflow-hidden rounded-[34px] border border-black/5 bg-[#f4f4f5] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.30)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_50px_160px_rgba(0,0,0,0.38)]"
                  style={{
                    width: `${scaledPreviewWidth + 48}px`,
                    height: `${scaledPreviewHeight + 48}px`,
                    maxWidth: "100%",
                  }}
              >

                <div
                  key={scanReplayKey}
                  className="relative origin-top transition-transform duration-200"
                  style={{
                    transform: `scale(${previewZoom})`,
                    width: `${previewWidth}px`,
                    height: `${previewHeight}px`,
                  }}
                >
                  {resume ? (
                    <ResumePreview resume={resume} />
                  ) : (
                    <div className="flex h-[1123px] items-center justify-center bg-white text-sm text-black/50">
                      {t("recruiterView.selectResumePreview")}
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-24 animate-[scanDocument_4.2s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent blur-md" />

                    <div className="absolute inset-x-8 top-0 h-px animate-[scanDocument_4.2s_ease-in-out_infinite] bg-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.95)]" />
                  </div>

                  {/*
                      Scan path dots hidden for now.
                  */}

                  {/* Heatmap zones */}
                    {attentionZones.length > 0 ? (
                          attentionZones.map((zone, index) => {
                            const opacity =
                              zone.attention >= 75
                                ? 0.24
                                : zone.attention >= 45
                                  ? 0.18
                                  : 0.13;

                            const heatmapColor =
                                getHeatmapColor(zone.attention || 0);

                            return (
                              <div
                                key={`${zone.section}-${zone.label}-${index}`}
                                className="pointer-events-none absolute rounded-full blur-[80px] animate-pulse"
                                style={{
                                  left: `${zone.x}%`,
                                  top: `${zone.y}%`,
                                  width: `${zone.width}%`,
                                  height: `${zone.height}%`,
                                  opacity,
                                  backgroundColor: heatmapColor,
                                  animationDelay: `${zone.start_second}s`,
                                }}
                              />
                            );
                          })
                    ) : (
                          <>
                            <div className="pointer-events-none absolute left-[110px] top-[60px] size-52 rounded-full bg-[oklch(0.7_0.22_25)] opacity-20 blur-[90px] animate-pulse" />
                            <div className="pointer-events-none absolute right-[100px] top-[140px] size-40 rounded-full bg-[oklch(0.83_0.16_75)] opacity-15 blur-[80px] animate-pulse" />
                            <div className="pointer-events-none absolute left-[260px] top-[320px] size-64 rounded-full bg-[oklch(0.78_0.17_155)] opacity-12 blur-[100px] animate-pulse" />
                          </>
                    )}


                </div>

                <div className={`pointer-events-none absolute right-6 top-6 rounded-2xl bg-[oklch(0.72_0.20_295_/_0.08)] px-4 py-2 text-xs font-medium text-[oklch(0.55_0.18_200)] backdrop-blur-xl ${isAnalyzing ? "animate-pulse" : ""}`}>
                  {t("recruiterView.attentionScore", { score: animatedScore })}
                </div>

                <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-nowrap items-center justify-center gap-2">
                  {detectedKeywords.map((keyword, index) => (
                    <div
                      key={`${keyword}-${scanReplayKey}`}
                      className="flex animate-[keywordReveal_0.7s_ease-out_forwards] items-center gap-1.5 rounded-full border border-cyan-300/20 bg-slate-950/75 px-2.5 py-1.5 text-[9px] font-semibold tracking-[0.01em] text-white opacity-0 shadow-[0_10px_28px_rgba(0,0,0,0.32)] backdrop-blur-xl"
                      style={{
                        animationDelay: `${700 + index * 450}ms`,
                      }}
                    >
                      <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-cyan-300/15">
                        <Zap className="size-2.5 text-cyan-200" />
                      </div>

                      <span className="whitespace-nowrap leading-none">
                        {t("recruiterView.detectedKeyword", { keyword })}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-[oklch(0.7_0.22_25)] shadow-[0_0_18px_rgba(255,80,80,0.6)]" />
                <span className="text-xs text-white/70">
                  {t("recruiterView.highRecruiterAttention")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-[oklch(0.78_0.16_65)] shadow-[0_0_18px_rgba(255,180,80,0.5)]" />
                <span className="text-xs text-white/70">
                  {t("recruiterView.mediumAttention")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-[oklch(0.78_0.17_155)] shadow-[0_0_18px_rgba(120,255,180,0.45)]" />
                <span className="text-xs text-white/70">
                  {t("recruiterView.lowerAttention")}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 xl:grid-cols-3">
              {[
                {
                  t: t("recruiterView.strengths"),
                  c: "green",
                  items: analysis?.strengths || [],
                },
                {
                  t: t("recruiterView.weakSpots"),
                  c: "warning",
                  items: analysis?.weak_spots || [],
                },
                {
                  t: t("recruiterView.missingImpact"),
                  c: "pink",
                  items: analysis?.missing_impact || [],
                },
              ].map((b) => (
                <div
                  key={b.t}
                  className="min-h-[150px] rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-3 text-sm font-semibold">
                    {b.t}
                  </div>

                  <ul className="space-y-2 text-sm">
                    {b.items.length === 0 && (
                      <li className="text-sm text-white/45">
                        {t("recruiterView.runScanGenerateInsights")}
                      </li>
                    )}

                    {b.items.map((i) => (
                      <li key={i} className="flex gap-2">
                        <span
                          className={`mt-1.5 size-1.5 rounded-full ${
                            b.c === "green"
                              ? "bg-[oklch(0.78_0.17_155)]"
                              : b.c === "warning"
                                ? "bg-[oklch(0.83_0.16_75)]"
                                : "bg-[oklch(0.78_0.18_340)]"
                          }`}
                        />

                        <span className="text-white/75">
                          {i}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="lg:col-span-4 space-y-4">


          <Card>
            <div className="text-xs text-muted-foreground">{t("recruiterView.recruiterScore")}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className={`text-4xl font-semibold tracking-tight text-gradient ${isAnalyzing ? "animate-pulse" : ""}`}>
                {animatedScore}
              </div>
              <div className="text-sm text-muted-foreground">/ 100</div>
            </div>
            <Progress value={animatedScore} />
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ScanSearch className="size-4 text-cyan-300" />
              {t("recruiterView.liveAiReasoning")}
            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
              <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
                {isAnalyzing ? t("recruiterView.scanningNow") : t("recruiterView.latestScanLogic")}
              </div>

              <div className="min-h-[44px] text-sm leading-relaxed text-white/80">
                {isAnalyzing
                  ? scanSteps[scanPhase]
                  : liveReasoning[
                      Math.min(
                        Math.floor(
                          (analysis?.recruiter_score || 0) / 30,
                        ),
                        liveReasoning.length - 1,
                      )
                    ]}
              </div>

              <div className="mt-4 flex gap-1">
                {scanSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition ${
                      index <= scanPhase && isAnalyzing
                        ? "bg-cyan-300"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Card>
          <Card>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Activity className="size-4 text-cyan-300" />
                {t("recruiterView.timelineTitle")}
              </div>

              <div className="space-y-3">
                {(timelineEvents.length
                  ? timelineEvents
                  : [
                      {
                        second: 0,
                        title: t("recruiterView.initialScan"),
                        description: t("recruiterView.initialScanDescription"),
                        sentiment: "neutral",
                      },
                    ]
                ).map((event, index) => (
                  <div
                    key={`${event.second}-${index}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">
                      {event.second}s
                    </div>

                    <div className="mt-1 text-sm font-semibold text-white">
                      {event.title}
                    </div>

                    <div className="mt-1 text-xs leading-relaxed text-white/60">
                      {event.description}
                    </div>
                  </div>
                ))}
              </div>
          </Card>
          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Target className="size-4 text-cyan-300" />
              {t("recruiterView.signals")}
            </div>
            <div className="space-y-3">

              <Progress
                label={t("resume.readability")}
                value={
                  analysis?.signals
                    ?.readability || 0
                }
                color="green"
              />

              <Progress
                label={t("recruiterView.impactDensity")}
                value={
                  analysis?.signals
                    ?.impact_density || 0
                }
              />

              <Progress
                label={t("recruiterView.technicalDepth")}
                value={
                  analysis?.signals
                    ?.technical_depth || 0
                }
              />

              <Progress
                label={t("recruiterView.visualHierarchy")}
                value={
                  analysis?.signals
                    ?.visual_hierarchy || 0
                }
                color="green"
              />

            </div>
          </Card>
          <Card>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <AlertTriangle className="size-4 text-orange-300" />
                {t("recruiterView.attentionDropOff")}
              </div>

              <div className="space-y-3">
                {dropOffPoints.length === 0 ? (
                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-xs text-white/60">
                    {t("recruiterView.noAttentionDropOff")}
                  </div>
                ) : (
                  dropOffPoints.map((point, index) => (
                    <div
                      key={`${point.section}-${index}`}
                      className="rounded-2xl border border-orange-400/10 bg-orange-400/[0.05] p-3"
                    >
                      <div className="text-[11px] uppercase tracking-[0.18em] text-orange-200/70">
                        {point.second}s · {point.section}
                      </div>

                      <div className="mt-1 text-xs leading-relaxed text-white/70">
                        {point.reason}
                      </div>
                    </div>
                  ))
                )}
              </div>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-[oklch(0.85_0.14_250)]" />
            {t("recruiterView.recommendations")}
          </div>

          {!analysis && (
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-xs text-white/60">
              {t("recruiterView.runScanReceiveFeedback")}
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-3">
            {(analysis?.ai_feedback || []).map((item, index) => {
              const isWarning =
                item.type === "warning";

              const isSuccess =
                item.type === "success";

              return (
                <div
                  key={index}
                  className={`rounded-2xl border p-4 ${
                    isWarning
                      ? "border-orange-400/10 bg-orange-400/[0.06]"
                      : isSuccess
                        ? "border-emerald-400/10 bg-emerald-400/[0.05]"
                        : "border-cyan-400/10 bg-cyan-400/[0.05]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-2">
                      {isWarning ? (
                        <AlertTriangle className="mt-0.5 size-4 text-orange-300" />
                      ) : isSuccess ? (
                        <Check className="mt-0.5 size-4 text-emerald-300" />
                      ) : (
                        <Sparkles className="mt-0.5 size-4 text-cyan-300" />
                      )}

                      <div>
                        <div className="text-sm font-medium text-white">
                          {item.title}
                        </div>

                        <div className="mt-1 text-xs leading-relaxed text-white/60">
                          {item.description}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-white/70">
                      {item.confidence}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      </Card>

      <style>
        {`
          @keyframes scanDocument {
            0% {
              transform: translateY(-8%);
              opacity: 0;
            }

            12% {
              opacity: 1;
            }

            50% {
              opacity: 1;
            }

            100% {
              transform: translateY(1123px);
              opacity: 0;
            }
          }

          @keyframes keywordReveal {
            0% {
              opacity: 0;
              transform: translateY(10px) scale(0.96);
              filter: blur(6px);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes gazePulse {
            0% {
              opacity: 0;
              transform: scale(0.6);
            }

            18% {
              opacity: 1;
              transform: scale(1);
            }

            45% {
              opacity: 0.85;
              transform: scale(1.15);
            }

            100% {
              opacity: 0;
              transform: scale(0.7);
            }
          }
        `}
      </style>
    </AppShell>
  );
}

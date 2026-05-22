import { useEffect, useState } from "react";

import {
  analyzeRecruiterView,
} from "@/features/recruiter/api/recruiterApi";

import type {
  RecruiterViewResponse,
} from "@/features/recruiter/types/recruiterView";

import {
  useResumes,
} from "@/features/resume/hooks/useResumes";

import { ResumePreview } from "@/components/resume/ResumePreview";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, Card, Progress } from "@/components/launchly/AppShell";
import { useAuth } from "@/context/AuthContext";
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

  const [language, setLanguage] =
      useState("english");

  const [analysis, setAnalysis] =
      useState<RecruiterViewResponse | null>(
        null,
      );

  const [isAnalyzing, setIsAnalyzing] =
      useState(false);
  const [hasAnalyzed, setHasAnalyzed] =
      useState(false);

  const [previewZoom, setPreviewZoom] =
      useState(0.60);

  const [scanReplayKey, setScanReplayKey] =
      useState(0);

  const [animatedScore, setAnimatedScore] =
      useState(0);

  const [scanPhase, setScanPhase] =
      useState(0);

  const scanSteps = [
    "Scanning headline clarity...",
    "Checking recruiter first impression...",
    "Detecting measurable impact...",
    "Mapping attention hotspots...",
    "Evaluating technical proof...",
    "Ranking strongest evidence...",
  ];

  const liveReasoning = [
    "Recruiters usually scan the headline first.",
    "Metrics and outcomes increase trust quickly.",
    "Project evidence is more valuable than generic claims.",
    "Weak visual hierarchy can hide strong experience.",
  ];

  const gazePoints = [
    { left: "23%", top: "13%" },
    { left: "63%", top: "25%" },
    { left: "38%", top: "42%" },
    { left: "71%", top: "58%" },
    { left: "30%", top: "72%" },
  ];

  const detectedKeywords = [
    "Metrics",
    "Impact",
    "Projects",
    "Experience",
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
        setIsAnalyzing(true);

        const response =
          await analyzeRecruiterView({
            language,

            resume_content:
              buildResumeContext(),

            target_role:
              resume?.basics?.title || "",
          });

        setAnalysis(response);
        setHasAnalyzed(true);

      } catch (error) {
        console.error(error);

      } finally {
        setIsAnalyzing(false);
      }
    };

  useEffect(() => {
      if (!loading && !user) {
          navigate({ to: "/login" });
      }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!resume) {
      return;
    }

    setAnalysis(null);
    setHasAnalyzed(false);
  }, [
      selectedResumeId,
      language,
  ]);


  useEffect(() => {
    if (!resume || hasAnalyzed) {
      return;
    }

    handleAnalyzeRecruiterView();
  }, [
    resume?.id,
    hasAnalyzed,
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


  if (loading || resumesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="text-sm text-white/60">
          Loading recruiter view...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <AppShell
      title="Recruiter View"
      subtitle="A 7-second simulated recruiter scan of your profile — with the receipts."
      action={
        <div className="relative z-50 flex items-center pointer-events-auto">
          <button
            type="button"
            onClick={async () => {
              console.log("Recruiter scan triggered");

              setScanReplayKey((prev) => prev + 1);
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
              ? "Analyzing..."
              : analysis
                ? "Re-run scan"
                : "Start scan"}
          </button>
        </div>
      }
    >

      <div className="relative z-0 grid gap-4 lg:grid-cols-12">
        <Card className="relative overflow-hidden border-white/5 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_45%)] lg:col-span-8">
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
                  Attention heatmap
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  First 7 seconds · simulated recruiter scan of your selected resume
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <select
                  value={selectedResumeId || ""}
                  onChange={(event) => {
                    setSelectedResumeId(
                      event.target.value,
                    );

                    setAnalysis(null);
                    setHasAnalyzed(false);
                  }}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white outline-none transition hover:bg-white/[0.07]"
                >
                  {resumes.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      className="bg-[#0b0f1a] text-white"
                    >
                      {item.title || "Untitled Resume"}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] px-4 py-2 text-xs text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
                  <Activity className="size-10" />
                  {isAnalyzing
                    ? "Scanning recruiter attention"
                    : "Recruiter simulation ready"}
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

              {/* eye tracking paths */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
                viewBox="0 0 1000 700"
                preserveAspectRatio="none"
              >
                <path
                  d="M210 110 C 330 140, 430 190, 535 265"
                  stroke="rgba(34,211,238,0.35)"
                  strokeWidth="2"
                  strokeDasharray="10 12"
                  fill="none"
                  className="animate-pulse"
                />

                <path
                  d="M535 265 C 675 335, 735 420, 620 545"
                  stroke="rgba(168,85,247,0.30)"
                  strokeWidth="2"
                  strokeDasharray="10 12"
                  fill="none"
                  className="animate-pulse"
                />

                <path
                  d="M250 520 C 380 430, 540 420, 720 500"
                  stroke="rgba(52,211,153,0.25)"
                  strokeWidth="2"
                  strokeDasharray="8 14"
                  fill="none"
                  className="animate-pulse"
                />

                <circle
                  cx="210"
                  cy="110"
                  r="5"
                  fill="rgba(34,211,238,0.85)"
                  className="animate-ping"
                />

                <circle
                  cx="535"
                  cy="265"
                  r="5"
                  fill="rgba(168,85,247,0.80)"
                  className="animate-pulse"
                />

                <circle
                  cx="720"
                  cy="500"
                  r="5"
                  fill="rgba(52,211,153,0.75)"
                  className="animate-ping"
                />
              </svg>

              <div className="relative mx-auto flex max-h-[760px] max-w-[760px] items-start justify-center overflow-hidden rounded-[34px] border border-black/5 bg-[#f4f4f5] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.30)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_50px_160px_rgba(0,0,0,0.38)]">

                <div
                  key={scanReplayKey}
                  className="relative origin-top transition-transform duration-200"
                  style={{
                    transform: `scale(${previewZoom})`,
                    width: "794px",
                    minHeight: "1123px",
                  }}
                >
                  {resume ? (
                    <ResumePreview resume={resume} />
                  ) : (
                    <div className="flex min-h-[1123px] items-center justify-center bg-white text-sm text-black/50">
                      Select a resume to preview the recruiter scan.
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-24 animate-[scanDocument_4.2s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent blur-md" />

                    <div className="absolute inset-x-8 top-0 h-px animate-[scanDocument_4.2s_ease-in-out_infinite] bg-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.95)]" />
                  </div>

                  {gazePoints.map((point, index) => (
                    <div
                      key={`${point.left}-${point.top}-${index}`}
                      className="pointer-events-none absolute size-4 rounded-full border border-cyan-300/50 bg-cyan-300/70 shadow-[0_0_24px_rgba(34,211,238,0.9)]"
                      style={{
                        left: point.left,
                        top: point.top,
                        animation: "gazePulse 4.8s ease-in-out infinite",
                        animationDelay: `${index * 0.65}s`,
                      }}
                    >
                      <div className="absolute inset-[-10px] rounded-full border border-cyan-300/30 animate-ping" />
                    </div>
                  ))}
                  {/* Heatmap zones */}
                    <div className="pointer-events-none absolute left-[110px] top-[60px] size-52 rounded-full bg-[oklch(0.7_0.22_25)] opacity-20 blur-[90px] animate-pulse" />

                    <div className="pointer-events-none absolute right-[100px] top-[140px] size-40 rounded-full bg-[oklch(0.83_0.16_75)] opacity-15 blur-[80px] animate-pulse" />

                    <div className="pointer-events-none absolute left-[260px] top-[320px] size-64 rounded-full bg-[oklch(0.78_0.17_155)] opacity-12 blur-[100px] animate-pulse" />

                    <div className="pointer-events-none absolute right-[180px] bottom-[150px] size-52 rounded-full bg-[oklch(0.8_0.18_75)] opacity-12 blur-[90px] animate-pulse" />

                  {/* Focus hotspots */}
                    <div className="pointer-events-none absolute left-[170px] top-[105px] flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/55 px-4 py-2 text-[20px] font-semibold tracking-[0.01em] text-cyan-950 shadow-[0_12px_40px_rgba(34,211,238,0.12)] backdrop-blur-xl">
                      <MousePointer2 className="size-4" />
                      Initial focus
                    </div>

                    <div className="pointer-events-none absolute left-1/2 top-[255px] flex -translate-x-1/2 items-center gap-2 rounded-full border border-violet-400/20 bg-white/55 px-4 py-2 text-[20px] font-semibold tracking-[0.01em] text-violet-950 shadow-[0_12px_40px_rgba(168,85,247,0.12)] backdrop-blur-xl">
                      <ScanSearch className="size-4" />
                      Metrics detected
                    </div>

                    <div className="pointer-events-none absolute left-[320px] top-[485px] flex items-center gap-2 rounded-full border border-emerald-400/20 bg-white/55 px-4 py-2 text-[20px] font-semibold tracking-[0.01em] text-emerald-950 shadow-[0_12px_40px_rgba(52,211,153,0.12)] backdrop-blur-xl">
                      <SearchCheck className="size-4" />
                      Relevant evidence
                    </div>
                </div>

                <div className={`pointer-events-none absolute right-6 top-6 rounded-2xl bg-[oklch(0.72_0.20_295_/_0.08)] px-4 py-2 text-xs font-medium text-[oklch(0.55_0.18_200)] backdrop-blur-xl ${isAnalyzing ? "animate-pulse" : ""}`}>
                  Attention score: {animatedScore}/100
                </div>

                <div className="pointer-events-none absolute bottom-5 left-1/2 flex w-max -translate-x-1/2 flex-nowrap items-center justify-center gap-2">
                  {detectedKeywords.map((keyword, index) => (
                    <div
                      key={`${keyword}-${scanReplayKey}`}
                      className="flex translate-y-2 animate-[keywordReveal_0.7s_ease-out_forwards] items-center gap-1.5 rounded-full border border-cyan-300/20 bg-slate-950/75 px-3 py-1.5 text-[10px] font-semibold tracking-[0.01em] text-white opacity-0 shadow-[0_10px_28px_rgba(0,0,0,0.32)] backdrop-blur-xl"
                      style={{
                        animationDelay: `${700 + index * 450}ms`,
                      }}
                    >
                      <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-cyan-300/15">
                        <Zap className="size-2.5 text-cyan-200" />
                      </div>

                      <span className="whitespace-nowrap leading-none">
                        Detected {keyword}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="size-2.5 rounded-full bg-[oklch(0.7_0.22_25)]" />
                High attention
              </span>

              <span className="inline-flex items-center gap-1">
                <span className="size-2.5 rounded-full bg-[oklch(0.83_0.16_75)]" />
                Medium attention
              </span>

              <span className="inline-flex items-center gap-1">
                <span className="size-2.5 rounded-full bg-[oklch(0.78_0.17_155)]" />
                Low attention
              </span>

              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px]">
                Selected resume replay
              </span>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-4 space-y-4">

          <Card>

            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="size-4 text-violet-300" />
              Language
            </div>

            <div className="grid grid-cols-2 gap-3">

              {[
                {
                  value: "english",
                  label: "English",
                },
                {
                  value: "german",
                  label: "German",
                },
              ].map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => {
                    setLanguage(lang.value);
                    setAnalysis(null);
                    setHasAnalyzed(false);
                  }}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    language === lang.value
                      ? "border-violet-400/30 bg-violet-500/10"
                      : "border-white/5 bg-white/[0.03]"
                  }`}
                >
                  {lang.label}
                </button>
              ))}

            </div>

          </Card>

          <Card>
            <div className="text-xs text-muted-foreground">Recruiter Score</div>
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
              Live AI reasoning
            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
              <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
                {isAnalyzing ? "Scanning now" : "Latest scan logic"}
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
              <Target className="size-4 text-cyan-300" />
              Signals
            </div>
            <div className="space-y-3">

              <Progress
                label="Readability"
                value={
                  analysis?.signals
                    ?.readability || 0
                }
                color="green"
              />

              <Progress
                label="Impact density"
                value={
                  analysis?.signals
                    ?.impact_density || 0
                }
              />

              <Progress
                label="Technical depth"
                value={
                  analysis?.signals
                    ?.technical_depth || 0
                }
              />

              <Progress
                label="Visual hierarchy"
                value={
                  analysis?.signals
                    ?.visual_hierarchy || 0
                }
                color="green"
              />

            </div>
          </Card>
          <Card>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4 text-[oklch(0.85_0.14_250)]"/> AI panel feedback</div>
            <div className="space-y-3">

              {!analysis && (
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-xs text-white/60">
                  Run a recruiter scan to receive AI feedback.
                </div>
              )}

              {(analysis?.ai_feedback || []).map(
                (item, index) => {

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

                            <div className="mt-1 text-xs text-white/60">
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
                },
              )}

            </div>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">

        {[
          {
            t: "Strengths",
            c: "green",
            items:
              analysis?.strengths || [],
          },
          {
            t: "Weak spots",
            c: "warning",
            items:
              analysis?.weak_spots || [],
          },
          {
            t: "Missing impact",
            c: "pink",
            items:
              analysis?.missing_impact || [],
          },
        ].map((b) => (
          <Card key={b.t}>

            <div className="mb-3 text-sm font-semibold">
              {b.t}
            </div>

            <ul className="space-y-2 text-sm">

              {b.items.length === 0 && (
                <li className="text-sm text-white/45">
                  Run a recruiter scan to generate insights.
                </li>
              )}

              {b.items.map((i) => (
                <li
                  key={i}
                  className="flex gap-2"
                >

                  <span
                    className={`mt-1.5 size-1.5 rounded-full ${
                      b.c === "green"
                        ? "bg-[oklch(0.78_0.17_155)]"
                        : b.c === "warning"
                          ? "bg-[oklch(0.83_0.16_75)]"
                          : "bg-[oklch(0.78_0.18_340)]"
                    }`}
                  />

                  {i}

                </li>
              ))}

            </ul>

          </Card>
        ))}

      </div>
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

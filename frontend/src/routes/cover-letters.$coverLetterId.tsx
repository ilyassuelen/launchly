import {
  createFileRoute,
  redirect,
  useParams,
} from "@tanstack/react-router";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useReactToPrint } from "react-to-print";

import {
  AppShell,
  Card,
} from "@/components/launchly/AppShell";

import { useCoverLetter } from "@/features/cover-letter/hooks/useCoverLetter";
import { CoverLetterRenderer } from "@/components/cover-letter/CoverLetterRenderer";

import { CoverLetterRightPanel } from "@/features/cover-letter/components/layout/CoverLetterRightPanel";

import { CoverLetterInsightsPanel } from "@/features/cover-letter/components/layout/CoverLetterInsightsPanel";

import { generateAICoverLetter } from "@/features/cover-letter/api/coverLetterApi";
import {
  getResumes,
  getResume,
} from "@/features/resume/api/resumeApi";

import {
  analyzeCoverLetter,
} from "@/features/cover-letter/api/coverLetterApi";

import type {
  CoverLetterAnalysis,
} from "@/features/cover-letter/types/coverLetterAnalysis";

import {
  Download,
  WandSparkles,
  ZoomIn,
  ZoomOut,
  Save,
  Copy,
  Loader2
} from "lucide-react";

export const Route =
  createFileRoute(
    "/cover-letters/$coverLetterId",
  )({
    beforeLoad: () => {
      if (
        typeof window === "undefined"
      ) {
        return;
      }

      const token =
        localStorage.getItem(
          "access_token",
        );

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
            "AI Cover Letter Builder — Launchly",
        },
        {
          name: "description",
          content:
            "Generate recruiter-focused cover letters with live AI personalization.",
        },
      ],
    }),

    component: CoverLetterBuilder,
  });

function CoverLetterBuilder() {
  const { coverLetterId } =
    useParams({
      from:
        "/cover-letters/$coverLetterId",
    });

  const {
    coverLetter,
    setCoverLetter,
    isLoading,
    saveCoverLetter,
  } = useCoverLetter(
    coverLetterId,
  );

  const [zoom, setZoom] =
    useState(0.82);

  const [resumes, setResumes] =
    useState<any[]>([]);

  const [
      isGenerating,
      setIsGenerating,
  ] = useState(false);

  const [
      analysis,
      setAnalysis,
  ] = useState<CoverLetterAnalysis | null>(
      null,
  );

  const [
      isAnalyzing,
      setIsAnalyzing,
  ] = useState(false);

  const typography =
      coverLetter?.typography || {
        fontFamily: "Inter",
        fontSize: 15,
        lineHeight: 1.9,
      };

  const [
    saveStatus,
    setSaveStatus,
  ] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  const printRef =
    useRef<HTMLDivElement>(null);

  const handlePrint =
    useReactToPrint({
      contentRef: printRef,

      documentTitle: `${
        coverLetter?.title ||
        "Cover_Letter"
      }`,

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

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 outline-none transition focus:border-violet-400/30";

const textareaClassName =
  "w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 outline-none transition focus:border-violet-400/30";

  useEffect(() => {
      async function loadResumes() {
        try {
          const response =
            await getResumes();

          setResumes(
            response?.data ||
            response ||
            [],
          );
        } catch (error) {
          console.error(error);
        }
      }

      loadResumes();
  }, []);

  useEffect(() => {
    if (!coverLetter?.content?.body) {
      setAnalysis(null);
    }
  }, [coverLetter?.content?.body]);

  if (
    isLoading ||
    !coverLetter
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="text-sm text-white/60">
          Loading cover letter...
        </div>
      </div>
    );
  }

  const handleSave =
    async () => {
      try {
        setSaveStatus(
          "saving",
        );

        await saveCoverLetter();

        setSaveStatus(
          "saved",
        );

        setTimeout(() => {
          setSaveStatus(
            "idle",
          );
        }, 2000);
      } catch (error) {
        console.error(
          error,
        );

        setSaveStatus(
          "idle",
        );
      }
    };

  const updateField = (
    field: string,
    value: string,
  ) => {
    setCoverLetter((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedField = (
      section: "sender" | "recipient" | "content",
      field: string,
      value: string,
    ) => {
      setCoverLetter((prev: any) => ({
        ...prev,

        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
  };

  const updateTypography = (
      updates: Partial<typeof typography>,
    ) => {
      setCoverLetter((prev: any) => ({
        ...prev,

        typography: {
          ...(prev.typography || {
            fontFamily: "Inter",
            fontSize: 15,
            lineHeight: 1.9,
          }),

          ...updates,
        },
      }));
  };

  const handleGenerateCoverLetter =
      async () => {
        try {
          setIsGenerating(true);

          const response =
            await generateAICoverLetter({
              language:
                coverLetter.language ||
                "english",

              tone:
                coverLetter.tone,

              sender_name:
                coverLetter.sender.fullName,

              current_role:
                coverLetter.sender.currentRole ||
                "",

              skills:
                coverLetter.sender.skills ||
                [],

              resume_context:
                coverLetter.resumeContext || "",

              job_posting:
                coverLetter.jobPosting,
            });

          setCoverLetter(
            (prev: any) => ({
              ...prev,

              content: {
                ...prev.content,

                subject:
                  response.subject,

                body:
                  response.body,
              },
            }),
          );
        } catch (error) {
          console.error(error);
        } finally {
          setIsGenerating(false);
        }
      };

  const handleAnalyzeCoverLetter =
      async (
        body: string,
        subject: string,
      ) => {
        try {
          setIsAnalyzing(true);

          const response =
            await analyzeCoverLetter({
              tone:
                coverLetter.tone,

              language:
                coverLetter.language || "english",

              job_posting:
                coverLetter.jobPosting,

              subject,

              body,
            });

          setAnalysis(response);
        } catch (error) {
          console.error(error);
        } finally {
          setIsAnalyzing(false);
        }
      };

  return (
    <AppShell
      defaultSidebarCollapsed
      title="Cover Letter Builder"
      subtitle="Tailored, recruiter-focused — generated from any job posting in seconds."
    >
      <div className="grid gap-4 lg:grid-cols-12">

        {/* LEFT PANEL */}
        <Card className="overflow-hidden lg:col-span-3">

          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <div className="text-sm font-semibold">
                Cover letter editor
              </div>

              <div className="mt-1 text-xs text-muted-foreground">
                Personalize your letter and recruiter details
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-5">

            <div>
              <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                Personal Information
              </div>

              <div className="space-y-3">
                <input
                    value={
                      coverLetter.sender?.fullName || ""
                    }
                    onChange={(e) =>
                      updateNestedField(
                        "sender",
                        "fullName",
                        e.target.value,
                      )
                    }
                    placeholder="Full name"
                    className={inputClassName}
                  />

                  <input
                    value={
                      coverLetter.sender?.street || ""
                    }
                    onChange={(e) =>
                      updateNestedField(
                        "sender",
                        "street",
                        e.target.value,
                      )
                    }
                    placeholder="Street"
                    className={inputClassName}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={
                        coverLetter.sender?.zip || ""
                      }
                      onChange={(e) =>
                        updateNestedField(
                          "sender",
                          "zip",
                          e.target.value,
                        )
                      }
                      placeholder="ZIP Code"
                      className={inputClassName}
                    />

                    <input
                      value={
                        coverLetter.sender?.city || ""
                      }
                      onChange={(e) =>
                        updateNestedField(
                          "sender",
                          "city",
                          e.target.value,
                        )
                      }
                      placeholder="City"
                      className={inputClassName}
                    />
                  </div>

                  <input
                    value={
                      coverLetter.sender?.email || ""
                    }
                    onChange={(e) =>
                      updateNestedField(
                        "sender",
                        "email",
                        e.target.value,
                      )
                    }
                    placeholder="Email address"
                    className={inputClassName}
                  />

                  <input
                    value={
                      coverLetter.sender?.phone || ""
                    }
                    onChange={(e) =>
                      updateNestedField(
                        "sender",
                        "phone",
                        e.target.value,
                      )
                    }
                    placeholder="Phone number"
                    className={inputClassName}
                  />
                              </div>
                            </div>

                            <div>
                              <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                                Company Information
                              </div>

                              <div className="space-y-3">
                                <input
                                    value={
                                      coverLetter.recipient?.companyName || ""
                                    }
                                    onChange={(e) =>
                                      updateNestedField(
                                        "recipient",
                                        "companyName",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Company name"
                                    className={inputClassName}
                                  />

                                  <input
                                    value={
                                      coverLetter.recipient?.contactName || ""
                                    }
                                    onChange={(e) =>
                                      updateNestedField(
                                        "recipient",
                                        "contactName",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Hiring contact"
                                    className={inputClassName}
                                  />

                                  <input
                                    value={
                                      coverLetter.recipient?.street || ""
                                    }
                                    onChange={(e) =>
                                      updateNestedField(
                                        "recipient",
                                        "street",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Street"
                                    className={inputClassName}
                                  />

                                  <div className="grid grid-cols-2 gap-3">
                                    <input
                                      value={
                                        coverLetter.recipient?.zip || ""
                                      }
                                      onChange={(e) =>
                                        updateNestedField(
                                          "recipient",
                                          "zip",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="ZIP Code"
                                      className={inputClassName}
                                    />

                                    <input
                                      value={
                                        coverLetter.recipient?.city || ""
                                      }
                                      onChange={(e) =>
                                        updateNestedField(
                                          "recipient",
                                          "city",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="City"
                                      className={inputClassName}
                                    />
                                  </div>
              </div>
            </div>

            <div>
              <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                Letter Content
              </div>

              <div className="space-y-3">

                <input
                  value={coverLetter.date || ""}
                  onChange={(e) =>
                    updateField(
                      "date",
                      e.target.value,
                    )
                  }
                  placeholder="Date"
                  className={inputClassName}
                />

                <input
                  value={
                    coverLetter.content?.subject || ""
                  }
                  onChange={(e) => {
                      const value = e.target.value;

                      updateNestedField(
                        "content",
                        "subject",
                        value,
                      );

                      updateField(
                        "title",
                        value,
                      );
                  }}
                  placeholder="Subject / title"
                  className={inputClassName}
                />

                <textarea
                  value={
                    coverLetter.content?.body || ""
                  }
                  onChange={(e) =>
                    updateNestedField(
                      "content",
                      "body",
                      e.target.value,
                    )
                  }
                  placeholder="Write your cover letter body here..."
                  rows={14}
                  className={textareaClassName}
                />

                <textarea
                  value={
                    coverLetter.content?.closing || ""
                  }
                  onChange={(e) =>
                    updateNestedField(
                      "content",
                      "closing",
                      e.target.value,
                    )
                  }
                  placeholder="Closing"
                  rows={3}
                  className={textareaClassName}
                />

              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Tone
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  "Confident",
                  "Warm",
                  "Concise",
                ].map((tone) => (
                  <button
                    key={tone}
                    onClick={() =>
                      updateField(
                        "tone",
                        tone,
                      )
                    }
                    className={`rounded-2xl px-3 py-3 text-sm transition ${
                      coverLetter.tone ===
                      tone
                        ? "bg-gradient-brand text-primary-foreground shadow-[0_12px_40px_rgba(168,85,247,0.35)]"
                        : "border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]"
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Resume
              </div>

              <select
                value={
                  coverLetter.selectedResumeId || ""
                }
                onChange={async (e) => {
                  const resumeId =
                    e.target.value;

                  updateField(
                    "selectedResumeId",
                    resumeId,
                  );

                  if (!resumeId) {
                      updateField(
                          "resumeContext",
                          "",
                      );
                      return;
                  }

                  try {
                    const response =
                      await getResume(
                        resumeId,
                      );

                    const resume =
                      response?.data ||
                      response;

                    if (!resume) {
                      return;
                    }

                    const resumeContext = `
Name:
${resume.personalInfo?.fullName || ""}

Headline:
${resume.personalInfo?.headline || ""}

Summary:
${resume.summary || ""}

Skills:
${resume.skills
  ?.map((s: any) => s.name)
  .join(", ") || ""}

Projects:
${resume.projects
  ?.map(
    (p: any) =>
      `${p.title}: ${p.description}`,
  )
  .join("\n") || ""}
`;

                    updateField(
                      "resumeContext",
                      resumeContext,
                    );
                  } catch (error) {
                    console.error(error);
                  }
                }}
                className={inputClassName}
              >
                <option value="">
                  Select a resume
                </option>

                {resumes.map((resume) => (
                  <option
                    key={resume.id}
                    value={resume.id}
                  >
                    {resume.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                Job Posting
              </div>

              <textarea
                value={coverLetter.jobPosting}
                onChange={(e) =>
                  updateField(
                    "jobPosting",
                    e.target.value,
                  )
                }
                placeholder="Paste the job posting here..."
                rows={10}
                className={textareaClassName}
              />
            </div>

            <button
              onClick={handleGenerateCoverLetter}
              disabled={isGenerating}
              className="
                mt-4
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-gradient-brand
                px-4
                py-3
                text-sm
                font-semibold
                text-primary-foreground
                shadow-[0_15px_50px_rgba(168,85,247,0.35)]
                transition
                hover:opacity-90
                disabled:opacity-50
              "
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <WandSparkles className="size-4" />
                  Generate with AI
                </>
              )}
            </button>

          </div>
        </Card>

        {/* CENTER PREVIEW */}
        <div className="space-y-4 lg:col-span-7">

          <Card className="relative overflow-hidden border-white/5 bg-[#050816] p-0">

            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.14),transparent_35%)]" />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_35%)]" />

              <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" />
            </div>

            <div className="relative border-b border-white/5 px-6 py-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">
                    Live letter preview
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    Real-time recruiter-ready formatting with document-style preview.
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="flex items-center gap-1 rounded-[22px] border border-white/10 bg-white/[0.06] p-1.5 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">


                    <button
                      onClick={() =>
                        setZoom((prev) =>
                          Math.max(
                            0.55,
                            prev - 0.05,
                          ),
                        )
                      }
                      className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <ZoomOut className="size-4" />
                    </button>

                    <button
                      onClick={() =>
                        setZoom((prev) =>
                          Math.min(
                            1.2,
                            prev + 0.05,
                          ),
                        )
                      }
                      className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <ZoomIn className="size-4" />
                    </button>

                    <div className="mx-1 h-5 w-px bg-white/10" />

                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          coverLetter.content?.body || ""
                        )
                      }
                      className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <Copy className="size-4" />
                    </button>

                    <button
                      onClick={handleSave}
                      className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <Save className="size-4" />
                    </button>

                    <button
                      onClick={handlePrint}
                      className="grid size-10 place-items-center rounded-xl text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <Download className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden px-5 py-10 lg:px-10 lg:py-14">
              <div className="relative flex justify-center">
                <div
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top center",
                  }}
                  className="transition-all duration-300"
                >
                  <div className="relative">

                    <div className="absolute inset-0 translate-y-8 scale-[0.95] rounded-[50px] bg-black/60 blur-3xl" />

                    <div
                      ref={printRef}
                      className="relative w-full max-w-[850px]"
                    >
                      <CoverLetterRenderer
                        coverLetter={coverLetter}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="max-w-[794px]">
            <div className="space-y-4">
              <CoverLetterInsightsPanel
                  analysis={analysis}
                  isAnalyzing={isAnalyzing}
                  canAnalyze={
                      !!coverLetter.content?.body
                  }
                  onAnalyze={() =>
                      handleAnalyzeCoverLetter(
                          coverLetter.content?.body || "",
                          coverLetter.content?.subject || "",
                      )
                  }
              />
            </div>
          </div>

        </div>

        <CoverLetterRightPanel
          coverLetter={coverLetter}
          setCoverLetter={setCoverLetter}
          typography={typography}
          updateTypography={updateTypography}
        />


      </div>
    </AppShell>
  );
}
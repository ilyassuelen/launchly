import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { AppShell } from "@/components/launchly/AppShell";
import { useAuth } from "@/context/AuthContext";

import { useCareerPath } from "@/features/career-path/hooks/useCareerPath";

import { CareerPathForm } from "@/features/career-path/components/CareerPathForm";
import { CareerPathTimeline } from "@/features/career-path/components/CareerPathTimeline";
import { CareerPathSkillGaps } from "@/features/career-path/components/CareerPathSkillGaps";
import { CareerPathLearningPlan } from "@/features/career-path/components/CareerPathLearningPlan";
import { CareerPathProjects } from "@/features/career-path/components/CareerPathProjects";
import { CareerPathApplicationStrategy } from "@/features/career-path/components/CareerPathApplicationStrategy";

import type { CareerPathGenerateRequest } from "@/features/career-path/types/careerPath";

function getRoleFitLabel(roleFit?: string | null) {
  const normalized = roleFit?.toLowerCase();

  if (normalized === "very_low") {
    return "Very Low";
  }

  if (normalized === "low") {
    return "Low";
  }

  if (normalized === "medium") {
    return "Medium";
  }

  if (normalized === "high") {
    return "High";
  }

  return "Not assessed";
}

function getRoleFitClassName(roleFit?: string | null) {
  const normalized = roleFit?.toLowerCase();

  if (normalized === "high") {
    return "bg-emerald-400/[0.10] text-emerald-100";
  }

  if (normalized === "medium") {
    return "bg-cyan-400/[0.10] text-cyan-100";
  }

  if (normalized === "low") {
    return "bg-amber-400/[0.10] text-amber-100";
  }

  if (normalized === "very_low") {
    return "bg-red-400/[0.10] text-red-100";
  }

  return "bg-white/[0.05] text-white/60";
}

export const Route = createFileRoute("/career-path")({
  head: () => ({
    meta: [
      {
        title: "Career Path — Launchly",
      },
      {
        name: "description",
        content:
          "AI-generated career roadmap based on your saved resume, applications, interviews, LinkedIn and portfolio insights.",
      },
    ],
  }),
  component: CareerPath,
});

function CareerPath() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const {
    selectedCareerPath,
    latestCareerPath,
    isLoading,
    isGenerating,
    error,
    createCareerPath,
    loadCareerPaths,
    clearError,
  } = useCareerPath();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
      if (!loading && user) {
        void loadCareerPaths();
      }
  }, [user, loading, loadCareerPaths]);

  const handleGenerateCareerPath = async (
    payload: CareerPathGenerateRequest,
  ) => {
    clearError();
    await createCareerPath(payload);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading career path...
        </div>
      </div>
    );
  }

  const careerPath = selectedCareerPath || latestCareerPath;
  const confidence = careerPath?.confidence_score ?? 0;
  const roleFitLabel = getRoleFitLabel(careerPath?.role_fit);
  const roleFitClassName = getRoleFitClassName(careerPath?.role_fit);

  return (
    <AppShell
      title="Career Path"
      subtitle="Generate a roadmap from your saved profile signals."
    >
      <div className="space-y-6">
        <CareerPathForm
          isGenerating={isGenerating}
          onSubmit={handleGenerateCareerPath}
        />

        {error && (
          <div className="flex items-start gap-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-red-100">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <div className="text-sm font-semibold">
                Failed to load career path
              </div>

              <div className="mt-1 text-sm text-red-100/75">
                {error}
              </div>
            </div>
          </div>
        )}

        {isLoading && !careerPath ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-white/10 bg-black/20">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading your latest roadmap...
            </div>
          </div>
        ) : careerPath ? (
          <>
            <section className="overflow-hidden rounded-[32px] border border-white/10 bg-black/20">
              <div className="grid gap-0 xl:grid-cols-[1fr_360px]">
                <div className="p-6 lg:p-8">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/60">
                    <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                    AI Career Intelligence
                  </div>

                  <h2 className="max-w-4xl text-3xl font-semibold leading-tight text-white lg:text-4xl">
                    Your career trajectory toward{" "}
                    <span className="bg-gradient-to-r from-violet-200 to-cyan-200 bg-clip-text text-transparent">
                      {careerPath.target_role}
                    </span>
                  </h2>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58 lg:text-[15px]">
                    {careerPath.summary ||
                      "Your profile-based roadmap is ready."}
                  </p>

                  <div className="mt-8 rounded-3xl bg-white/[0.03] p-5">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                          Career Readiness Trajectory
                        </div>
                        <div className="mt-1 text-sm text-white/55">
                          Profile fit → job-ready positioning
                        </div>
                      </div>

                      <div className="hidden items-center gap-2 rounded-full bg-violet-400/[0.08] px-3 py-1.5 text-xs font-medium text-violet-100/75 sm:flex">
                        <BrainCircuit className="h-3.5 w-3.5" />
                        Profile-based
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-0 right-0 top-4 h-px bg-white/10" />
                      <div
                        className="absolute left-0 top-4 h-px bg-gradient-to-r from-violet-400 to-cyan-300"
                        style={{ width: `${confidence}%` }}
                      />

                      <div className="relative grid grid-cols-4 gap-3">
                        {[
                          "Current",
                          "Developing",
                          "Intermediate",
                          "Job Ready",
                        ].map((label, index) => {
                          const nodeProgress = [0, 35, 70, 100][index];
                          const isActive = confidence >= nodeProgress;

                          return (
                            <div
                              key={label}
                              className="flex flex-col items-center text-center"
                            >
                              <div
                                className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full border ${
                                  isActive
                                    ? "border-violet-300/40 bg-violet-400/15 text-violet-100"
                                    : "border-white/10 bg-black/30 text-white/30"
                                }`}
                              >
                                {isActive ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <span className="h-2 w-2 rounded-full bg-white/25" />
                                )}
                              </div>

                              <div
                                className={`text-xs font-medium ${
                                  isActive ? "text-white/75" : "text-white/35"
                                }`}
                              >
                                {label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="border-t border-white/10 bg-white/[0.025] p-6 xl:border-l xl:border-t-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                        Roadmap confidence
                      </div>

                      <div className="mt-3 flex items-end gap-1">
                        <span className="text-5xl font-bold tracking-tight text-white">
                          {confidence}
                        </span>
                        <span className="pb-1 text-2xl text-white/45">%</span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-violet-400/[0.10] p-3 text-violet-200">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300"
                      style={{ width: `${confidence}%` }}
                    />
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                      <span className="text-xs text-white/40">
                        Time horizon
                      </span>
                      <span className="text-sm font-medium text-white/75">
                        {careerPath.timeframe_months ?? 6} months
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                      <span className="text-xs text-white/40">
                        Current level
                      </span>
                      <span className="text-sm font-medium text-white/75">
                        {careerPath.current_level || "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                      <span className="text-xs text-white/40">
                        Target role
                      </span>
                      <span className="max-w-[160px] truncate text-sm font-medium text-white/75">
                        {careerPath.target_role}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                      <span className="text-xs text-white/40">
                        Role fit
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleFitClassName}`}
                      >
                        {roleFitLabel}
                      </span>
                    </div>
                  </div>

                  {careerPath.role_fit_summary && (
                    <div className="mt-4 rounded-2xl bg-white/[0.025] p-4">
                      <div className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-white/30">
                        Fit analysis
                      </div>

                      <p className="text-sm leading-6 text-white/50">
                        {careerPath.role_fit_summary}
                      </p>
                    </div>
                  )}
                </aside>
              </div>
            </section>

            <CareerPathTimeline roadmap={careerPath.roadmap} />

            <CareerPathSkillGaps skillGaps={careerPath.skill_gaps} />

            <CareerPathLearningPlan
                learningPlan={careerPath.learning_plan}
            />

            <CareerPathProjects projectPlan={careerPath.project_plan} />

            <CareerPathApplicationStrategy
              applicationStrategy={careerPath.application_strategy}
            />
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
              <Sparkles className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              No profile-based roadmap yet
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/55">
              Generate your first roadmap from your saved Launchly profile.
              Launchly will use your resume, applications, interview results,
              LinkedIn analysis, portfolio insights and dashboard signals.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
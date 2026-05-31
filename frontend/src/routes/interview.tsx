import { useEffect } from "react";
import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import {
  AlertTriangle,
  Loader2,
} from "lucide-react";

import {
  AppShell,
  Card,
} from "@/components/launchly/AppShell";
import { useAuth } from "@/context/AuthContext";

import { useInterview } from "@/features/interview/hooks/useInterview";
import { InterviewSetupPanel } from "@/features/interview/components/InterviewSetupPanel";
import { InterviewChatPanel } from "@/features/interview/components/InterviewChatPanel";
import { InterviewAnalysisPanel } from "@/features/interview/components/InterviewAnalysisPanel";
import { InterviewStatsPanel } from "@/features/interview/components/InterviewStatsPanel";
import { InterviewResultSummary } from "@/features/interview/components/InterviewResultSummary";
import { PastInterviewSessions } from "@/features/interview/components/PastInterviewSessions";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [
      {
        title: "Interview Simulator — Launchly",
      },
      {
        name: "description",
        content:
          "Practice behavioral and technical interviews with AI follow-ups and scoring.",
      },
    ],
  }),
  component: Interview,
});

function Interview() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const {
    mode,
    role,
    difficulty,
    maxQuestions,

    session,
    messages,
    result,
    answer,

    sessions,
    stats,

    isStarting,
    isSubmitting,
    error,

    setMode,
    setRole,
    setDifficulty,
    setMaxQuestions,
    setAnswer,

    startInterview,
    submitAnswer,
    loadSessions,
    loadStats,
    loadSessionDetail,
    removeInterviewSession,
    clearInterviewHistory,
  } = useInterview();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user) {
      loadSessions();
      loadStats();
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="flex items-center gap-3 text-sm text-white/60">
          <Loader2 className="size-4 animate-spin text-cyan-300" />
          Loading interview simulator...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isSessionActive =
    Boolean(session) &&
    session?.status === "active" &&
    !result;

  return (
    <AppShell
      title="Interview Simulator"
      subtitle="Practice realistic AI interviews with resume-aware questions, adaptive follow-ups, and structured feedback."
    >
      <div className="space-y-4">
        {error && (
          <Card className="border-orange-400/10 bg-orange-400/[0.06]">
            <div className="flex items-start gap-3 text-sm text-orange-200">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div>{error}</div>
            </div>
          </Card>
        )}

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-3">
            <InterviewSetupPanel
              mode={mode}
              role={role}
              difficulty={difficulty}
              maxQuestions={maxQuestions}
              isStarting={isStarting}
              disabled={isSessionActive || isSubmitting}
              onModeChange={setMode}
              onRoleChange={setRole}
              onDifficultyChange={setDifficulty}
              onMaxQuestionsChange={setMaxQuestions}
              onStart={startInterview}
            />

            <PastInterviewSessions
              sessions={sessions}
              stats={stats}
              activeSessionId={session?.id || null}
              onSelectSession={loadSessionDetail}
              onDeleteSession={removeInterviewSession}
              onReset={clearInterviewHistory}
            />
          </div>

          <div className="space-y-4 lg:col-span-6">
            <InterviewChatPanel
              session={session}
              messages={messages}
              result={result}
              answer={answer}
              isStarting={isStarting}
              isSubmitting={isSubmitting}
              onAnswerChange={setAnswer}
              onSubmitAnswer={submitAnswer}
            />

            <InterviewResultSummary
              result={result}
            />
          </div>

          <div className="space-y-4 lg:col-span-3">
            <InterviewAnalysisPanel
              result={result}
              isActive={isSessionActive}
            />

            <InterviewStatsPanel
              stats={stats}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

import {
  Clock3,
  History,
  RotateCcw,
  Trophy,
} from "lucide-react";

import {
  Card,
} from "@/components/launchly/AppShell";

import type {
  InterviewSession,
  InterviewStatsResponse,
} from "@/features/interview/types/interview";

type PastInterviewSessionsProps = {
  sessions: InterviewSession[];
  stats: InterviewStatsResponse | null;
  activeSessionId?: number | null;
  onSelectSession?: (sessionId: number) => void;
  onReset?: () => Promise<unknown>;
};

function formatDate(value?: string | null) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function getStatusClass(status?: string | null) {
  if (status === "completed") {
    return "bg-emerald-400/10 text-emerald-200";
  }

  if (status === "active") {
    return "bg-cyan-400/10 text-cyan-200";
  }

  return "bg-white/[0.04] text-white/55";
}

function getResultScore(
  stats: InterviewStatsResponse | null,
  sessionId: number,
) {
  const result = stats?.recent_results?.find(
    (item) => item.session_id === sessionId,
  );

  return result?.overall_score ?? null;
}

export function PastInterviewSessions({
  sessions,
  stats,
  activeSessionId,
  onSelectSession,
  onReset,
}: PastInterviewSessionsProps) {
  const handleReset = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your entire interview history? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await onReset?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_40%)]" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <History className="size-4 text-violet-300" />
            Past sessions
          </div>

          <div className="flex items-center gap-2">
            {sessions.length > 0 && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-400/10 bg-red-400/[0.05] px-3 py-1.5 text-[11px] font-medium text-red-200 transition hover:bg-red-400/[0.12]"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </button>
            )}

            <div className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/55">
              Last 30
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {sessions.length === 0 && (
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm leading-6 text-white/50">
              No interview sessions yet. Start your first mock interview to build your score history.
            </div>
          )}

          {sessions.slice(0, 6).map((session) => {
            const score = getResultScore(
              stats,
              session.id,
            );

            return (
              <button
                  type="button"
                  key={session.id}
                  onClick={() => onSelectSession?.(session.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition hover:border-violet-300/15 hover:bg-white/[0.05] ${
                    activeSessionId === session.id
                      ? "border-violet-300/25 bg-violet-400/[0.08]"
                      : "border-white/5 bg-white/[0.03]"
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white/90">
                      {session.role}
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      {session.mode} · {session.difficulty} · {session.language.toUpperCase()}
                    </div>
                  </div>

                  <div
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getStatusClass(session.status)}`}
                  >
                    {session.status}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <div className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    {formatDate(session.created_at)}
                  </div>

                  {score !== null ? (
                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 font-semibold text-emerald-200">
                      <Trophy className="size-3.5" />
                      {score}/100
                    </div>
                  ) : (
                    <div className="rounded-full bg-white/[0.04] px-2.5 py-1 text-white/45">
                      No score yet
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

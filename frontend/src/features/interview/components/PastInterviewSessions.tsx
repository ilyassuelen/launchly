import {
  Clock3,
  History,
  RotateCcw,
  Trash2,
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
  onDeleteSession?: (sessionId: number) => Promise<unknown>;
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
  onDeleteSession,
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
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <History className="size-4 shrink-0 text-violet-300" />
              <span>Past sessions</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-1 py-1.5 text-[11px] font-medium text-white/55">
              Last 30
            </div>

            {sessions.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-400/15 bg-red-400/[0.07] px-3 py-1.5 text-[11px] font-medium text-red-100 transition hover:border-red-300/25 hover:bg-red-400/[0.13]"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </button>
            )}
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
              <div
                key={session.id}
                className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition hover:border-violet-300/15 hover:bg-white/[0.05] ${
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
                      {session.mode} · {session.difficulty}
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
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl border border-white/10 bg-black/80 opacity-0 backdrop-blur-lg transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectSession?.(session.id)}
                      className="inline-flex items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/15 px-3 py-2 text-xs font-semibold text-violet-100 shadow-[0_14px_40px_rgba(139,92,246,0.22)] transition hover:bg-violet-400/25"
                    >
                      View results
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const confirmed = window.confirm(
                          "Are you sure you want to delete this interview session?",
                        );

                        if (!confirmed) {
                          return;
                        }

                        try {
                          await onDeleteSession?.(session.id);
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-400/20 bg-red-400/15 px-3 py-2 text-xs font-semibold text-red-100 shadow-[0_14px_40px_rgba(248,113,113,0.16)] transition hover:bg-red-400/25"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

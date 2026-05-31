import {
  useEffect,
  useRef,
} from "react";

import {
  Bot,
  CheckCircle2,
  Loader2,
  Lock,
  Send,
  Sparkles,
  User,
} from "lucide-react";

import {
  Card,
} from "@/components/launchly/AppShell";

import type {
  InterviewMessage,
  InterviewResult,
  InterviewSession,
} from "@/features/interview/types/interview";

type InterviewChatPanelProps = {
  session: InterviewSession | null;
  messages: InterviewMessage[];
  result: InterviewResult | null;
  answer: string;
  isStarting: boolean;
  isSubmitting: boolean;
  onAnswerChange: (answer: string) => void;
  onSubmitAnswer: () => void;
};

function getSessionStatusLabel(
  session: InterviewSession | null,
  result: InterviewResult | null,
) {
  if (!session) {
    return "Ready";
  }

  if (result || session.status === "completed") {
    return "Completed";
  }

  return "Running";
}

function getProgressText(
  session: InterviewSession | null,
) {
  if (!session) {
    return "Start a session to begin";
  }

  return `Question ${session.current_question_index}/${session.max_questions}`;
}

export function InterviewChatPanel({
  session,
  messages,
  result,
  answer,
  isStarting,
  isSubmitting,
  onAnswerChange,
  onSubmitAnswer,
}: InterviewChatPanelProps) {
  const sessionCompleted =
    Boolean(result) ||
    session?.status === "completed";

  const canSubmit =
    Boolean(session) &&
    !sessionCompleted &&
    answer.trim().length > 0 &&
    !isStarting &&
    !isSubmitting;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isSubmitting, sessionCompleted]);

  return (
    <Card className="relative overflow-hidden border-cyan-300/15 bg-[linear-gradient(145deg,rgba(15,23,42,0.96),rgba(8,13,24,0.98)_48%,rgba(24,18,54,0.88))] shadow-[0_28px_90px_rgba(6,182,212,0.10),0_0_0_1px_rgba(255,255,255,0.03)] lg:col-span-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.20),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(139,92,246,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_32%)]" />
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
      <div className="absolute inset-0 opacity-[0.045] bg-[linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-[size:38px_38px]" />

      <div className="relative">
        <div className="mb-5 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100/70 shadow-[0_14px_45px_rgba(34,211,238,0.10)]">
            <Bot className="size-4 text-cyan-300" />
            AI Interview Console
          </div>
        </div>

        <div className="relative rounded-[2.35rem] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(226,232,240,0.10),rgba(15,23,42,0.16)_10%,rgba(2,6,23,0.72))] p-3 shadow-[0_35px_110px_rgba(0,0,0,0.48),0_0_80px_rgba(34,211,238,0.08),inset_0_1px_0_rgba(255,255,255,0.10)]">
          <div className="absolute inset-x-12 -bottom-6 h-8 rounded-full bg-cyan-300/10 blur-2xl" />

          <div className="relative overflow-hidden rounded-[1.95rem] border border-white/10 bg-slate-950/80 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.025),inset_0_24px_80px_rgba(34,211,238,0.04)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_24%)]" />
            <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:42px_42px]" />

            <div className="relative mb-4 flex items-center justify-between rounded-[1.35rem] border border-white/8 bg-black/35 px-4 py-3 shadow-[0_14px_45px_rgba(0,0,0,0.28)]">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-400/70" />
                <span className="size-2.5 rounded-full bg-yellow-300/70" />
                <span className="size-2.5 rounded-full bg-emerald-300/70" />
              </div>

              <div className="absolute left-1/2 top-1/2 h-1.5 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 shadow-[0_0_22px_rgba(255,255,255,0.08)]" />

              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-[0_10px_30px_rgba(0,0,0,0.18)] ${
                  sessionCompleted
                    ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-200"
                    : session
                      ? "border-cyan-400/15 bg-cyan-400/10 text-cyan-100"
                      : "border-white/10 bg-white/[0.04] text-white/55"
                }`}
              >
                <span
                  className={`size-2 rounded-full ${
                    sessionCompleted
                      ? "animate-pulse bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.75)]"
                      : session
                        ? "animate-pulse bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.75)]"
                        : "animate-pulse bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.75)]"
                  }`}
                />
                {getSessionStatusLabel(session, result)}
              </div>
            </div>

            <div className="relative mb-4 flex items-center justify-between gap-3 rounded-2xl border border-cyan-300/10 bg-white/[0.045] px-4 py-3 text-xs text-white/65 shadow-[0_12px_36px_rgba(0,0,0,0.18)]">
              <span className="font-medium text-white/75">{getProgressText(session)}</span>

              {session && (
                <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-white/55">
                  {session.mode} · {session.difficulty}
                </span>
              )}
            </div>

            <div className="relative max-h-[560px] min-h-[460px] space-y-5 overflow-y-auto rounded-[1.5rem] border border-white/[0.04] bg-black/20 p-4 pr-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            {!session && messages.length === 0 && (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="max-w-sm text-center">
                  <div className="mx-auto grid size-16 place-items-center rounded-3xl border border-cyan-300/15 bg-cyan-300/10 shadow-[0_20px_60px_rgba(34,211,238,0.16)]">
                    <Sparkles className="size-7 text-cyan-200" />
                  </div>

                  <div className="mt-5 text-xl font-semibold text-white">
                    Ready for your mock interview?
                  </div>

                  <div className="mt-2 text-sm leading-6 text-muted-foreground">
                    Choose your mode, role and difficulty on the left.
                    Then start the interview to receive resume-aware questions.
                  </div>
                </div>
              </div>
            )}

            {isStarting && (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-cyan-100">
                  <Loader2 className="size-4 animate-spin" />
                  Preparing your interview...
                </div>
              </div>
            )}

            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id || `${message.role}-${message.created_at}-${message.content}`}
                  className={`flex gap-4 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-xs font-semibold text-primary-foreground shadow-[0_14px_42px_rgba(34,211,238,0.38)] ring-1 ring-white/10">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[86%] rounded-[1.6rem] p-5 text-sm leading-7 shadow-[0_16px_48px_rgba(0,0,0,0.30)] backdrop-blur-xl ${
                      isUser
                        ? "rounded-tr-sm bg-gradient-to-br from-cyan-400/18 to-violet-500/22 text-white/90 ring-1 ring-cyan-200/10"
                        : "rounded-tl-sm border border-white/7 bg-white/[0.055] text-white/82 ring-1 ring-white/[0.02]"
                    }`}
                  >
                    {message.content}
                  </div>

                  {isUser && (
                    <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-xs font-semibold text-white/80">
                      <User className="size-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isSubmitting && (
              <div className="flex gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-xs font-semibold text-primary-foreground shadow-[0_14px_42px_rgba(34,211,238,0.38)] ring-1 ring-white/10">
                  AI
                </div>

                <div className="inline-flex items-center gap-2 rounded-[1.6rem] rounded-tl-sm border border-white/5 bg-white/[0.04] p-5 text-sm text-white/65">
                  <Loader2 className="size-4 animate-spin text-cyan-300" />
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

            {sessionCompleted && (
              <div className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] p-4 shadow-[0_16px_44px_rgba(16,185,129,0.08)]">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-300" />

                  <div>
                    <div className="text-sm font-semibold text-white">
                      Interview completed
                    </div>

                    <div className="mt-1 text-xs leading-5 text-white/60">
                      Your answers have been evaluated. Review your score, recruiter insights and coaching tips on the right.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-3 rounded-[1.6rem] border border-white/8 bg-black/55 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_16px_45px_rgba(0,0,0,0.26)] backdrop-blur-xl">
              <div
                className={`grid size-12 place-items-center rounded-2xl ${
                  session && !sessionCompleted
                    ? "bg-gradient-brand text-primary-foreground shadow-[0_15px_50px_rgba(34,211,238,0.35)]"
                    : "border border-white/10 bg-white/[0.03] text-white/40"
                }`}
              >
                {session && !sessionCompleted ? (
                  <Bot className="size-5" />
                ) : (
                  <Lock className="size-5" />
                )}
              </div>

              <textarea
                value={answer}
                disabled={!session || sessionCompleted || isSubmitting || isStarting}
                onChange={(event) => onAnswerChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && canSubmit) {
                    event.preventDefault();
                    onSubmitAnswer();
                  }
                }}
                rows={1}
                className="h-12 max-h-32 min-h-12 flex-1 resize-none bg-transparent px-2 py-3 text-sm leading-6 text-white/80 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={
                  sessionCompleted
                    ? "Interview completed"
                    : session
                      ? "Type your answer..."
                      : "Start an interview first..."
                }
              />

              <button
                type="button"
                disabled={!canSubmit}
                onClick={onSubmitAnswer}
                className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-cyan-300/20 hover:bg-cyan-300/10 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </Card>
  );
}

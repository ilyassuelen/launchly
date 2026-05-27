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
    <Card className="relative overflow-hidden lg:col-span-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_40%)]" />
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:34px_34px]" />

      <div className="relative">
        <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-5">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Bot className="size-4 text-cyan-300" />
              Live interview session
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              Resume-aware AI interview with automatic feedback after the final question.
            </div>
          </div>

          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs shadow-[0_10px_30px_rgba(0,0,0,0.15)] ${
              sessionCompleted
                ? "border-emerald-400/10 bg-emerald-400/10 text-emerald-300"
                : session
                  ? "border-cyan-400/10 bg-cyan-400/10 text-cyan-200"
                  : "border-white/10 bg-white/[0.04] text-white/55"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                sessionCompleted
                  ? "bg-emerald-300"
                  : session
                    ? "animate-pulse bg-cyan-300"
                    : "bg-white/30"
              }`}
            />
            {getSessionStatusLabel(session, result)}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-black/20 p-5 backdrop-blur-xl">
          <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

          <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-xs text-white/60">
            <span>{getProgressText(session)}</span>

            {session && (
              <span>
                {session.mode} · {session.difficulty}
              </span>
            )}
          </div>

          <div className="max-h-[520px] min-h-[420px] space-y-5 overflow-y-auto pr-2">
            {!session && messages.length === 0 && (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="max-w-sm text-center">
                  <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-cyan-300/10 bg-cyan-300/10">
                    <Sparkles className="size-6 text-cyan-200" />
                  </div>

                  <div className="mt-4 text-lg font-semibold text-white">
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
                    <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-xs font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(34,211,238,0.35)]">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-[1.6rem] p-5 text-sm leading-7 shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl ${
                      isUser
                        ? "rounded-tr-sm bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-white/90 ring-1 ring-white/10"
                        : "rounded-tl-sm border border-white/5 bg-white/[0.04] text-white/80"
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
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-xs font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(34,211,238,0.35)]">
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
            <div className="mt-6 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.05] p-4">
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

          <div className="mt-6 flex items-center gap-3 rounded-[1.6rem] border border-white/5 bg-black/30 p-3 backdrop-blur-xl">
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

            <input
              value={answer}
              disabled={!session || sessionCompleted || isSubmitting || isStarting}
              onChange={(event) => onAnswerChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey && canSubmit) {
                  event.preventDefault();
                  onSubmitAnswer();
                }
              }}
              className="flex-1 bg-transparent px-2 text-sm text-white/80 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
              className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
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
    </Card>
  );
}

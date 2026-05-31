import {
  Briefcase,
  Code2,
  MessageSquare,
  Play,
  Sparkles,
} from "lucide-react";

import {
  Card,
} from "@/components/launchly/AppShell";

import type {
  InterviewDifficulty,
  InterviewMode,
} from "@/features/interview/types/interview";

type InterviewSetupPanelProps = {
  mode: InterviewMode;
  role: string;
  difficulty: InterviewDifficulty;
  maxQuestions: number;
  isStarting: boolean;
  disabled?: boolean;
  onModeChange: (mode: InterviewMode) => void;
  onRoleChange: (role: string) => void;
  onDifficultyChange: (difficulty: InterviewDifficulty) => void;
  onMaxQuestionsChange: (maxQuestions: number) => void;
  onStart: () => void;
};

const modes: {
  value: InterviewMode;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "behavioral",
    label: "Behavioral / HR",
    description: "Motivation, teamwork, conflict, ownership",
    icon: MessageSquare,
  },
  {
    value: "technical",
    label: "Technical",
    description: "Skills, projects, architecture, debugging",
    icon: Code2,
  },
  {
    value: "system-design",
    label: "System Design",
    description: "Design thinking, tradeoffs, scalability",
    icon: Sparkles,
  },
];

const difficulties: InterviewDifficulty[] = [
  "Junior",
  "Mid",
  "Senior",
];

export function InterviewSetupPanel({
  mode,
  role,
  difficulty,
  maxQuestions,
  isStarting,
  disabled = false,
  onModeChange,
  onRoleChange,
  onDifficultyChange,
  onMaxQuestionsChange,
  onStart,
}: InterviewSetupPanelProps) {
  const canStart =
    role.trim().length >= 2 &&
    !isStarting &&
    !disabled;

  return (
    <Card className="relative overflow-hidden lg:col-span-3">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_35%)]" />

      <div className="relative">
        <div className="mb-5 border-b border-white/5 pb-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-300/15">
                  <Sparkles className="size-4 text-cyan-300" />
                </div>

                <div className="text-base font-semibold text-white">
                  Interview Setup
                </div>
              </div>

              <div className="mt-2 text-xs text-muted-foreground">
                Configure your AI mock interview session.
              </div>
            </div>


          </div>
        </div>

        <div>
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Interview mode
          </div>

          <div className="space-y-2">
            {modes.map((item) => {
              const Icon = item.icon;
              const active = mode === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  disabled={disabled || isStarting}
                  onClick={() => onModeChange(item.value)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    active
                      ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-100 shadow-[0_14px_50px_rgba(34,211,238,0.08)]"
                      : "border-white/5 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-black/20 ring-1 ring-white/10">
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="font-medium">
                      {item.label}
                    </div>

                    <div className="mt-0.5 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Briefcase className="size-3.5" />
            Target role
          </div>

          <input
            value={role}
            disabled={disabled || isStarting}
            onChange={(event) => onRoleChange(event.target.value)}
            placeholder="e.g. AI Engineer, Frontend Developer..."
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white/80 outline-none placeholder:text-white/35 transition focus:border-cyan-300/30 focus:bg-black/30 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Difficulty
          </div>

          <div className="mt-2 flex gap-2">
            {difficulties.map((item) => {
              const active = difficulty === item;

              return (
                <button
                  key={item}
                  type="button"
                  disabled={disabled || isStarting}
                  onClick={() => onDifficultyChange(item)}
                  className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    active
                      ? "bg-gradient-brand text-primary-foreground shadow-[0_12px_40px_rgba(34,211,238,0.22)]"
                      : "border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <div className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Questions
          </div>

          <div className="mt-2 flex gap-2">
            {[3, 5, 7].map((item) => {
              const active = maxQuestions === item;

              return (
                <button
                  key={item}
                  type="button"
                  disabled={disabled || isStarting}
                  onClick={() => onMaxQuestionsChange(item)}
                  className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    active
                      ? "border border-violet-300/20 bg-violet-400/10 text-violet-100"
                      : "border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/5 bg-gradient-to-br from-cyan-400/[0.08] to-violet-500/[0.08] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-cyan-300" />
            How it works
          </div>

          <div className="mt-4 space-y-3 text-xs leading-5 text-white/65">
            <div className="rounded-xl bg-black/20 p-3">
              Questions are adapted to your selected role, level and saved resume context.
            </div>

            <div className="rounded-xl bg-black/20 p-3">
              After the final question, Launchly automatically scores your interview.
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={!canStart}
          onClick={onStart}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play className="size-4" />
          {isStarting ? "Starting interview..." : "Start interview"}
        </button>
      </div>
    </Card>
  );
}

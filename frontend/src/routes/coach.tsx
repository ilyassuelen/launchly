import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, Card, Progress } from "@/components/launchly/AppShell";
import { useAuth } from "@/context/AuthContext";
import { Brain, Sparkles, Heart, Flame, MessageSquare, Send, Trophy, Zap } from "lucide-react";

export const Route = createFileRoute("/coach")({
  head: () => ({ meta: [{ title: "AI Coach — Launchly" }, { name: "description", content: "Your AI self-marketing coach: pitches, branding and confidence." }] }),
  component: Coach,
});

function Coach() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="text-sm text-white/60">
          Loading coach...
        </div>
      </div>
    );
  }

  useEffect(() => {
      if (!loading && !user) {
          navigate({ to: "/login" });
      }
  }, [user, loading, navigate]);

  if (loading || !user) {
      return null;
  }
  return (
    <AppShell title="AI Coach" subtitle="Confidence, branding and recruiter mindset — your personal trainer for the job hunt.">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold"><Brain className="size-4 text-[oklch(0.85_0.14_250)]"/> Coaching session</div>
            <span className="text-xs text-muted-foreground">Topic: Elevator pitch</span>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground">AI</div>
              <div className="rounded-2xl rounded-tl-sm bg-white/5 p-3 text-sm ring-1 ring-white/10">
                Let's craft a 30-second pitch. Tell me one project you're proudest of and one number it produced.
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <div className="rounded-2xl rounded-tr-sm bg-gradient-brand-soft p-3 text-sm ring-1 ring-white/10 max-w-md">
                Lumen API — public TS+tRPC project, 1.2k weekly users, 99.9% uptime.
              </div>
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold">M</div>
            </div>
            <div className="flex gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground">AI</div>
              <div className="rounded-2xl rounded-tl-sm bg-white/5 p-3 text-sm ring-1 ring-white/10">
                Try this: <em>"I'm Maya, a frontend engineer. I shipped Lumen API — a public TypeScript service that 1.2k people use weekly with 99.9% uptime. I love turning rough ideas into reliable products."</em>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-2xl glass p-2">
            <input className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground" placeholder="Ask your coach…" />
            <button className="grid size-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground glow"><Send className="size-4"/></button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-hero opacity-50 pointer-events-none"/>
            <div className="relative">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-1 text-xs"><Heart className="size-3.5 text-[oklch(0.78_0.18_340)]"/> Confidence Mode</div>
              <p className="mt-2 text-sm">You shipped 3 projects this month and grew your Career Score by <strong className="text-gradient">+12</strong>. You're closer than you think.</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-white/5 p-2"><Flame className="mx-auto size-4 text-[oklch(0.83_0.16_75)]"/><div className="mt-1 font-semibold">12d streak</div></div>
                <div className="rounded-lg bg-white/5 p-2"><Trophy className="mx-auto size-4 text-[oklch(0.85_0.14_250)]"/><div className="mt-1 font-semibold">3 wins</div></div>
                <div className="rounded-lg bg-white/5 p-2"><Zap className="mx-auto size-4 text-[oklch(0.78_0.16_200)]"/><div className="mt-1 font-semibold">+18%</div></div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-3 text-sm font-semibold">Daily drills</div>
            <ul className="space-y-2 text-sm">
              {["Record a 30s elevator pitch","Rewrite one resume bullet","Draft one outreach DM","Review one project README"].map(d => (
                <li key={d} className="flex items-center justify-between rounded-lg bg-white/5 p-2 ring-1 ring-white/10">
                  <span>{d}</span><button className="rounded-md bg-gradient-brand px-2 py-1 text-[11px] font-semibold text-primary-foreground">Start</button>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4 text-[oklch(0.85_0.14_250)]"/> Weekly growth</div>
            <Progress label="Confidence" value={72}/>
            <div className="mt-2"><Progress label="Pitch clarity" value={66} color="pink"/></div>
            <div className="mt-2"><Progress label="Brand consistency" value={81} color="green"/></div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

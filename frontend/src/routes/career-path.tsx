import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, Card, Progress } from "@/components/launchly/AppShell";
import { useAuth } from "@/context/AuthContext";
import { Map, Sparkles, Target, BookOpen, Code2, Rocket } from "lucide-react";

export const Route = createFileRoute("/career-path")({
  head: () => ({ meta: [{ title: "Career Path — Launchly" }, { name: "description", content: "An AI-generated career roadmap with skills, projects and roles tailored to your goal." }] }),
  component: CareerPath,
});

const milestones = [
  { y: "Now", t: "Junior Frontend Engineer", s: "Stripe-style consumer apps", done: true, icon: Rocket },
  { y: "+6mo", t: "Mid Frontend Engineer", s: "Lead small features end-to-end", done: false, icon: Code2 },
  { y: "+18mo", t: "Senior Engineer", s: "Own a product surface, mentor juniors", done: false, icon: Target },
  { y: "+3y", t: "Staff / Lead", s: "Set technical direction across a team", done: false, icon: Sparkles },
];

function CareerPath() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="text-sm text-white/60">
          Loading career path...
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
    <AppShell title="Career Path" subtitle="A living, AI-generated roadmap for the next 3 years."
      action={<button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow"><Map className="size-4"/> Re-generate roadmap</button>}>

      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Path: Frontend → Senior Product Engineer</div>
            <div className="text-xs text-muted-foreground">Tailored to your skills, market and goals</div>
          </div>
          <span className="rounded-full bg-gradient-brand-soft px-3 py-1 text-xs ring-1 ring-white/10">Confidence 91%</span>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-[oklch(0.72_0.20_295)]/60 to-transparent md:block" />
          <div className="grid gap-6 md:grid-cols-4">
            {milestones.map((m, i) => (
              <div key={m.t} className="relative">
                <div className={`mx-auto grid size-14 place-items-center rounded-2xl ring-1 ring-white/10 ${m.done?"bg-gradient-brand glow":"glass"}`}>
                  <m.icon className="size-5"/>
                </div>
                <div className="mt-3 text-center text-xs text-muted-foreground">{m.y}</div>
                <div className="mt-1 text-center text-sm font-semibold">{m.t}</div>
                <div className="mt-1 text-center text-xs text-muted-foreground">{m.s}</div>
                {i<milestones.length-1 && <div className="absolute right-0 top-7 hidden size-2 -translate-y-1/2 translate-x-1/2 rotate-45 border-r border-t border-white/20 md:block" />}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Target className="size-4"/> Skills to grow</div>
          <div className="space-y-3">
            <Progress label="System Design" value={28} color="pink" />
            <Progress label="Backend / Postgres" value={42} color="pink" />
            <Progress label="Performance" value={56} />
            <Progress label="Mentorship" value={20} color="pink" />
          </div>
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><BookOpen className="size-4"/> Suggested learning</div>
          <ul className="space-y-2 text-sm">
            <li>• "Designing Data-Intensive Applications" — chapters 1–3</li>
            <li>• Next.js 15 server actions deep dive</li>
            <li>• Build one Postgres-backed CRUD with auth</li>
            <li>• Watch 3 system-design talks weekly</li>
          </ul>
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Code2 className="size-4"/> Suggested projects</div>
          <ul className="space-y-2 text-sm">
            <li>• Realtime collab editor (CRDTs + WS)</li>
            <li>• Postgres-backed feature flag service</li>
            <li>• Public API with rate limits + docs</li>
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}

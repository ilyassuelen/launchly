import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, Progress } from "@/components/launchly/AppShell";
import { Github, Sparkles, AlertTriangle, Check, Star, GitFork } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio Analyzer — Launchly" }, { name: "description", content: "AI reviews your GitHub for depth, architecture, READMEs and recruiter signal." }] }),
  component: Portfolio,
});

const repos = [
  { n: "lumen-api", d: "TypeScript · tRPC · Postgres — public API", s: 412, f: 28, score: 88, tag: "Strong", color: "green" },
  { n: "design-system", d: "React · Storybook component library", s: 156, f: 9, score: 76, tag: "Good", color: "violet" },
  { n: "todo-react", d: "React · Vite tutorial-shaped project", s: 8, f: 0, score: 32, tag: "Tutorial", color: "warning" },
  { n: "auth-playground", d: "Next.js · Lucia auth experiments", s: 67, f: 4, score: 64, tag: "Decent", color: "violet" },
];

function Portfolio() {
  return (
    <AppShell title="Portfolio Analyzer" subtitle="An honest AI review of every repo — through a senior engineer's eyes."
      action={<button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow"><Github className="size-4"/> Re-scan GitHub</button>}>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="text-xs text-muted-foreground">Portfolio Quality</div>
          <div className="mt-1 text-4xl font-semibold tracking-tight text-gradient">81</div>
          <Progress value={81} />
        </Card>
        <Card>
          <div className="mb-3 text-sm font-semibold">Recruiter impression</div>
          <div className="space-y-3">
            <Progress label="Technical depth" value={84} color="green" />
            <Progress label="Architecture" value={76} />
            <Progress label="README quality" value={62} color="pink" />
            <Progress label="Business impact" value={58} color="pink" />
          </div>
        </Card>
        <Card>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4 text-[oklch(0.85_0.14_250)]"/> Top wins</div>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><Check className="mt-0.5 size-4 text-[oklch(0.78_0.17_155)]"/> Real users on lumen-api — recruiter gold.</li>
            <li className="flex gap-2"><Check className="mt-0.5 size-4 text-[oklch(0.78_0.17_155)]"/> Consistent commit cadence (4 weeks).</li>
            <li className="flex gap-2"><AlertTriangle className="mt-0.5 size-4 text-[oklch(0.83_0.16_75)]"/> 1 tutorial-shaped repo flagged.</li>
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-3">
        {repos.map(r => (
          <Card key={r.n} className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Github className="size-4 text-muted-foreground"/>
                <span className="font-semibold">{r.n}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] ring-1 ring-white/10 ${r.color==="green"?"bg-[oklch(0.78_0.17_155)]/15 text-[oklch(0.78_0.17_155)]":r.color==="warning"?"bg-[oklch(0.83_0.16_75)]/15 text-[oklch(0.83_0.16_75)]":"bg-gradient-brand-soft"}`}>{r.tag}</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{r.d}</div>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Star className="size-3.5"/> {r.s}</span>
                <span className="inline-flex items-center gap-1"><GitFork className="size-3.5"/> {r.f}</span>
              </div>
            </div>
            <div className="md:w-72">
              <Progress value={r.score} color={r.color === "warning" ? "pink" : r.color === "green" ? "green" : "brand" as any} label="Score" />
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-3 py-2 text-xs font-semibold text-primary-foreground glow">View AI review</button>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import logo from "../../static/logo.png";
import { AppShell, Card, StatCard, Progress } from "@/components/launchly/AppShell";
import {
  Sparkles,
  TrendingUp,
  FileText,
  Eye,
  Mic,
  Linkedin,
  Github,
  Target,
  ArrowRight,
  Flame,
  Zap,
  Activity,
  ShieldCheck,
  Brain,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Launchly" }, { name: "description", content: "Your AI career command center: scores, growth and recommendations." }] }),
  component: Dashboard,
});

const growth = [
  { d: "Mon", v: 42 }, { d: "Tue", v: 48 }, { d: "Wed", v: 56 }, { d: "Thu", v: 61 },
  { d: "Fri", v: 68 }, { d: "Sat", v: 74 }, { d: "Sun", v: 82 },
];

function Dashboard() {
  return (
    <AppShell
        logo={
          <img
            src={logo}
            alt="Launchly logo"
            className="h-8 w-auto object-contain"
          />
        }
        title="Welcome back, Maya 👋"
        subtitle="Here's how your career is moving this week."
      action={<button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow"><Zap className="size-4"/> Run AI review</button>}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Career Score"
          value="86"
          delta="+12 this week"
          icon={TrendingUp}
          tone="violet"
        />

        <StatCard
          label="Recruiter Impression"
          value="A−"
          delta="Top 22%"
          icon={Eye}
          tone="cyan"
        />

        <StatCard
          label="Resume Health"
          value="92%"
          delta="Excellent"
          icon={ShieldCheck}
          tone="green"
        />

        <StatCard
          label="Interview Readiness"
          value="74%"
          delta="3 mocks done"
          icon={Mic}
          tone="pink"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="group relative overflow-hidden lg:col-span-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_30%)] opacity-80 transition duration-500 group-hover:opacity-100" />
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Career growth</div>
              <div className="text-xs text-muted-foreground">Last 7 days · all signals combined</div>
            </div>
            <span className="rounded-full bg-[oklch(0.78_0.17_155)]/15 px-2 py-0.5 text-xs text-[oklch(0.78_0.17_155)]">+18%</span>
          </div>
          <div className="relative h-72 overflow-hidden rounded-2xl border border-white/5 bg-black/10 p-2">
            <ResponsiveContainer>
              <AreaChart data={growth} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="ag" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.20 295)" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="oklch(0.72 0.20 295)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="d" tick={{ fill: "oklch(0.7 0.03 270)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.7 0.03 270)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.2 0.025 270)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Area
                  dataKey="v"
                  stroke="oklch(0.85 0.14 250)"
                  strokeWidth={3}
                  fill="url(#ag)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold">Market Fit Score</div>

              <div className="mt-1 text-xs text-muted-foreground">
                Based on your current positioning
              </div>
            </div>

            <div className="rounded-full border border-violet-400/10 bg-violet-400/10 px-2 py-1 text-xs text-violet-200">
              Strong Match
            </div>
          </div>

          <div className="mt-6 flex items-center gap-6">
            <div className="relative flex h-[150px] w-[150px] shrink-0 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="10"
                />

                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke="url(#marketGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="276"
                  strokeDashoffset="60"
                />

                <defs>
                  <linearGradient id="marketGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.18 300)" />
                    <stop offset="100%" stopColor="oklch(0.82 0.16 220)" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="relative text-center">
                <div className="text-4xl font-semibold tracking-tight text-white">
                  78
                </div>

                <div className="mt-1 text-xs text-violet-200">
                  Strong fit
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Best role match</span>
                  <span className="text-cyan-300">Frontend Engineer</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Recruiter confidence</span>
                  <span className="text-white/80">82%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                  <div className="text-[11px] text-muted-foreground">
                    Positioning
                  </div>

                  <div className="mt-1 text-lg font-semibold text-white/85">
                    76%
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                  <div className="text-[11px] text-muted-foreground">
                    Portfolio Match
                  </div>

                  <div className="mt-1 text-lg font-semibold text-white/85">
                    81%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
              <div className="text-[11px] text-muted-foreground">
                Skills
              </div>

              <div className="mt-1 text-sm font-semibold text-white/85">
                84%
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
              <div className="text-[11px] text-muted-foreground">
                Demand
              </div>

              <div className="mt-1 text-sm font-semibold text-emerald-300">
                High
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
              <div className="text-[11px] text-muted-foreground">
                Visibility
              </div>

              <div className="mt-1 text-sm font-semibold text-white/85">
                Medium
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="mb-4 text-sm font-semibold">Profile strength</div>
          <div className="space-y-3">
            <Progress label="Resume" value={92} color="green" />
            <Progress label="LinkedIn" value={78} />
            <Progress label="Portfolio" value={81} color="pink" />
            <Progress label="Interviewing" value={74} />
            <Progress label="Networking" value={56} />
          </div>
        </Card>

        <Card className="group relative overflow-hidden lg:col-span-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_30%)] opacity-80" />
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold">Today's AI insights</div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted-foreground"><Sparkles className="size-3" /> generated 2m ago</span>
          </div>
          <ul className="divide-y divide-white/5">
            {[
              { i: Target, c: "violet", t: "Quantify your Stripe internship bullet — recruiters spend 1.4s here.", a: "Rewrite" },
              { i: Linkedin, c: "cyan", t: "Add 'TypeScript', 'Next.js' and 'Postgres' to your About to match 12 open roles.", a: "Optimize" },
              { i: Github, c: "pink", t: "Replace your tutorial todo-app with the API project — recruiter signal +18%.", a: "Review" },
              { i: Mic, c: "green", t: "Behavioral round 'Tell me about a failure' is your weakest — 3 minute drill?", a: "Practice" },
            ].map((r, i) => (
              <li className="group/item flex items-center justify-between rounded-2xl px-2 py-3 transition hover:bg-white/[0.03]" key={i}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid size-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 transition group-hover/item:scale-105 group-hover/item:bg-white/10">
                    <r.i className="size-4 text-[oklch(0.85_0.14_250)]" />
                  </div>
                  <div className="text-sm">{r.t}</div>
                </div>
                <button className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs transition hover:border-white/20 hover:bg-white/[0.06]">
                  {r.a} <ArrowRight className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Missing skills</div>
            <span className="text-xs text-muted-foreground">vs 32 jobs</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {[["Next.js 15","high"],["tRPC","high"],["Postgres","med"],["AWS S3","med"],["GraphQL","low"],["Playwright","low"]].map(([s,p]) => (
              <span key={s as string} className={`rounded-full px-2.5 py-1 ring-1 ring-white/10 ${p==="high"?"bg-[oklch(0.72_0.20_295)]/20 text-[oklch(0.85_0.14_250)]":p==="med"?"bg-white/5":"bg-white/[0.03] text-muted-foreground"}`}>{s as string}</span>
            ))}
          </div>
          <div className="mt-5 text-sm font-semibold">Suggested learning</div>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li>• Build a Postgres + tRPC mini-app (4h)</li>
            <li>• Ship one Next.js 15 server-action demo</li>
            <li>• Add Playwright to existing portfolio repo</li>
          </ul>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="mb-3 text-sm font-semibold">Activity heatmap</div>
          <Heatmap />
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Flame className="size-3.5 text-[oklch(0.83_0.16_75)]" /> 12-day streak</span>
            <span>Last 13 weeks</span>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="mb-3 text-sm font-semibold">Application pipeline</div>
          <ul className="space-y-3 text-sm">
            {[
              { c: "Stripe", r: "Frontend Intern", s: "Onsite", t: "tomorrow" },
              { c: "Linear", r: "Junior Engineer", s: "Phone screen", t: "Fri" },
              { c: "Vercel", r: "DX Engineer", s: "Applied", t: "Mon" },
              { c: "Shopify", r: "SDE I", s: "Take-home", t: "Wed" },
            ].map(a => (
              <li
                key={a.c}
                className="group flex items-center justify-between rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/10 transition hover:bg-white/[0.06] hover:ring-white/20"
              >
                <div>
                  <div className="text-sm font-medium">{a.c}</div>
                  <div className="text-xs text-muted-foreground">{a.r}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs">{a.s}</div>
                  <div className="text-[11px] text-muted-foreground">{a.t}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}

function Heatmap() {
  const cells = Array.from({ length: 13 * 7 });
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1">
      {cells.map((_, i) => {
        const v = ((i * 37) % 5);
        const colors = [
          "bg-white/5",
          "bg-[oklch(0.72_0.20_295)]/20",
          "bg-[oklch(0.72_0.20_295)]/40",
          "bg-[oklch(0.72_0.20_295)]/70 shadow-[0_0_12px_rgba(168,85,247,0.25)]",
          "bg-[oklch(0.72_0.20_295)] shadow-[0_0_16px_rgba(168,85,247,0.4)]",
        ];
        return (
          <div
            key={i}
            className={`size-3 rounded-[4px] transition hover:scale-125 ${colors[v]}`}
          />
        );
      })}
    </div>
  );
}

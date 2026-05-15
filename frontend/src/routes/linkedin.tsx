import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, Card, Progress } from "@/components/launchly/AppShell";
import { useAuth } from "@/context/AuthContext";
import {
  Linkedin,
  Sparkles,
  Wand2,
  Plus,
  TrendingUp,
  Search,
  Eye,
  Check,
  AlertTriangle,
  ScanSearch,
  UserRound,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

export const Route = createFileRoute("/linkedin")({
  head: () => ({ meta: [{ title: "LinkedIn Analyzer — Launchly" }, { name: "description", content: "Optimize your LinkedIn headline, About and keywords for recruiters in your niche." }] }),
  component: LinkedInPage,
});

function LinkedInPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="text-sm text-white/60">
          Loading LinkedIn analyzer...
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
    <AppShell title="LinkedIn Analyzer" subtitle="Headline, About and keyword strategy tuned for the recruiters in your niche."
      action={<button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow"><Wand2 className="size-4"/> Optimize all</button>}>

      <div className="space-y-4">
  {/* Top Analytics */}
  <div className="grid gap-4 lg:grid-cols-4">
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_40%)]" />

      <div className="relative">
        <div className="text-xs text-muted-foreground">
          Profile strength
        </div>

        <div className="mt-2 flex items-end gap-2">
          <div className="text-5xl font-semibold tracking-tight text-gradient">
            78
          </div>

          <div className="mb-2 text-sm text-muted-foreground">
            /100
          </div>
        </div>

        <div className="mt-3">
          <Progress value={78} />
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          Stronger than 64% of juniors in your role.
        </div>
      </div>
    </Card>

    <Card>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <TrendingUp className="size-4 text-cyan-300" />
        Recruiter signals
      </div>

      <div className="space-y-3">
        <Progress label="Headline" value={62} color="pink" />
        <Progress label="About" value={70} />
        <Progress label="Skills" value={88} color="green" />
        <Progress label="Activity" value={45} color="pink" />
      </div>
    </Card>

    <Card className="relative overflow-hidden lg:col-span-2">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.10),transparent_40%)]" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Search className="size-4 text-violet-300" />
          Missing recruiter keywords
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {[
            ["TypeScript", "High recruiter relevance"],
            ["Next.js", "74% listing frequency"],
            ["Postgres", "Backend search boost"],
            ["tRPC", "Modern stack signal"],
            ["Server Components", "Emerging trend"],
            ["Playwright", "Testing keyword"],
          ].map(([k, d]) => (
            <div
              key={k}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3"
            >
              <div className="flex items-center gap-1 text-[oklch(0.85_0.14_250)]">
                <Plus className="size-3" />
                {k}
              </div>

              <div className="mt-1 text-[10px] text-muted-foreground">
                {d}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  </div>

  {/* AI Rewrite Workspace */}
  <div className="grid gap-4 lg:grid-cols-12">
    <Card className="relative overflow-hidden lg:col-span-7">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />

      <div className="relative">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Linkedin className="size-4 text-[oklch(0.78_0.16_200)]" />
              Headline AI Optimizer
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              Simulated recruiter visibility analysis.
            </div>
          </div>

          <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/10 px-2 py-1 text-[11px] text-cyan-200">
            Live AI analysis
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Before
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm text-white/75">
              CS student at NYU · React enthusiast
            </div>

            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-3.5 text-orange-300" />
                Missing searchable technologies
              </div>

              <div className="flex items-center gap-2">
                <AlertTriangle className="size-3.5 text-orange-300" />
                Low recruiter keyword density
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/10 to-cyan-400/5 p-5">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] animate-pulse" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-200">
                <Sparkles className="size-3.5" />
                AI rewrite
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/90 shadow-[0_20px_60px_rgba(168,85,247,0.15)]">
                Frontend Engineer · React · TypeScript · Next.js · Shipping consumer-grade apps used by 18k+ users · Open to junior roles
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[10px]">
                <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-200">
                  +32% recruiter visibility
                </span>

                <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-cyan-200">
                  High keyword relevance
                </span>

                <span className="rounded-full bg-violet-400/10 px-2 py-1 text-violet-200">
                  Better search ranking
                </span>
              </div>
            </div>
          </div>
        </div>

        <button className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-brand px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_rgba(168,85,247,0.35)] transition hover:scale-[1.01]">
          <Wand2 className="size-4" />
          Optimize headline
        </button>
      </div>
    </Card>

    <Card className="relative overflow-hidden lg:col-span-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_45%)]" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Eye className="size-4 text-cyan-300" />
          Recruiter search visibility
        </div>

        <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <ScanSearch className="size-3.5" />
            Simulated recruiter search
          </div>

          <div className="mt-4 space-y-3">
            {[
              ["Frontend Engineer Search", "Top 18%"],
              ["React Developer Search", "Top 24%"],
              ["Junior AI Engineer Search", "Top 31%"],
            ].map(([t, s]) => (
              <div
                key={t}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4"
              >
                <div>
                  <div className="text-sm font-medium text-white/85">
                    {t}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    Recruiter indexing simulation
                  </div>
                </div>

                <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                  {s}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Check className="size-4 text-emerald-300" />
            AI conclusion
          </div>

          <div className="mt-2 text-sm leading-7 text-white/70">
            Your profile is highly discoverable for frontend-focused recruiter searches, but lacks backend and testing visibility.
          </div>
        </div>
      </div>
    </Card>
  </div>

  {/* About + Networking */}
  <div className="grid gap-4 lg:grid-cols-12">
    <Card className="relative overflow-hidden lg:col-span-7">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <MessageSquare className="size-4 text-violet-300" />
          About AI Workspace
        </div>

        <textarea
          className="h-60 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-8 text-white/80 outline-none transition focus:border-violet-400/30"
          defaultValue="I'm a senior at NYU studying CS. I love building things on the web and have interned at Stripe…"
        />

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            ["Readability", "Strong"],
            ["Recruiter warmth", "High"],
            ["Keyword density", "Medium"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
            >
              <div className="text-xs text-muted-foreground">
                {k}
              </div>

              <div className="mt-2 text-lg font-semibold text-white/85">
                {v}
              </div>
            </div>
          ))}
        </div>

        <button className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-brand px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_rgba(168,85,247,0.35)] transition hover:scale-[1.01]">
          <Wand2 className="size-4" />
          Improve with AI
        </button>
      </div>
    </Card>

    <Card className="relative overflow-hidden lg:col-span-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.08),transparent_40%)]" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <UserRound className="size-4 text-cyan-300" />
          Networking intelligence
        </div>

        <div className="space-y-3">
          {[
            {
              n: "Sara Liu",
              r: "Senior Eng @ Stripe",
              c: "Worked on payment dashboards",
              s: "87% likely to respond",
            },
            {
              n: "Daniel Park",
              r: "Recruiter @ Vercel",
              c: "Hires juniors quarterly",
              s: "Strong hiring overlap",
            },
            {
              n: "Anya Petrova",
              r: "EM @ Linear",
              c: "Posts about junior hiring",
              s: "Frontend ecosystem overlap",
            },
          ].map((p) => (
            <div
              key={p.n}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-gradient-brand text-xs font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(168,85,247,0.35)]">
                    {p.n.split(" ").map((x) => x[0]).join("")}
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white/85">
                      {p.n}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {p.r}
                    </div>
                  </div>
                </div>

                <ArrowRight className="size-4 text-muted-foreground" />
              </div>

              <div className="mt-4 text-xs text-white/60">
                {p.c}
              </div>

              <div className="mt-3 inline-flex rounded-full bg-cyan-400/10 px-2 py-1 text-[10px] text-cyan-200">
                {p.s}
              </div>

              <button className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-brand px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(168,85,247,0.35)]">
                Draft AI message
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  </div>
</div>
    </AppShell>
  );
}

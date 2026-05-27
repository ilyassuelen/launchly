import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  AppShell,
  Card,
  Progress,
} from "@/components/launchly/AppShell";

import { useAuth } from "@/context/AuthContext";

import {
  Github,
  Sparkles,
  AlertTriangle,
  Check,
  Star,
  GitFork,
  Loader2,
  Search,
  ExternalLink,
  ShieldCheck,
  Code2,
  Flame,
  Eye,
} from "lucide-react";

import {
  usePortfolioAnalyzer,
} from "@/features/portfolio/hooks/usePortfolioAnalyzer";

import {
  PortfolioScanLoader,
} from "@/features/portfolio/components/PortfolioScanLoader";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      {
        title: "Portfolio Analyzer — Launchly",
      },
      {
        name: "description",
        content:
          "AI reviews your GitHub for depth, architecture, READMEs and recruiter signal.",
      },
    ],
  }),
  component: Portfolio,
});

function getTagClassName(tag: string) {
  const normalized = tag.toLowerCase();

  if (normalized.includes("strong")) {
    return "border-emerald-400/15 bg-emerald-400/10 text-emerald-200";
  }

  if (normalized.includes("needs")) {
    return "border-orange-400/15 bg-orange-400/10 text-orange-200";
  }

  if (normalized.includes("decent")) {
    return "border-cyan-400/15 bg-cyan-400/10 text-cyan-200";
  }

  return "border-violet-400/15 bg-violet-400/10 text-violet-200";
}

function getProgressColor(score: number) {
  if (score >= 80) {
    return "green";
  }

  if (score < 60) {
    return "pink";
  }

  return undefined;
}

function getAttentionMeta(level?: string) {
  if (level === "high") {
    return {
      label: "High recruiter interest",
      icon: Flame,
      className: "border-orange-400/15 bg-orange-400/10 text-orange-200",
    };
  }

  if (level === "medium") {
    return {
      label: "Medium attention",
      icon: Eye,
      className: "border-cyan-400/15 bg-cyan-400/10 text-cyan-200",
    };
  }

  return {
    label: "Low signal",
    icon: AlertTriangle,
    className: "border-white/10 bg-white/[0.04] text-white/55",
  };
}

function Portfolio() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const {
    analysis,
    isAnalyzing,
    isLoadingProfile,
    error,
    analyze,
    loadProfile,
    resetAnalysis,
  } = usePortfolioAnalyzer();

  const hasLoadedProfileRef = useRef(false);

  const [githubUsername, setGithubUsername] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
      if (loading || !user || hasLoadedProfileRef.current) {
        return;
      }

      hasLoadedProfileRef.current = true;

      loadProfile().then((savedProfile) => {
        if (!savedProfile) {
          return;
        }

        setGithubUsername(savedProfile.github_username || "");
      });
  }, [user, loading]);

  const canAnalyze = githubUsername.trim().length > 0;

  const handleAnalyzePortfolio = async () => {
    if (!canAnalyze || isAnalyzing) {
      return;
    }

    await analyze({
      github_username: githubUsername.trim(),
      language: "english",
    });
  };

  const handleUsernameChange = (value: string) => {
    setGithubUsername(value);
    resetAnalysis();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="text-sm text-white/60">
          Loading portfolio analyzer...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const portfolioScore = analysis?.portfolio_score || 0;
  const signals = analysis?.signals;
  const repos = analysis?.repos || [];

  return (
    <AppShell
      title="Portfolio Analyzer"
      subtitle="An honest review of your public GitHub repos — through a senior engineer's eyes."
      action={
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAnalyzePortfolio}
            disabled={!canAnalyze || isAnalyzing || isLoadingProfile}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Github className="size-4" />
            )}

            {isAnalyzing
              ? "Scanning GitHub..."
              : analysis
                ? "Re-scan GitHub"
                : "Scan GitHub"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <Card className="relative overflow-hidden border-white/5 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_34%)]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Github className="size-4 text-cyan-300" />
                GitHub portfolio scan
              </div>

              <div className="mt-2 text-sm leading-7 text-white/55">
                Enter a public GitHub username. Launchly fetches public repositories,
                README files and repo metadata, then evaluates recruiter signal,
                project maturity and improvement opportunities.
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 lg:max-w-md">
              <div className="relative">
                <Github className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/35" />

                <input
                  value={githubUsername}
                  onChange={(event) =>
                    handleUsernameChange(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAnalyzePortfolio();
                    }
                  }}
                  placeholder="GitHub username, e.g. suelen-ilyas"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white/80 outline-none transition placeholder:text-white/30 focus:border-cyan-300/30"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-orange-400/10 bg-orange-400/[0.06] p-3 text-xs text-orange-200">
                  {error}
                </div>
              )}
            </div>
          </div>
        </Card>

        {isAnalyzing && (
          <PortfolioScanLoader />
        )}

        {analysis?.github_profile && (
          <Card className="relative overflow-hidden border-white/5 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.10),transparent_34%)]">
            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={analysis.github_profile.avatar_url}
                  alt={analysis.github_profile.username}
                  className="size-16 rounded-2xl border border-white/10 object-cover"
                />

                <div>
                  <div className="text-lg font-semibold text-white">
                    {analysis.github_profile.name || analysis.github_profile.username}
                  </div>

                  <a
                    href={analysis.github_profile.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm text-cyan-200/80 transition hover:text-cyan-100"
                  >
                    @{analysis.github_profile.username}
                    <ExternalLink className="size-3.5" />
                  </a>

                  {analysis.github_profile.bio && (
                    <div className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                      {analysis.github_profile.bio}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <div className="text-xs text-muted-foreground">
                    Followers
                  </div>

                  <div className="mt-1 text-lg font-semibold text-white">
                    {analysis.github_profile.followers}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <div className="text-xs text-muted-foreground">
                    Following
                  </div>

                  <div className="mt-1 text-lg font-semibold text-white">
                    {analysis.github_profile.following}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_40%)]" />

            <div className="relative">
              <div className="text-xs text-muted-foreground">
                Portfolio Quality
              </div>

              <div className="mt-2 flex items-end gap-2">
                <div className="text-5xl font-semibold tracking-tight text-gradient">
                  {portfolioScore}
                </div>

                <div className="mb-2 text-sm text-muted-foreground">
                  /100
                </div>
              </div>

              <div className="mt-3">
                <Progress value={portfolioScore} />
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                {analysis
                  ? `Based on ${repos.length} public repositories.`
                  : isLoadingProfile
                        ? "Loading your saved portfolio analysis..."
                        : "Run a GitHub scan to calculate portfolio quality."}
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="size-4 text-cyan-300" />
              Recruiter impression
            </div>

            <div className="space-y-3">
              <Progress
                label="Technical depth"
                value={signals?.technical_depth || 0}
                color={getProgressColor(signals?.technical_depth || 0)}
              />

              <Progress
                label="Architecture"
                value={signals?.architecture || 0}
                color={getProgressColor(signals?.architecture || 0)}
              />

              <Progress
                label="README quality"
                value={signals?.readme_quality || 0}
                color={getProgressColor(signals?.readme_quality || 0)}
              />

              <Progress
                label="Business impact"
                value={signals?.business_impact || 0}
                color={getProgressColor(signals?.business_impact || 0)}
              />
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="size-4 text-[oklch(0.85_0.14_250)]" />
              Top wins
            </div>

            <ul className="space-y-2 text-sm">
              {analysis?.top_wins?.length ? (
                analysis.top_wins.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-white/75"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-[oklch(0.78_0.17_155)]" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-white/45">
                  Strongest portfolio signals will appear here after the scan.
                </li>
              )}
            </ul>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <Card className="relative overflow-hidden lg:col-span-7">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent)]" />

            <div className="relative">
              <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Code2 className="size-4 text-cyan-300" />
                    Repository reviews
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    Public repos sorted by GitHub recency and reviewed for recruiter signal.
                  </div>
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/50">
                  {repos.length} repos
                </div>
              </div>

              <div className="space-y-3">
                {repos.length === 0 ? (
                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-sm text-white/45">
                    Enter your GitHub username and start a scan to list your public repositories.
                  </div>
                ) : (
                  repos.map((repo) => (
                    <div
                      key={repo.name}
                      className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Github className="size-4 text-muted-foreground" />

                            <span className="font-semibold text-white">
                              {repo.name}
                            </span>

                            <span className={`rounded-full border px-2 py-0.5 text-[10px] ${getTagClassName(repo.tag)}`}>
                              {repo.tag}
                            </span>
                          </div>

                          <div className="mt-1 text-sm text-muted-foreground">
                            {repo.description || "No repository description provided."}
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {repo.language && (
                              <span className="inline-flex items-center gap-1">
                                <Code2 className="size-3.5" />
                                {repo.language}
                              </span>
                            )}

                            <span className="inline-flex items-center gap-1">
                              <Star className="size-3.5" />
                              {repo.stars}
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <GitFork className="size-3.5" />
                              {repo.forks}
                            </span>

                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-cyan-200/80 transition hover:text-cyan-100"
                            >
                              View repo
                              <ExternalLink className="size-3.5" />
                            </a>
                          </div>
                        </div>

                        <div className="md:w-64">
                          <Progress
                            value={repo.score}
                            color={getProgressColor(repo.score)}
                            label="Score"
                          />
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/5 bg-black/20 p-4">
                        <div className="text-sm leading-7 text-white/70">
                          {repo.summary || "No summary returned for this repository."}
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-200/80">
                              Strengths
                            </div>

                            <ul className="space-y-1.5 text-xs text-white/55">
                              {repo.strengths.length ? (
                                repo.strengths.map((item) => (
                                  <li
                                    key={item}
                                    className="flex gap-2"
                                  >
                                    <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-300" />
                                    <span>{item}</span>
                                  </li>
                                ))
                              ) : (
                                <li>No strengths listed.</li>
                              )}
                            </ul>
                          </div>

                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-200/80">
                              Risks
                            </div>

                            <ul className="space-y-1.5 text-xs text-white/55">
                              {repo.risks.length ? (
                                repo.risks.map((item) => (
                                  <li
                                    key={item}
                                    className="flex gap-2"
                                  >
                                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-orange-300" />
                                    <span>{item}</span>
                                  </li>
                                ))
                              ) : (
                                <li>No major risks listed.</li>
                              )}
                            </ul>
                          </div>

                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-200/80">
                              Improvements
                            </div>

                            <ul className="space-y-1.5 text-xs text-white/55">
                              {repo.improvements.length ? (
                                repo.improvements.map((item) => (
                                  <li
                                    key={item}
                                    className="flex gap-2"
                                  >
                                    <Search className="mt-0.5 size-3.5 shrink-0 text-cyan-300" />
                                    <span>{item}</span>
                                  </li>
                                ))
                              ) : (
                                <li>No improvements listed.</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>

          <div className="space-y-4 lg:col-span-5">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_42%)]" />

              <div className="relative">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Flame className="size-4 text-orange-300" />
                  Recruiter attention heatmap
                </div>

                <div className="space-y-2">
                  {repos.length ? (
                    repos.map((repo) => {
                      const meta = getAttentionMeta(repo.recruiter_attention);
                      const Icon = meta.icon;

                      return (
                        <div
                          key={repo.name}
                          className="rounded-2xl border border-white/5 bg-white/[0.03] p-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-white/85">
                                {repo.name}
                              </div>

                              <div className="mt-1 text-xs leading-5 text-white/45">
                                {repo.attention_reason || "Recruiter attention estimated from repo quality."}
                              </div>
                            </div>

                            <div className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${meta.className}`}>
                              <Icon className="size-3.5" />
                              {meta.label}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-white/45">
                      Recruiter attention levels will appear after the scan.
                    </div>
                  )}
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.08),transparent_40%)]" />

              <div className="relative">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="size-4 text-orange-300" />
                  Red flags
                </div>

                <div className="space-y-2 text-sm text-white/65">
                  {analysis?.red_flags?.length ? (
                    analysis.red_flags.map((item) => (
                      <div
                        key={item}
                        className="flex gap-2"
                      >
                        <span className="mt-2 size-1.5 rounded-full bg-orange-300" />
                        <span>{item}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/45">
                      Risks and weak portfolio signals will appear here after the scan.
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_45%)]" />

              <div className="relative">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="size-4 text-violet-300" />
                  Recruiter conclusion
                </div>

                <div className="text-sm leading-7 text-white/70">
                  {analysis?.ai_conclusion ||
                    "Run a scan to receive a concise senior-engineer portfolio conclusion."}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

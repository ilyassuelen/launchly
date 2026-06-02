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
import { useI18n } from "@/i18n/I18nContext";

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

function getAttentionMeta(
  level: string | undefined,
  t: (key: string) => string,
) {
  if (level === "high") {
    return {
      label: t("portfolio.highRecruiterInterest"),
      icon: Flame,
      className: "border-orange-400/15 bg-orange-400/10 text-orange-200",
    };
  }

  if (level === "medium") {
    return {
      label: t("portfolio.mediumAttention"),
      icon: Eye,
      className: "border-cyan-400/15 bg-cyan-400/10 text-cyan-200",
    };
  }

  return {
    label: t("portfolio.lowSignal"),
    icon: AlertTriangle,
    className: "border-white/10 bg-white/[0.04] text-white/55",
  };
}

function Portfolio() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

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
          {t("portfolio.loading")}
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
      title={t("portfolio.title")}
      subtitle={t("portfolio.subtitle")}
    >
      <div className="space-y-4">
        <Card className="relative overflow-hidden border-cyan-300/15 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(8,13,24,0.98)_48%,rgba(18,32,58,0.88))] shadow-[0_28px_90px_rgba(6,182,212,0.10),0_0_0_1px_rgba(255,255,255,0.03)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.20),transparent_34%),radial-gradient(circle_at_86%_10%,rgba(139,92,246,0.16),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.045),transparent_34%)]" />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

          <div className="relative grid gap-6 xl:grid-cols-[270px_minmax(0,1fr)_minmax(320px,0.72fr)]">
            <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-black/25 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_80px_rgba(0,0,0,0.26)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_58%)]" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/75">
                  <Github className="size-3.5 text-cyan-300" />
                  {t("portfolio.portfolioQuality")}
                </div>

                <div className="relative isolate mx-auto mt-6 grid size-40 place-items-center overflow-hidden rounded-full border border-cyan-300/20 bg-white/[0.045] shadow-[0_28px_85px_rgba(34,211,238,0.16)]">
                  <div className="pointer-events-none absolute inset-4 rounded-full border border-violet-300/10" />
                  <div className="pointer-events-none absolute inset-8 rounded-full bg-black/20" />

                  <div className="relative z-10 text-center">
                    <div className="text-6xl font-semibold tracking-[-0.04em] text-white">
                      {portfolioScore}
                    </div>

                    <div className="mt-1 text-[10px] uppercase tracking-[0.24em] text-cyan-100/70">
                      /100
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <Progress value={portfolioScore} />
                </div>

                <div className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/[0.08] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100">
                  <Check className="size-3.5 text-emerald-300" />
                  {portfolioScore >= 80
                    ? t("portfolio.recruiterSignal")
                    : portfolioScore >= 65
                      ? t("linkedin.strongFoundation")
                      : portfolioScore > 0
                        ? t("linkedin.needsPolish")
                        : t("portfolio.awaitingScan")}
                </div>

                <div className="mt-4 text-xs leading-5 text-white/55">
                  {analysis
                    ? t("portfolio.basedOnRepositories", {
                        count: repos.length,
                      })
                    : isLoadingProfile
                      ? t("portfolio.loadingSavedAnalysis")
                      : t("portfolio.runScanCalculateQuality")}
                </div>
              </div>
            </div>

            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                {t("portfolio.githubReadiness")}
              </div>

              <div className="mt-4 text-3xl font-semibold tracking-tight text-white">
                {t("portfolio.heroTitle")}
              </div>

              <div className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                {t("portfolio.heroDescription")}
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/7 bg-white/[0.035] p-4">
                  <Progress
                    label={t("recruiterView.technicalDepth")}
                    value={signals?.technical_depth || 0}
                    color={getProgressColor(signals?.technical_depth || 0)}
                  />
                </div>

                <div className="rounded-2xl border border-white/7 bg-white/[0.035] p-4">
                  <Progress
                    label={t("portfolio.architecture")}
                    value={signals?.architecture || 0}
                    color={getProgressColor(signals?.architecture || 0)}
                  />
                </div>

                <div className="rounded-2xl border border-white/7 bg-white/[0.035] p-4">
                  <Progress
                    label={t("portfolio.readmeQuality")}
                    value={signals?.readme_quality || 0}
                    color={getProgressColor(signals?.readme_quality || 0)}
                  />
                </div>

                <div className="rounded-2xl border border-white/7 bg-white/[0.035] p-4">
                  <Progress
                    label={t("portfolio.businessImpact")}
                    value={signals?.business_impact || 0}
                    color={getProgressColor(signals?.business_impact || 0)}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/7 bg-black/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Search className="size-4 text-violet-300" />
                {t("portfolio.scanGithubProfile")}
              </div>

              <div className="mt-1 text-xs leading-5 text-white/45">
                {t("portfolio.scanGithubDescription")}
              </div>

              <div className="mt-5 space-y-3">
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
                    placeholder={t("portfolio.githubUsernamePlaceholder")}
                    className="w-full rounded-2xl border border-white/10 bg-black/25 py-3 pl-11 pr-4 text-sm text-white/80 outline-none transition placeholder:text-white/30 focus:border-cyan-300/30"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAnalyzePortfolio}
                  disabled={!canAnalyze || isAnalyzing || isLoadingProfile}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-4 py-3 text-sm font-semibold text-primary-foreground glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Github className="size-4" />
                  )}

                  {isAnalyzing
                    ? t("portfolio.scanningGithub")
                    : analysis
                      ? t("portfolio.rescanGithub")
                      : t("portfolio.scanGithub")}
                </button>

                {error && (
                  <div className="rounded-2xl border border-orange-400/10 bg-orange-400/[0.06] p-3 text-xs text-orange-200">
                    {error}
                  </div>
                )}
              </div>

              {analysis?.github_profile && (
                <div className="mt-5 rounded-[1.75rem] border border-cyan-300/10 bg-white/[0.035] p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/60">
                    {t("portfolio.connectedProfile")}
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={analysis.github_profile.avatar_url}
                      alt={analysis.github_profile.username}
                      className="size-12 rounded-2xl border border-white/10 object-cover shadow-[0_12px_34px_rgba(0,0,0,0.28)]"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-white">
                        {analysis.github_profile.name || analysis.github_profile.username}
                      </div>

                      <a
                        href={analysis.github_profile.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1 rounded-full border border-cyan-300/10 bg-cyan-300/[0.06] px-2.5 py-1 text-[11px] text-cyan-100/75 transition hover:bg-cyan-300/[0.10]"
                      >
                        @{analysis.github_profile.username}
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>

                  {analysis.github_profile.bio && (
                    <div className="mt-3 line-clamp-2 text-xs leading-5 text-white/50">
                      {analysis.github_profile.bio}
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-2xl border border-white/5 bg-black/20 px-3 py-2.5">
                      <div className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                        {t("portfolio.followers")}
                      </div>

                      <div className="mt-1 text-lg font-semibold text-white">
                        {analysis.github_profile.followers}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-black/20 px-3 py-2.5">
                      <div className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                        {t("portfolio.following")}
                      </div>

                      <div className="mt-1 text-lg font-semibold text-white">
                        {analysis.github_profile.following}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {isAnalyzing && (
          <PortfolioScanLoader />
        )}




        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <Card className="relative overflow-hidden border-cyan-300/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.96),rgba(8,13,24,0.98)_52%,rgba(24,18,54,0.78))] shadow-[0_24px_80px_rgba(6,182,212,0.08)]">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent)]" />

            <div className="relative">
              <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Code2 className="size-4 text-cyan-300" />
                      {t("portfolio.repositoryReviews")}
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      {t("portfolio.repositoryReviewsDescription")}
                    </div>
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/50">
                  {t("portfolio.reposCount", {
                    count: repos.length,
                  })}
                </div>
              </div>

              <div className="space-y-3">
                {repos.length === 0 ? (
                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-sm text-white/45">
                    {t("portfolio.enterGithubUsernameEmpty")}
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
                          </div>

                          <div className="mt-1 text-sm text-muted-foreground">
                            {repo.description || t("portfolio.noRepositoryDescription")}
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
                              {t("portfolio.viewRepo")}
                              <ExternalLink className="size-3.5" />
                            </a>
                          </div>
                        </div>

                        <div className="w-full rounded-2xl border border-white/7 bg-black/20 p-4 md:w-72">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                              {t("portfolio.repoScore")}
                            </div>

                            <div className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getTagClassName(repo.tag)}`}>
                              {repo.tag}
                            </div>
                          </div>

                          <div className="flex items-end justify-between gap-4">
                            <div className="flex items-end gap-1">
                              <div className="text-4xl font-semibold tracking-tight text-white">
                                {repo.score}
                              </div>

                              <div className="mb-1.5 text-xs text-white/45">
                                /100
                              </div>
                            </div>

                            <div className="text-right text-xs text-white/45">
                              {repo.score >= 80
                                ? t("portfolio.strongSignal")
                                : repo.score >= 65
                                  ? t("portfolio.solidProject")
                                  : repo.score >= 50
                                    ? t("linkedin.needsPolish")
                                    : t("portfolio.lowSignal")}
                            </div>
                          </div>

                          <div className="mt-3">
                            <Progress
                              value={repo.score}
                              color={getProgressColor(repo.score)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/5 bg-black/20 p-4">
                        <div className="text-sm leading-7 text-white/70">
                          {repo.summary || t("portfolio.noRepositorySummary")}
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-200/80">
                              {t("recruiterView.strengths")}
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
                                <li>{t("portfolio.noStrengthsListed")}</li>
                              )}
                            </ul>
                          </div>

                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-200/80">
                              {t("portfolio.risks")}
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
                                <li>{t("portfolio.noMajorRisksListed")}</li>
                              )}
                            </ul>
                          </div>

                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-200/80">
                              {t("portfolio.improvements")}
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
                                <li>{t("portfolio.noImprovementsListed")}</li>
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

          <div className="space-y-5">
            <Card className="relative overflow-hidden border-white/7 bg-white/[0.025]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.10),transparent_40%)]" />

              <div className="relative">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <Sparkles className="size-4 text-[oklch(0.85_0.14_250)]" />
                  {t("portfolio.topWins")}
                </div>

                <ul className="space-y-3 text-sm">
                  {analysis?.top_wins?.length ? (
                    analysis.top_wins.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-white/70"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-[oklch(0.78_0.17_155)]" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-white/45">
                      {t("portfolio.topWinsEmpty")}
                    </li>
                  )}
                </ul>
              </div>
            </Card>
            <Card className="relative overflow-hidden border-white/7 bg-white/[0.025]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_42%)]" />

              <div className="relative">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Flame className="size-4 text-orange-300" />
                  {t("portfolio.recruiterAttentionHeatmap")}
                </div>

                <div className="space-y-2">
                  {repos.length ? (
                    repos.map((repo) => {
                      const meta = getAttentionMeta(
                        repo.recruiter_attention,
                        t,
                      );
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
                                {repo.attention_reason || t("portfolio.attentionEstimated")}
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
                      {t("portfolio.attentionLevelsEmpty")}
                    </div>
                  )}
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden border-orange-400/10 bg-orange-400/[0.035]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.08),transparent_40%)]" />

              <div className="relative">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="size-4 text-orange-300" />
                  {t("portfolio.redFlags")}
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
                      {t("portfolio.redFlagsEmpty")}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden border-emerald-400/10 bg-emerald-400/[0.035]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_45%)]" />

              <div className="relative">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="size-4 text-violet-300" />
                  {t("linkedin.recruiterConclusion")}
                </div>

                <div className="text-sm leading-7 text-white/70">
                  {analysis?.ai_conclusion ||
                    t("portfolio.conclusionEmpty")}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

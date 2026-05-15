import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import logo from "../../static/logo.png";
import {
  ArrowRight,
  Brain,
  Briefcase,
  Eye,
  FileText,
  Github,
  Linkedin,
  Mic,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

const featureCards = [
  {
    icon: FileText,
    title: "AI Resume Builder",
    desc: "Create recruiter-ready resumes with modern templates, ATS optimization, AI bullet rewrites and live feedback.",
    large: true,
    preview: "ats",
  },
  {
    icon: Eye,
    title: "Recruiter View",
    desc: "See exactly what recruiters notice first with attention heatmaps, weak-point detection and profile scoring.",
    large: true,
    preview: "heatmap",
  },
  {
    icon: Sparkles,
    title: "AI Cover Letters",
    desc: "Generate tailored cover letters directly from job postings.",
    preview: "coverletter",
  },
  {
    icon: Linkedin,
    title: "LinkedIn Optimizer",
    desc: "Improve your headline, About section and recruiter visibility.",
    preview: "linkedin",
  },
  {
    icon: Github,
    title: "Portfolio Analyzer",
    desc: "Analyze GitHub quality, README depth and project originality.",
    preview: "github",
  },
  {
    icon: Mic,
    title: "Interview Simulator",
    desc: "Practice realistic technical & behavioral interviews with AI.",
    preview: "chat",
  },
  {
    icon: Brain,
    title: "Self-Marketing Coach",
    desc: "Learn how to position yourself like a strong candidate.",
    preview: "coach",
  },
  {
    icon: Target,
    title: "Application Score",
    desc: "Track how competitive your application currently is.",
    preview: "score",
  },
];

const marqueeItems = [
  "Your resume gets ignored in seconds",
  "Most portfolios look tutorial-based",
  "Recruiters scan before they read",
  "Weak positioning kills strong candidates",
  "Most juniors undersell themselves",
  "LinkedIn headlines matter more than you think",
  "Strong projects still need strong presentation",
  "Recruiters notice clarity immediately",
];

function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-[oklch(0.145_0.02_270)] text-white">
      <Nav />
      <Hero />
      <Marquee />
      <FeatureGrid />
      <DashboardSection />
      <RecruiterSection />
      <CTASection />
      <Footer />
    </div>
  );
}

function Nav() {
  const { user, logoutUser } = useAuth();
  return (
    <header className="sticky top-0 z-50 px-4 pt-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/6 bg-[rgba(7,10,18,0.72)] px-6 py-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10),transparent_25%)]" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl" />

            <img
              src={logo}
              alt="Launchly logo"
              className="relative h-9 w-auto object-contain"
            />
          </div>
        </Link>

        <nav className="relative z-10 hidden items-center gap-8 lg:flex">
          <a
            href="#features"
            className="text-sm text-white/50 transition duration-200 hover:text-white"
          >
            Features
          </a>

          <a
            href="#dashboard"
            className="text-sm text-white/50 transition duration-200 hover:text-white"
          >
            Dashboard
          </a>

          <a
            href="#recruiter"
            className="text-sm text-white/50 transition duration-200 hover:text-white"
          >
            Recruiter AI
          </a>
        </nav>

        <div className="relative z-10 flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden text-sm text-white/70 transition hover:text-white md:inline-flex"
              >
                Dashboard
              </Link>

              <button
                onClick={logoutUser}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-200 transition duration-300 hover:bg-red-500/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden text-sm text-white/55 transition hover:text-white md:inline-flex"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-violet-400/20 bg-[linear-gradient(135deg,rgba(139,92,246,1)_0%,rgba(99,102,241,1)_45%,rgba(34,211,238,1)_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.35)] transition duration-300 hover:scale-[1.03]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.16)_50%,transparent_80%)] opacity-0 transition duration-700 group-hover:translate-x-[180%] group-hover:opacity-100 -translate-x-[180%]" />

                <span className="relative">Launch app</span>

                <ArrowRight className="relative size-4 transition group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { user } = useAuth();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.18),transparent_30%)]" />

      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:80px_80px]" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 pb-24 pt-24 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 backdrop-blur-xl">
            <span className="size-2 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
            Modern career tools for students & junior developers
          </div>

          <h1 className="mt-7 text-6xl font-semibold leading-[1.05] tracking-tight lg:text-7xl">
            Your skills matter.
            <br />
            <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
              But how you present them matters too.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-white/60">
            Getting noticed is harder than ever.
            Launchly helps you understand how recruiters perceive your profile
            and what actually improves your chances of getting interviews.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-7 py-4 text-sm font-semibold text-white shadow-2xl shadow-violet-500/30 transition hover:scale-[1.02]"
              >
                Go to dashboard
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-7 py-4 text-sm font-semibold text-white shadow-2xl shadow-violet-500/30 transition hover:scale-[1.02]"
              >
                Start for free
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </Link>
            )}

            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm text-white/70 backdrop-blur-xl transition hover:bg-white/10"
            >
              Explore features
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/45">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Privacy-first
            </span>

            <span className="inline-flex items-center gap-2">
              <Zap className="size-4" />
              Setup in under 60 seconds
            </span>

            <span className="inline-flex items-center gap-2">
              <UserCheck className="size-4" />
              Built for real beginners
            </span>
          </div>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div className="absolute -left-16 top-20 size-64 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute -right-10 bottom-0 size-64 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-2xl">
        <div className="rounded-[28px] bg-[oklch(0.18_0.02_270)] p-5">
          <div className="mb-5 flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-red-400" />
            <span className="size-2.5 rounded-full bg-yellow-400" />
            <span className="size-2.5 rounded-full bg-green-400" />

            <div className="ml-3 text-xs text-white/40">
              launchly.app/dashboard
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <GlassCard
              title="Career Score"
              value="86"
              sub="+14 this week"
            />

            <GlassCard
              title="Recruiter Impression"
              value="A-"
              sub="Stronger than 78%"
            />

            <GlassCard
              title="Interview Readiness"
              value="74%"
              sub="3 mock interviews"
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-white/50">
                  Recruiter attention analysis
                </span>

                <span className="rounded-full bg-violet-500/10 px-2 py-1 text-xs text-violet-300">
                  Live analysis
                </span>
              </div>

              <div className="relative h-56 overflow-hidden rounded-2xl border border-white/5 bg-black/20">
                <div className="absolute left-8 top-8 size-40 rounded-full bg-red-400/40 blur-3xl" />
                <div className="absolute left-28 top-24 size-28 rounded-full bg-yellow-300/30 blur-3xl" />
                <div className="absolute right-10 bottom-8 size-32 rounded-full bg-cyan-400/20 blur-3xl" />

                <div className="relative space-y-3 p-6">
                  <div className="h-3 w-2/3 rounded bg-white/20" />
                  <div className="h-2 w-1/3 rounded bg-white/10" />

                  <div className="pt-4 space-y-2">
                    <div className="h-2 w-full rounded bg-white/10" />
                    <div className="h-2 w-5/6 rounded bg-white/10" />
                    <div className="h-2 w-4/6 rounded bg-white/10" />
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="h-2 w-full rounded bg-white/10" />
                    <div className="h-2 w-3/5 rounded bg-white/10" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-xs text-white/40">
                  AI suggestions
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    "Quantify backend project impact",
                    "Improve LinkedIn headline",
                    "Replace generic portfolio wording",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3"
                    >
                      <Sparkles className="mt-0.5 size-4 text-cyan-300" />
                      <span className="text-sm text-white/70">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-cyan-400/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    Market fit
                  </span>

                  <TrendingUp className="size-4 text-cyan-300" />
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    ["Backend Engineer", 88],
                    ["AI Engineer", 76],
                    ["Platform Engineer", 61],
                  ].map(([role, value]) => (
                    <div key={role}>
                      <div className="mb-1 flex justify-between text-xs text-white/50">
                        <span>{role}</span>
                        <span>{value}%</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs text-white/40">{title}</div>

      <div className="mt-2 text-3xl font-semibold tracking-tight">
        {value}
      </div>

      <div className="mt-1 text-xs text-cyan-300">{sub}</div>
    </div>
  );
}

function Marquee() {
  return (
    <section className="border-y border-white/5 py-7">
      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee gap-12 text-sm font-medium text-white/45">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span>{item}</span>
              <span className="size-1 rounded-full bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-4 py-28"
    >
      <SectionHeading
        kicker="Everything in one place"
        title="Your entire career growth stack."
        sub="From resumes and LinkedIn optimization to interview simulations and recruiter psychology."
      />

      <div className="mt-16 grid gap-5 grid-cols-1 lg:grid-cols-6 auto-rows-fr">
        {featureCards.map((feature) => (
          <div
            key={feature.title}
            className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-violet-400/20 ${
              feature.large
                ? "lg:col-span-3"
                : "lg:col-span-2"
            }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.18),transparent_35%)] opacity-80" />

            <div className="relative flex h-full flex-col">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="rounded-full border border-emerald-400/10 bg-emerald-400/10 px-2 py-1 text-[11px] font-medium text-emerald-200">
                  Smart Analysis
                </div>

                {feature.large && (
                  <div className="rounded-full border border-violet-400/10 bg-violet-400/10 px-2 py-1 text-[11px] font-medium text-violet-200">
                    Hiring Focused
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 shadow-lg shadow-black/20">
                  <feature.icon className="size-5 text-cyan-300" />
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-white">
                  {feature.title}
                </h3>
              </div>

              <p className="mt-4 text-sm leading-7 text-white/55 min-h-[84px]">
                {feature.desc}
              </p>

              <div className="mt-5 flex-1">
                {feature.preview === "ats" && (
                  <div className="rounded-2xl border border-emerald-400/10 bg-gradient-to-br from-emerald-400/5 to-cyan-400/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-white/45">
                          Resume strength
                        </div>

                        <div className="mt-1 text-2xl font-semibold text-white">
                          92%
                        </div>
                      </div>

                      <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
                        Recruiter Ready
                      </div>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300" />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-black/20 p-3">
                        <div className="text-white/40">Keywords</div>
                        <div className="mt-1 font-medium text-white/80">
                          Strong match
                        </div>
                      </div>

                      <div className="rounded-xl bg-black/20 p-3">
                        <div className="text-white/40">Readability</div>
                        <div className="mt-1 font-medium text-white/80">
                          Recruiter friendly
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {feature.preview === "heatmap" && (
                  <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                    <div className="flex items-center justify-between text-xs text-white/45">
                      <span>Recruiter scan</span>
                      <span className="text-cyan-300">8 second scan</span>
                    </div>

                    <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                      <div className="absolute left-8 top-8 size-20 rounded-full bg-red-400/25 blur-2xl" />
                      <div className="absolute right-10 top-16 size-16 rounded-full bg-yellow-300/20 blur-2xl" />
                      <div className="absolute bottom-6 left-20 size-14 rounded-full bg-cyan-400/20 blur-2xl" />

                      <div className="relative space-y-3">
                        <div className="h-3 w-2/3 rounded bg-white/15" />
                        <div className="h-2 w-1/2 rounded bg-white/10" />
                        <div className="pt-4 space-y-2">
                          <div className="h-2 w-full rounded bg-white/10" />
                          <div className="h-2 w-5/6 rounded bg-white/10" />
                          <div className="h-2 w-4/6 rounded bg-white/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {feature.preview === "chat" && (
                  <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                    <div className="flex items-center justify-between text-xs text-white/45">
                      <span>Mock interview</span>
                      <span className="text-violet-300">Live simulation</span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="max-w-[85%] rounded-2xl bg-white/[0.05] px-4 py-3 text-xs leading-6 text-white/70">
                        Tell me about a challenging backend project you worked on.
                      </div>

                      <div className="ml-auto max-w-[75%] rounded-2xl bg-violet-500/15 px-4 py-3 text-xs leading-6 text-violet-100">
                        I improved API performance and reduced response times significantly...
                      </div>
                    </div>
                  </div>
                )}

                {feature.preview === "github" && (
                  <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white/80">
                          InsightAI
                        </div>

                        <div className="text-xs text-white/40">
                          Repository analysis
                        </div>
                      </div>

                      <div className="rounded-lg bg-cyan-400/10 px-2 py-1 text-xs text-cyan-300">
                        Strong
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {[
                        ["README Quality", "91%"],
                        ["Architecture", "Advanced"],
                        ["Originality", "High"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-xs"
                        >
                          <span className="text-white/45">{label}</span>
                          <span className="text-white/75">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {feature.preview === "linkedin" && (
                  <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                    <div className="flex items-center justify-between text-xs text-white/45">
                      <span>LinkedIn optimization</span>
                      <span className="text-cyan-300">+34% visibility</span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                        <div className="text-[11px] text-white/40">
                          Suggested headline
                        </div>

                        <div className="mt-2 text-xs leading-6 text-white/75">
                          AI Engineer focused on FastAPI, RAG systems and scalable backend applications.
                        </div>
                      </div>

                      <div className="flex gap-2 text-[11px]">
                        <div className="rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-200">
                          Recruiter friendly
                        </div>

                        <div className="rounded-full bg-violet-400/10 px-2 py-1 text-violet-200">
                          Better positioning
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {feature.preview === "coverletter" && (
                  <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                    <div className="text-xs text-white/45">
                      Personalized cover letter
                    </div>

                    <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.03] p-4">
                      <div className="space-y-2">
                        <div className="h-2 w-3/5 rounded bg-white/10" />
                        <div className="h-2 w-full rounded bg-white/10" />
                        <div className="h-2 w-5/6 rounded bg-white/10" />
                        <div className="h-2 w-2/3 rounded bg-violet-400/30" />
                      </div>
                    </div>
                  </div>
                )}

                {feature.preview === "coach" && (
                  <div className="rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/10 to-transparent p-4">
                    <div className="text-xs text-white/45">
                      Career positioning insights
                    </div>

                    <div className="mt-4 rounded-2xl bg-black/20 p-4 text-xs leading-6 text-violet-100/85">
                      Your technical skills are strong, but your positioning still sounds too generic.
                      Recruiters should immediately understand your specialization.
                    </div>
                  </div>
                )}

                {feature.preview === "score" && (
                  <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                    <div className="flex items-center justify-between text-xs text-white/45">
                      <span>Application strength</span>
                      <span className="text-cyan-300">82%</span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="rounded-xl bg-white/[0.03] p-3">
                        <div className="text-white/40">Resume</div>
                        <div className="mt-1 font-medium text-white/80">88%</div>
                      </div>

                      <div className="rounded-xl bg-white/[0.03] p-3">
                        <div className="text-white/40">LinkedIn</div>
                        <div className="mt-1 font-medium text-white/80">79%</div>
                      </div>

                      <div className="rounded-xl bg-white/[0.03] p-3">
                        <div className="text-white/40">Portfolio</div>
                        <div className="mt-1 font-medium text-white/80">81%</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>


            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardSection() {
  return (
    <section
      id="dashboard"
      className="mx-auto grid max-w-7xl gap-16 px-4 py-28 lg:grid-cols-2 lg:items-center"
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">
          <Brain className="size-4 text-cyan-300" />
          Career Intelligence Dashboard
        </div>

        <h2 className="mt-6 text-5xl font-semibold tracking-tight">
          A dashboard that thinks like a recruiter.
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
          Launchly analyzes your resume, LinkedIn profile,
          portfolio and interview readiness to show where you already stand out
          and what still needs improvement.
        </p>

        <div className="mt-10 space-y-5">
          {[
            "Career score and recruiter impression",
            "Weak bullet point detection",
            "Advanced LinkedIn optimization",
            "Portfolio & GitHub analysis",
            "Interview readiness tracking",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-4"
            >
              <div className="mt-1 grid size-6 place-items-center rounded-full bg-violet-500/10">
                <Sparkles className="size-3.5 text-violet-300" />
              </div>

              <p className="text-white/65">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 blur-3xl" />

        <div className="relative rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-black/20 p-5">
              <div className="text-sm text-white/45">
                Career Score
              </div>

              <div className="mt-4 flex items-end gap-3">
                <div className="text-6xl font-semibold">86</div>

                <div className="mb-2 rounded-full bg-green-400/10 px-2 py-1 text-xs text-green-300">
                  +12%
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-black/20 p-5">
              <div className="text-sm text-white/45">
                Recruiter Impression
              </div>

              <div className="mt-5 space-y-3">
                {[
                  ["Technical Depth", 88],
                  ["Communication", 64],
                  ["Project Quality", 79],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-xs text-white/50">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-black/20 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/45">
                AI Recruiter Notes
              </span>

              <Briefcase className="size-4 text-cyan-300" />
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Strong backend engineering profile",
                "Projects show real technical depth",
                "Resume lacks measurable impact metrics",
                "LinkedIn positioning could be stronger",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-sm text-white/65"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecruiterSection() {
  return (
    <section
      id="recruiter"
      className="mx-auto max-w-7xl px-4 py-28"
    >
      <SectionHeading
        kicker="Recruiter psychology"
        title="Most juniors don’t know how recruiters evaluate their applications."
        sub="Launchly shows what stands out, what feels weak and where your profile needs work."
      />

      <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Generic bullet points detected",
            severity: "High impact",
            score: 91,
            confidence: "96% confidence",
            glow: "from-red-500/20 to-orange-400/10",
            border: "border-red-400/15",
            badge: "bg-red-400/10 text-red-200",
            dot: "bg-red-400",
          },
          {
            title: "Portfolio feels tutorial-based",
            severity: "Needs improvement",
            score: 72,
            confidence: "82% confidence",
            glow: "from-amber-400/15 to-orange-300/10",
            border: "border-amber-400/15",
            badge: "bg-amber-400/10 text-amber-200",
            dot: "bg-amber-300",
          },
          {
            title: "LinkedIn headline lacks positioning",
            severity: "Medium impact",
            score: 66,
            confidence: "79% confidence",
            glow: "from-violet-500/15 to-cyan-400/10",
            border: "border-violet-400/15",
            badge: "bg-violet-400/10 text-violet-200",
            dot: "bg-violet-300",
          },
          {
            title: "Missing measurable impact metrics",
            severity: "High impact",
            score: 88,
            confidence: "93% confidence",
            glow: "from-red-500/20 to-pink-400/10",
            border: "border-red-400/15",
            badge: "bg-red-400/10 text-red-200",
            dot: "bg-red-400",
          },
          {
            title: "Technical specialization is unclear",
            severity: "Medium impact",
            score: 63,
            confidence: "76% confidence",
            glow: "from-cyan-500/15 to-violet-400/10",
            border: "border-cyan-400/15",
            badge: "bg-cyan-400/10 text-cyan-200",
            dot: "bg-cyan-300",
          },
          {
            title: "Projects need stronger explanations",
            severity: "Needs improvement",
            score: 69,
            confidence: "80% confidence",
            glow: "from-amber-500/15 to-yellow-300/10",
            border: "border-amber-400/15",
            badge: "bg-amber-400/10 text-amber-200",
            dot: "bg-amber-300",
          },
          {
            title: "Resume readability could be stronger",
            severity: "Low impact",
            score: 41,
            confidence: "71% confidence",
            glow: "from-emerald-500/10 to-cyan-400/10",
            border: "border-emerald-400/15",
            badge: "bg-emerald-400/10 text-emerald-200",
            dot: "bg-emerald-300",
          },
          {
            title: "Interview communication lacks confidence",
            severity: "Medium impact",
            score: 74,
            confidence: "84% confidence",
            glow: "from-violet-500/15 to-fuchsia-400/10",
            border: "border-violet-400/15",
            badge: "bg-violet-400/10 text-violet-200",
            dot: "bg-violet-300",
          },
        ].map((item) => (
          <div
            key={item.title}
            className={`group relative overflow-hidden rounded-3xl border ${item.border} bg-white/[0.03] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/15`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.glow} opacity-70`}
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`size-2 rounded-full ${item.dot} shadow-[0_0_14px_rgba(255,255,255,0.35)]`}
                    />

                    <span className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                      Recruiter Signal
                    </span>
                  </div>

                  <div className="mt-4 text-sm font-medium leading-6 text-white/85">
                    {item.title}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-semibold tracking-tight text-white">
                    {item.score}
                  </div>

                  <div className="text-[11px] text-white/35">
                    Attention score
                  </div>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.glow.replace("/20", "").replace("/15", "").replace("/10", "")}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div
                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${item.badge}`}
                >
                  {item.severity}
                </div>

                <div className="text-[11px] text-white/40">
                  {item.confidence}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-28">
      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.04] px-8 py-20 text-center backdrop-blur-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-400/10" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">
            <Rocket className="size-4 text-cyan-300" />
            Built for ambitious beginners
          </div>

          <h2 className="mx-auto mt-7 max-w-4xl text-5xl font-semibold leading-tight tracking-tight">
            Strong skills are important.
            But visibility, positioning and communication decide who gets interviews.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Launchly helps you stop guessing and start improving strategically.
          </p>

          {user ? (
            <Link
              to="/dashboard"
              className="group mt-10 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-violet-500/30 transition hover:scale-[1.02]"
            >
              Go to dashboard
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="group mt-10 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-violet-500/30 transition hover:scale-[1.02]"
            >
              Launch your career
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-8 text-sm text-white/40 md:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <img
              src={logo}
              alt="Launchly logo"
              className="h-9 w-auto object-contain"
            />
          </div>

          <span>Launchly</span>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="https://www.linkedin.com/in/ilyas-suelen/"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            LinkedIn
          </a>

          <a
            href="https://github.com/ilyassuelen/"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            GitHub
          </a>

          <a href="#" className="transition hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

function SectionHeading({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">
        <Sparkles className="size-4 text-cyan-300" />
        {kicker}
      </div>

      <h2 className="mt-6 text-5xl font-semibold tracking-tight">
        {title}
      </h2>

      <p className="mt-5 text-lg leading-8 text-white/60">
        {sub}
      </p>
    </div>
  );
}
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FileText, Mail, Mic, Linkedin, Github, Map,
  Briefcase, Settings, Sparkles,
  User, LogOut,
} from "lucide-react";
import logo from "../../../static/logo.png";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";

const items = [
  { titleKey: "nav.dashboard", url: "/dashboard", icon: LayoutDashboard },
  { titleKey: "nav.resumeBuilder", url: "/resumes", icon: FileText },
  { titleKey: "nav.coverLetters", url: "/cover-letters", icon: Mail },
  { titleKey: "nav.recruiterView", url: "/recruiter-view", icon: Sparkles },
  { titleKey: "nav.interviewSimulator", url: "/interview", icon: Mic },
  { titleKey: "nav.linkedInAnalyzer", url: "/linkedin", icon: Linkedin },
  { titleKey: "nav.portfolioAnalyzer", url: "/portfolio", icon: Github },
  { titleKey: "nav.careerPath", url: "/career-path", icon: Map },
  { titleKey: "nav.applications", url: "/applications", icon: Briefcase },
];


export function AppShell({
  children,
  title,
  subtitle,
  action,
  defaultSidebarCollapsed: _defaultSidebarCollapsed = false,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  defaultSidebarCollapsed?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { t } = useI18n();

  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  function handleLogout() {
    logoutUser();
    navigate({ to: "/" });
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-40 px-4 pt-4 md:px-6 xl:px-8">
        <div className="mx-auto flex min-h-[4.8rem] w-full items-center gap-4 rounded-[1.75rem] border border-white/[0.08] bg-[radial-gradient(circle_at_0%_0%,rgba(124,92,255,0.18),transparent_34%),radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.13),transparent_30%),rgba(9,13,24,0.82)] px-4 shadow-[0_22px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl md:px-5 xl:px-6">
          <Link to="/" className="flex shrink-0 items-center">
            <img
              src={logo}
              alt="Launchly logo"
              className="h-9 w-auto object-contain md:h-10"
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="flex min-w-0 flex-1 items-center justify-start gap-0.5 overflow-x-auto rounded-[1.35rem] border border-white/[0.08] bg-black/20 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => {
              const active = isActive(item.url);
              return (
                <Link
                  key={item.titleKey}
                  to={item.url}
                  className={`group relative flex min-w-max items-center gap-1.5 rounded-2xl px-2.5 py-1.5 text-[0.88rem] font-medium tracking-[-0.018em] transition ${
                    active
                      ? "bg-white/[0.095] text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_10px_24px_rgba(0,0,0,0.18)]"
                      : "text-muted-foreground/90 hover:bg-white/[0.06] hover:text-foreground"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-px rounded-full bg-gradient-brand opacity-80" />
                  )}
                  <item.icon className={`size-3 shrink-0 transition ${active ? "text-[oklch(0.82_0.16_215)]" : "text-muted-foreground group-hover:text-foreground"}`} />
                  <span className="whitespace-nowrap">{t(item.titleKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex size-10 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-[0_14px_36px_rgba(34,211,238,0.22)] transition hover:scale-[1.03]"
              >
                <User className="size-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[rgba(10,14,24,0.96)] shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate({ to: "/settings" });
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white/80 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <Settings className="size-4" />
                    {t("common.settings")}
                  </button>

                  <div className="h-px bg-white/5" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-200 transition hover:bg-red-400/10"
                  >
                    <LogOut className="size-4" />
                    {t("common.logout")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 pt-8 md:px-8 xl:px-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      </div>

      <main className="w-full px-4 pb-16 pt-6 md:px-8 xl:px-10 animate-fade-up">{children}</main>
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass rounded-2xl p-5 shadow-card ${className}`}>{children}</div>;
}

export function StatCard({ label, value, delta, icon: Icon, tone = "violet" }: {
  label: string; value: string; delta?: string; icon: React.ComponentType<{ className?: string }>; tone?: "violet"|"cyan"|"pink"|"green";
}) {
  const tones: Record<string,string> = {
    violet: "from-[oklch(0.55_0.20_295)] to-[oklch(0.45_0.16_260)]",
    cyan: "from-[oklch(0.55_0.18_200)] to-[oklch(0.45_0.14_220)]",
    pink: "from-[oklch(0.60_0.20_340)] to-[oklch(0.45_0.16_310)]",
    green: "from-[oklch(0.62_0.18_155)] to-[oklch(0.45_0.14_180)]",
  };
  return (
    <div className="relative overflow-hidden rounded-2xl glass p-5 shadow-card">
      <div className={`absolute -right-8 -top-8 size-28 rounded-full bg-gradient-to-br ${tones[tone]} opacity-30 blur-2xl`} />
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="grid size-8 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
          <Icon className="size-4 text-[oklch(0.85_0.14_250)]" />
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {delta && <div className="text-xs text-[oklch(0.78_0.17_155)]">{delta}</div>}
      </div>
    </div>
  );
}

export function Progress({ value, label, color = "brand" }: { value: number; label?: string; color?: "brand"|"green"|"pink" }) {
  const bg = color === "green" ? "bg-[oklch(0.78_0.17_155)]" : color === "pink" ? "bg-[oklch(0.78_0.18_340)]" : "bg-gradient-brand";
  return (
    <div>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span>{label}</span><span className="text-muted-foreground">{value}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div className={`h-full ${bg}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

import {
  Activity,
  Briefcase,
  Eye,
  FileText,
  Github,
  Linkedin,
  ShieldCheck,
} from "lucide-react";

import { Card, Progress } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";

type CareerSystemHealthProps = {
  profileStrength: Record<string, number>;
  interviewReadiness: number;
};

function getScore(profileStrength: Record<string, number>, key: string) {
  return Math.max(0, Math.min(100, Math.round(profileStrength?.[key] || 0)));
}

function getHealthLabel(score: number, t: (key: string) => string) {
  if (score >= 85) return t("dashboard.healthExcellentSystem");
  if (score >= 75) return t("dashboard.healthStrongFoundation");
  if (score >= 60) return t("dashboard.healthGoodMomentum");
  if (score > 0) return t("dashboard.healthNeedsFocus");
  return t("dashboard.healthAwaitingReview");
}

export function CareerSystemHealth({ profileStrength, interviewReadiness }: CareerSystemHealthProps) {
  const { t } = useI18n();
  const resumeScore = getScore(profileStrength, "Resume");
  const recruiterScore = getScore(profileStrength, "Recruiter View");
  const linkedInScore = getScore(profileStrength, "LinkedIn");
  const portfolioScore = getScore(profileStrength, "Portfolio");
  const applicationsScore = getScore(profileStrength, "Applications");
  const health = Math.round((resumeScore + recruiterScore + linkedInScore + portfolioScore + applicationsScore + interviewReadiness) / 6);

  const tiles = [
    { label: t("dashboard.resume"), value: resumeScore, icon: FileText },
    { label: t("dashboard.recruiter"), value: recruiterScore, icon: Eye },
    { label: t("dashboard.linkedIn"), value: linkedInScore, icon: Linkedin },
    { label: t("dashboard.portfolio"), value: portfolioScore, icon: Github },
    { label: t("dashboard.apps"), value: applicationsScore, icon: Briefcase },
    { label: t("dashboard.practice"), value: interviewReadiness, icon: Activity },
  ];

  return (
    <Card className="relative overflow-hidden border-violet-300/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.96),rgba(8,13,24,0.98)_52%,rgba(34,24,58,0.48))] p-0 shadow-[0_22px_70px_rgba(124,92,255,0.06)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(124,92,255,0.14),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(34,211,238,0.08),transparent_36%)]" />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />

      <div className="relative flex h-full flex-col p-4 md:p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/12 bg-violet-300/[0.06] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-violet-100/70">
              <ShieldCheck className="size-3.5" />
              {t("dashboard.careerSystem")}
            </div>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">
              {t("dashboard.careerSystemHealthTitle")}
            </h2>
          </div>

          <div className="shrink-0 rounded-2xl border border-violet-300/12 bg-violet-300/[0.055] px-3.5 py-2 text-center">
            <div className="text-xl font-semibold leading-none text-white">
              {health}
            </div>
            <div className="mt-1 text-[0.58rem] uppercase tracking-[0.14em] text-violet-100/55">
              {t("dashboard.health")}
            </div>
          </div>
        </div>

        <div className="grid flex-1 gap-3 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="rounded-[1.35rem] border border-white/[0.08] bg-black/24 p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/38">
                  {t("dashboard.systemReadiness")}
                </div>
                <div className="mt-1 text-xl font-semibold tracking-tight text-white">
                  {getHealthLabel(health, t)}
                </div>
              </div>

              <div className="rounded-full border border-cyan-300/12 bg-cyan-300/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-100/70">
                {health}/100
              </div>
            </div>

            <div className="space-y-2.5">
              <Progress label={t("dashboard.resume")} value={resumeScore} color={resumeScore >= 75 ? "green" : undefined} />
              <Progress label={t("dashboard.recruiterView")} value={recruiterScore} />
              <Progress label={t("dashboard.linkedIn")} value={linkedInScore} />
              <Progress label={t("dashboard.portfolio")} value={portfolioScore} color={portfolioScore < 70 ? "pink" : undefined} />
              <Progress label={t("dashboard.applications")} value={applicationsScore} />
              <Progress label={t("dashboard.interviewing")} value={interviewReadiness} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 xl:grid-cols-2">
            {tiles.map((item) => (
              <div
                key={item.label}
                className="flex min-h-[92px] flex-col items-center justify-center rounded-[1.15rem] border border-white/[0.08] bg-black/22 p-3 text-center transition hover:border-cyan-300/18 hover:bg-white/[0.035]"
              >
                <item.icon className="size-4 text-cyan-200" />
                <div className="mt-2 text-base font-semibold leading-none text-white">
                  {item.value}%
                </div>
                <div className="mt-1 truncate text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

import { Briefcase, Clock3 } from "lucide-react";

import { Card } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";

import type { DashboardApplicationItem } from "@/features/dashboard/types/dashboard";

type ApplicationMomentumProps = {
  applications: DashboardApplicationItem[];
};

function getStatusColor(status?: string | null) {
  const key = (status || "").toLowerCase();
  if (key.includes("interview")) return "bg-cyan-400/10 text-cyan-200 border-cyan-300/10";
  if (key.includes("offer")) return "bg-emerald-400/10 text-emerald-200 border-emerald-300/10";
  if (key.includes("rejected")) return "bg-red-400/10 text-red-200 border-red-300/10";
  if (key.includes("applied")) return "bg-violet-400/10 text-violet-200 border-violet-300/10";
  return "bg-white/[0.04] text-white/70 border-white/10";
}

function formatDate(value: string | null | undefined, language: "english" | "german", t: (key: string) => string) {
  if (!value) return t("dashboard.unknown");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(language === "german" ? "de" : "en", { month: "short", day: "numeric" }).format(date);
}

export function ApplicationMomentum({ applications }: ApplicationMomentumProps) {
  const { language, t } = useI18n();
  const activeApplications = applications.filter((application) => !application.status?.toLowerCase().includes("rejected")).length;

  return (
    <Card className="relative overflow-hidden border-white/[0.08] bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.10),transparent_34%),rgba(255,255,255,0.028)]">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
      <div className="relative mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-cyan-100/60">
            <Briefcase className="size-3.5" />
            {t("dashboard.applicationMomentum")}
          </div>
          <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-white">{t("dashboard.applicationMomentumTitle")}</h2>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-center">
          <div className="text-lg font-semibold text-white">{activeApplications}</div>
          <div className="text-[0.6rem] uppercase tracking-[0.14em] text-white/35">
            {t("dashboard.activeLabel")}
          </div>
        </div>
      </div>

      <div className="relative space-y-2">
        {applications.length === 0 && (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4 text-sm text-white/50">{t("dashboard.applicationsEmpty")}</div>
        )}
        {applications.slice(0, 5).map((application, index) => (
          <div key={`${application.company_name}-${application.job_title}-${index}`} className="rounded-xl border border-white/[0.08] bg-black/20 p-3 transition hover:border-cyan-300/20 hover:bg-white/[0.04]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold tracking-tight text-white">{application.company_name}</div>
                <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{application.job_title}</div>
              </div>
              <div className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] ${getStatusColor(application.status)}`}>
                {application.status || t("dashboard.unknown")}
              </div>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock3 className="size-3.5" />
              {formatDate(application.date_label, language, t)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

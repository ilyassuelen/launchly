import {
  Briefcase,
  Clock3,
  Target,
} from "lucide-react";

import {
  Card,
} from "@/components/launchly/AppShell";

import { useI18n } from "@/i18n/I18nContext";

import type {
  DashboardApplicationItem,
} from "@/features/dashboard/types/dashboard";

type ApplicationMomentumProps = {
  applications: DashboardApplicationItem[];
};

function getStatusColor(status?: string | null) {
  const key = (status || "").toLowerCase();

  if (key.includes("interview")) {
    return "bg-cyan-400/10 text-cyan-200 border-cyan-300/10";
  }

  if (key.includes("offer")) {
    return "bg-emerald-400/10 text-emerald-200 border-emerald-300/10";
  }

  if (key.includes("rejected")) {
    return "bg-red-400/10 text-red-200 border-red-300/10";
  }

  if (key.includes("applied")) {
    return "bg-violet-400/10 text-violet-200 border-violet-300/10";
  }

  return "bg-white/[0.04] text-white/70 border-white/10";
}

function formatDate(
  value: string | null | undefined,
  language: "english" | "german",
  t: (key: string) => string,
) {
  if (!value) {
    return t("dashboard.unknown");
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    language === "german" ? "de" : "en",
    {
      month: "short",
      day: "numeric",
    },
  ).format(date);
}

export function ApplicationMomentum({
  applications,
}: ApplicationMomentumProps) {
  const { language, t } = useI18n();

  const activeApplications =
    applications.filter(
      (application) =>
        !application.status
          ?.toLowerCase()
          .includes("rejected"),
    ).length;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Briefcase className="size-4 text-cyan-300" />
            {t("dashboard.applicationMomentumTitle")}
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            {t("dashboard.applicationMomentumDescription")}
          </div>
        </div>

        <div className="rounded-full border border-cyan-300/10 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
          {t("dashboard.active", {
            count: activeApplications,
          })}
        </div>
      </div>

      <div className="relative mt-5 space-y-3">
        {applications.length === 0 && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-sm text-white/50">
            {t("dashboard.applicationsEmpty")}
          </div>
        )}

        {applications.map((application, index) => (
          <div
            key={`${application.company_name}-${application.job_title}-${index}`}
            className="group rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-cyan-300/15 hover:bg-white/[0.05]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white/90">
                  {application.company_name}
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  {application.job_title}
                </div>
              </div>

              <div
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getStatusColor(application.status)}`}
              >
                {application.status ||
                  t("dashboard.unknown")}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <div className="inline-flex items-center gap-1 text-muted-foreground">
                <Clock3 className="size-3.5" />
                {formatDate(
                  application.date_label,
                  language,
                  t,
                )}
              </div>

              <div className="inline-flex items-center gap-1 text-cyan-200">
                <Target className="size-3.5" />
                {t("dashboard.pipelineSignal")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

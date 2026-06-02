import {
  useEffect,
  useState,
} from "react";

import {
  Github,
  Loader2,
  SearchCode,
  FileText,
  Radar,
  ShieldCheck,
} from "lucide-react";

import { useI18n } from "@/i18n/I18nContext";


export function PortfolioScanLoader() {
  const [activeStep, setActiveStep] = useState(0);

  const { t } = useI18n();

  const scanSteps = [
    {
      label: t("portfolio.scanRepositories"),
      icon: Github,
    },
    {
      label: t("portfolio.readingReadmes"),
      icon: FileText,
    },
    {
      label: t("portfolio.evaluatingRecruiterSignal"),
      icon: Radar,
    },
    {
      label: t("portfolio.analyzingArchitectureDepth"),
      icon: SearchCode,
    },
    {
      label: t("portfolio.buildingPortfolioReview"),
      icon: ShieldCheck,
    },
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((current) =>
        current === scanSteps.length - 1
          ? 0
          : current + 1,
      );
    }, 1300);

    return () => window.clearInterval(interval);
  }, []);

  const ActiveIcon = scanSteps[activeStep].icon;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-4">
        <div className="grid size-12 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-[0_12px_40px_rgba(168,85,247,0.35)]">
          <ActiveIcon className="size-5" />
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Loader2 className="size-4 animate-spin text-cyan-300" />
            {t("portfolio.portfolioScanRunning")}
          </div>

          <div className="mt-1 text-sm text-white/55">
            {scanSteps[activeStep].label}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {scanSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStep;
          const isDone = index < activeStep;

          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                isActive
                  ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-100"
                  : isDone
                    ? "border-emerald-400/10 bg-emerald-400/[0.04] text-emerald-100/70"
                    : "border-white/5 bg-white/[0.02] text-white/40"
              }`}
            >
              <Icon className="size-4" />

              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

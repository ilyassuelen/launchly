import { Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

interface Props {
  summary: string;

  updateSummary: (
    value: string,
  ) => void;
}

export function SummaryEditor({
  summary,
  updateSummary,
}: Props) {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Sparkles className="size-3.5" />
        {t("resume.summary")}
      </div>

      <textarea
        value={summary}
        onChange={(e) =>
          updateSummary(e.target.value)
        }
        rows={8}
        className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-violet-400/40"
      />
    </div>
  );
}
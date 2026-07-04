import { useState } from "react";
import { Upload } from "lucide-react";

import type { Resume } from "@/features/resume/types/resume";
import { useI18n } from "@/i18n/I18nContext";

import { importResumeFile } from "@/features/resume/api/importResumeFile";
import { mergeImportedResume } from "@/features/resume/utils/mergeImportedResume";

interface Props {
  resume: Resume;
  setResume: React.Dispatch<React.SetStateAction<any>>;
}

export function ResumeImportUploader({ resume, setResume }: Props) {
  const { t } = useI18n();

  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasExistingContent =
    Boolean(resume.basics?.fullName?.trim()) ||
    (resume.experience || []).length > 0;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    e.target.value = "";

    if (!file) {
      return;
    }

    if (
      hasExistingContent &&
      !window.confirm(t("resume.importConfirmOverwrite"))
    ) {
      return;
    }

    setError(null);
    setIsImporting(true);

    try {
      const extracted = await importResumeFile(file);

      setResume((prev: Resume) => mergeImportedResume(prev, extracted));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("resume.importFailed"));
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {t("resume.importResume")}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="text-xs text-muted-foreground">
          {t("resume.importResumeDescription")}
        </div>

        <label
          className={`inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:bg-white/[0.08] ${
            isImporting ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <Upload className="size-4" />

          {isImporting
            ? t("resume.importInProgress")
            : t("resume.importResumeAction")}

          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            disabled={isImporting}
            onChange={handleFileChange}
          />
        </label>

        {error && <div className="text-xs text-red-400">{error}</div>}
      </div>
    </div>
  );
}

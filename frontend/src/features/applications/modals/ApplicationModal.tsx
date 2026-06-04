import {
  Calendar,
  Trash2,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";

import type {
  ApplicationItem,
} from "@/features/applications/types/application";
import { useI18n } from "@/i18n/I18nContext";
import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";

type ApplicationDraft = {
  company_name: string;
  job_title: string;
  applied_date: string;
  notes: string;
};

type ApplicationModalProps = {
  open: boolean;

  mode: "create" | "edit";

  draft: ApplicationDraft;

  application?: ApplicationItem | null;

  isSaving?: boolean;

  onChange: (
    field: keyof ApplicationDraft,
    value: string,
  ) => void;

  onClose: () => void;

  onSave: () => void;

  onDelete?: () => void;
};

export function ApplicationModal({
  open,
  mode,
  draft,
  isSaving = false,
  onChange,
  onClose,
  onSave,
  onDelete,
}: ApplicationModalProps) {
  const { t } = useI18n();

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[rgb(13,17,29)] shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-6 border-b border-white/10 px-7 py-6">
          <div>
            <div className="text-2xl font-semibold tracking-tight text-white">
              {mode === "create"
                ? t("applications.addApplication")
                : t("applications.editApplication")}
            </div>

            <div className="mt-2 text-sm leading-6 text-white/45">
              {t("applications.modalDescription")}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/50 transition hover:bg-white/[0.06] hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-7 py-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80" htmlFor="company_name">
                {t("applications.company")}
              </label>
              <ResumeInput
                id="company_name"
                value={draft.company_name}
                onChange={(event) =>
                  onChange(
                    "company_name",
                    event.target.value,
                  )
                }
                placeholder={t("applications.companyPlaceholder")}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80" htmlFor="job_title">
                {t("applications.jobTitle")}
              </label>
              <ResumeInput
                id="job_title"
                value={draft.job_title}
                onChange={(event) =>
                  onChange(
                    "job_title",
                    event.target.value,
                  )
                }
                placeholder={t("applications.jobTitlePlaceholder")}
              />
            </div>
          </div>

          <div className="mt-5">
            <DateField
              label={t("applications.appliedDate")}
              value={draft.applied_date}
              onChange={(value) =>
                onChange(
                  "applied_date",
                  value,
                )
              }
            />
          </div>

          {mode === "edit" && (
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-white/80" htmlFor="notes">
                {t("applications.notes")}
              </label>

              <textarea
                id="notes"
                value={draft.notes}
                onChange={(event) =>
                  onChange(
                    "notes",
                    event.target.value,
                  )
                }
                rows={4}
                placeholder={t("applications.notesPlaceholder")}
                className="w-full resize-none rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/30"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-7 py-5">
          <div>
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={isSaving}
                className="rounded-xl border border-red-400/20 bg-red-400/[0.08] px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-400/[0.14] disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                {t("common.delete")}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:bg-white/[0.04] hover:text-white"
            >
              {t("common.cancel")}
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                onSave();
              }}
              disabled={
                isSaving ||
                !draft.company_name.trim() ||
                !draft.job_title.trim() ||
                !draft.applied_date
              }
              className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.10] px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.16] disabled:opacity-50"
            >
              {isSaving
                ? t("common.saving")
                : mode === "create"
                  ? t("applications.addApplication")
                  : t("common.saveChanges")}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function DateField({
  label,
  value,
  onChange,
}: DateFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/80">
        {label}
      </label>

      <input
        type="date"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/30"
      />
    </div>
  );
}

import {
  Briefcase,
  Calendar,
  Save,
  Trash2,
  X,
} from "lucide-react";

import type {
  ApplicationItem,
} from "@/features/applications/types/application";

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
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/70 backdrop-blur-md">
      <div className="relative mx-auto mb-8 mt-8 w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#0b1020] shadow-[0_30px_100px_rgba(0,0,0,0.65)]">
        <div className="border-b border-white/5 px-8 py-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-2xl font-bold text-white">
                {mode === "create"
                  ? "Add application"
                  : "Edit application"}
              </div>

              <div className="mt-2 text-sm leading-7 text-white/50">
                Add the basics. New applications start in Applied and can be moved later.
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.08]"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6 px-8 py-7">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                Company
              </div>

              <input
                value={draft.company_name}
                onChange={(event) =>
                  onChange(
                    "company_name",
                    event.target.value,
                  )
                }
                placeholder="e.g. Vercel"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-3.5 text-base text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/40"
              />
            </div>

            <div>
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                Job title
              </div>

              <input
                value={draft.job_title}
                onChange={(event) =>
                  onChange(
                    "job_title",
                    event.target.value,
                  )
                }
                placeholder="e.g. Junior AI Engineer"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-3.5 text-base text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/40"
              />
            </div>
          </div>

          <DateField
            label="Applied date"
            value={draft.applied_date}
            onChange={(value) =>
              onChange(
                "applied_date",
                value,
              )
            }
          />

          {mode === "edit" && (
            <div>
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                Notes
              </div>

              <textarea
                value={draft.notes}
                onChange={(event) =>
                  onChange(
                    "notes",
                    event.target.value,
                  )
                }
                rows={4}
                placeholder="Optional notes, recruiter details or next steps..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-5 py-3.5 text-sm leading-7 text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/40"
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 px-8 py-4">
          <div>
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-2xl border border-red-400/15 bg-red-400/[0.06] px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/[0.10] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/70 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
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
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-brand px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(168,85,247,0.35)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mode === "create" ? (
                <Briefcase className="size-4" />
              ) : (
                <Save className="size-4" />
              )}

              {isSaving
                ? "Saving..."
                : mode === "create"
                  ? "Add application"
                  : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
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
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
        <Calendar className="size-3.5" />
        {label}
      </div>

      <input
        type="date"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-3.5 text-sm text-white outline-none transition focus:border-violet-400/40"
      />
    </div>
  );
}

import type {
  ReactNode,
} from "react";

import {
  X,
} from "lucide-react";

type ResumeEditModalProps = {
  open: boolean;

  title: string;

  subtitle?: string;

  children: ReactNode;

  onClose: () => void;

  onSave?: () => void;

  saveLabel?: string;

  isSaving?: boolean;

  footer?: ReactNode;

  size?: "md" | "lg" | "xl";

  disableBackdropClose?: boolean;
};

const sizeClasses = {
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

export function ResumeEditModal({
  open,
  title,
  subtitle,
  children,
  onClose,
  onSave,
  saveLabel = "Save changes",
  isSaving = false,
  footer,
  size = "lg",
  disableBackdropClose = false,
}: ResumeEditModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center overflow-y-auto p-4 pt-10 sm:p-6 sm:pt-16">

      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close modal"
        onClick={() => {
          if (!disableBackdropClose) {
            onClose();
          }
        }}
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
      />

      {/* MODAL */}

      <div
        className={[
          "relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-[32px] border border-white/10",
          "bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_38%),linear-gradient(to_bottom,#060816,#0b1020)] shadow-[0_30px_120px_rgba(0,0,0,0.55)]",
          "backdrop-blur-2xl",
          sizeClasses[size],
        ].join(" ")}
      >

        {/* HEADER */}

        <div className="flex items-start justify-between gap-6 border-b border-white/6 px-6 py-5 sm:px-8">

          <div className="min-w-0">
            <h2 className="text-[22px] font-semibold tracking-tight text-white sm:text-[26px]">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-white/55 transition hover:border-white/14 hover:bg-white/[0.06] hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* CONTENT */}

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          <div className="space-y-8">
            {children}
          </div>
        </div>

        {/* FOOTER */}

        <div className="border-t border-white/6 bg-black/20 px-6 py-5 sm:px-8">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              {footer}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white"
              >
                Cancel
              </button>

              {onSave && (
                <button
                  type="button"
                  onClick={onSave}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving
                    ? "Saving..."
                    : saveLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
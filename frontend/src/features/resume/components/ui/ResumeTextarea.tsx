import type {
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

type ResumeTextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    description?: string;
    error?: string;
  };

export function ResumeTextarea({
  label,
  description,
  error,
  className,
  rows = 5,
  ...props
}: ResumeTextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between gap-3">
          <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            {label}
          </label>

          {error && (
            <span className="text-[10px] font-medium text-red-300">
              {error}
            </span>
          )}
        </div>
      )}

      <textarea
        {...props}
        rows={rows}
        className={cn(
          "w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition",
          "placeholder:text-white/25",
          "focus:border-cyan-400/40 focus:bg-black/40",
          "hover:border-white/15",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      />

      {description && (
        <p className="text-xs leading-5 text-white/40">
          {description}
        </p>
      )}
    </div>
  );
}
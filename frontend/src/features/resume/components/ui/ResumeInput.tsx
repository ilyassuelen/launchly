import type {
  InputHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

type ResumeInputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    description?: string;
    error?: string;
  };

export function ResumeInput({
  label,
  description,
  error,
  className,
  ...props
}: ResumeInputProps) {
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

      <input
        {...props}
        className={cn(
          "w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition",
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

import type {
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type ResumeFieldGroupProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function ResumeFieldGroup({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: ResumeFieldGroupProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/8 bg-black/20 p-5",
        "backdrop-blur-sm transition",
        "hover:border-white/12",
        className,
      )}
    >
      {(title || description || actions) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {title && (
              <div className="text-sm font-semibold text-white">
                {title}
              </div>
            )}

            {description && (
              <p className="mt-1 text-xs leading-5 text-white/45">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex shrink-0 items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "space-y-4",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
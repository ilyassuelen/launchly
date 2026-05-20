import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost";

type ResumeActionButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: ReactNode;
    variant?: Variant;
    fullWidth?: boolean;
  };

const variantStyles: Record<
  Variant,
  string
> = {
  primary:
    "border-cyan-400/20 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20",

  secondary:
    "border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]",

  danger:
    "border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/20",

  ghost:
    "border-transparent bg-transparent text-white/60 hover:bg-white/[0.05] hover:text-white",
};

export function ResumeActionButton({
  icon,
  children,
  className,
  variant = "secondary",
  fullWidth = false,
  ...props
}: ResumeActionButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "active:scale-[0.99]",
        fullWidth && "w-full",
        variantStyles[variant],
        className,
      )}
    >
      {icon}

      {children}
    </button>
  );
}
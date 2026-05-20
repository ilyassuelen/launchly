import type {
  LucideIcon,
} from "lucide-react";

import {
  ChevronRight,
  GripVertical,
  Trash2,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

type ResumeListItemProps = {
  title: string;

  subtitle?: string;

  description?: string;

  icon?: LucideIcon;

  meta?: ReactNode;

  selected?: boolean;

  onClick?: () => void;

  onDelete?: () => void;

  draggable?: boolean;

  onDragStart?: () => void;

  onDragEnd?: () => void;

  onDragOver?: (
    e: React.DragEvent<HTMLDivElement>,
  ) => void;

  onDrop?: () => void;

  className?: string;
};

export function ResumeListItem({
  title,
  subtitle,
  description,
  icon: Icon,
  meta,
  selected = false,
  onClick,
  onDelete,
  draggable = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  className = "",
}: ResumeListItemProps) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      className={[
        "group relative overflow-hidden rounded-2xl border transition-all duration-200",
        "cursor-pointer",
        selected
          ? "border-cyan-400/30 bg-cyan-400/[0.08]"
          : "border-white/6 bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.045]",
        className,
      ].join(" ")}
    >
      <div className="flex items-start gap-3 px-4 py-4">

        {/* DRAG HANDLE */}

        <div className="mt-1 flex size-8 shrink-0 cursor-grab items-center justify-center rounded-xl border border-white/6 bg-black/20 text-white/35 transition group-hover:border-white/10 group-hover:text-white/60 active:cursor-grabbing">
          <GripVertical className="size-4" />
        </div>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0 flex-1">

              <div className="flex items-center gap-2">
                {Icon && (
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/[0.03] text-cyan-300">
                    <Icon className="size-3.5" />
                  </div>
                )}

                <h4 className="truncate text-sm font-semibold tracking-tight text-white">
                  {title}
                </h4>
              </div>

              {subtitle && (
                <div className="mt-1 truncate text-xs text-cyan-200/75">
                  {subtitle}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">

              {meta && (
                <div className="hidden sm:flex">
                  {meta}
                </div>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="flex size-8 items-center justify-center rounded-xl border border-red-400/10 bg-red-500/[0.06] text-red-300 opacity-0 transition hover:bg-red-500/[0.12] group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}

              <div className="flex size-8 items-center justify-center rounded-xl border border-white/6 bg-black/20 text-white/35 transition group-hover:border-white/10 group-hover:text-white/60">
                <ChevronRight className="size-4" />
              </div>
            </div>
          </div>

          {description && (
            <p className="mt-3 line-clamp-2 text-xs leading-6 text-white/45">
              {description}
            </p>
          )}
        </div>
      </div>

      {selected && (
        <div className="absolute inset-y-0 left-0 w-[3px] bg-cyan-300" />
      )}
    </div>
  );
}
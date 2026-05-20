import type {
  LucideIcon,
} from "lucide-react";

import {
  ChevronDown,
  GripVertical,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

type ResumeEditorSectionProps = {
  title: string;

  icon: LucideIcon;

  count?: number;

  isCollapsed?: boolean;

  onToggleCollapse?: () => void;

  children: ReactNode;

  action?: ReactNode;

  className?: string;

  contentClassName?: string;

  draggable?: boolean;

  onDragStart?: () => void;

  onDragEnd?: () => void;

  onDragOver?: (
    e: React.DragEvent<HTMLDivElement>,
  ) => void;

  onDrop?: () => void;
};

export function ResumeEditorSection({
  title,
  icon: Icon,
  count,
  isCollapsed = false,
  onToggleCollapse,
  children,
  action,
  className = "",
  contentClassName = "",
  draggable = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: ResumeEditorSectionProps) {
  return (
    <section
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={[
        "group rounded-[28px] border border-white/8 bg-[#11131a]/90",
        "shadow-[0_10px_40px_rgba(0,0,0,0.24)]",
        "backdrop-blur-xl transition-all duration-200",
        "hover:border-white/12",
        className,
      ].join(" ")}
    >

      {!isCollapsed && (
        <div
          className={[
            "space-y-4 px-5 py-5",
            contentClassName,
          ].join(" ")}
        >
          {children}
        </div>
      )}
    </section>
  );
}
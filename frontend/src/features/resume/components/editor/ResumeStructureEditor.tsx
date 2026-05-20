import { GripVertical } from "lucide-react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

type SidebarSectionId = string;
type MainSectionId = string;

type SidebarSection = {
  id: SidebarSectionId;
  name: string;
  icon: any;
};

type MainSection = {
  id: MainSectionId;
  name: string;
  icon: any;
};

type ResumeStructureEditorProps = {
  activeSection: string;
  setActiveSection: (value: string) => void;

  sidebarSections: SidebarSection[];
  mainSections: MainSection[];

  resume: {
    sidebarSectionOrder?: SidebarSectionId[];
    mainSectionOrder?: MainSectionId[];
  };

  updateSidebarOrder: (
    value: SidebarSectionId[],
  ) => void;

  updateMainOrder: (
    value: MainSectionId[],
  ) => void;

  renderSidebarSectionContent: (
    sectionId: SidebarSectionId,
  ) => React.ReactNode;

  renderMainSectionContent: (
    sectionId: MainSectionId,
  ) => React.ReactNode;
};

type SortableSectionItemProps = {
  id: string;

  name: string;

  icon: any;

  isActive: boolean;

  onToggle: () => void;

  children?: React.ReactNode;
};

function SortableSectionItem({
  id,
  name,
  icon: Icon,
  isActive,
  onToggle,
  children,
}: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`overflow-hidden rounded-2xl transition-all duration-200 ${
        isDragging
          ? "scale-[1.02] opacity-80 shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
          : ""
      }`}
    >
      <button
        onClick={onToggle}
        className={`group flex w-full items-center justify-between rounded-2xl border px-3 py-3 transition ${
          isActive
            ? "border-violet-400/30 bg-violet-500/10"
            : "border-white/5 bg-white/[0.03] hover:bg-white/[0.05]"
        }`}
      >
        <span className="flex items-center gap-3 text-sm text-white/80">
          <span
            {...attributes}
            {...listeners}
            className="flex cursor-grab items-center active:cursor-grabbing"
          >
            <GripVertical className="size-4 text-muted-foreground" />
          </span>

          <Icon className="size-4 text-cyan-300" />

          {name}
        </span>

        <span className="text-[10px] text-muted-foreground">
          drag
        </span>
      </button>

      {isActive && children}
    </li>
  );
}

export function ResumeStructureEditor({
  activeSection,
  setActiveSection,

  sidebarSections,
  mainSections,

  resume,

  updateSidebarOrder,
  updateMainOrder,

  renderSidebarSectionContent,
  renderMainSectionContent,
}: ResumeStructureEditorProps) {
  const sidebarSectionOrder =
    resume.sidebarSectionOrder || [];

  const mainSectionOrder =
    resume.mainSectionOrder || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const handleSidebarDragEnd = (
    event: DragEndEvent,
  ) => {
    const {
      active,
      over,
    } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex =
      sidebarSectionOrder.indexOf(
        active.id as SidebarSectionId,
      );

    const newIndex =
      sidebarSectionOrder.indexOf(
        over.id as SidebarSectionId,
      );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    updateSidebarOrder(
      arrayMove(
        sidebarSectionOrder,
        oldIndex,
        newIndex,
      ),
    );
  };

  const handleMainDragEnd = (
    event: DragEndEvent,
  ) => {
    const {
      active,
      over,
    } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex =
      mainSectionOrder.indexOf(
        active.id as MainSectionId,
      );

    const newIndex =
      mainSectionOrder.indexOf(
        over.id as MainSectionId,
      );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    updateMainOrder(
      arrayMove(
        mainSectionOrder,
        oldIndex,
        newIndex,
      ),
    );
  };

  return (
    <div>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Resume structure
      </div>

      <ul className="space-y-2">

        {/* SIDEBAR */}

        <div className="mb-2 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Sidebar sections
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSidebarDragEnd}
        >
          <SortableContext
            items={sidebarSectionOrder}
            strategy={verticalListSortingStrategy}
          >
            {sidebarSections.map((section) => {
              const isActive =
                activeSection === section.id;

              return (
                <SortableSectionItem
                  key={section.id}
                  id={section.id}
                  name={section.name}
                  icon={section.icon}
                  isActive={isActive}
                  onToggle={() =>
                    setActiveSection(
                      activeSection ===
                        section.id
                        ? ""
                        : section.id,
                    )
                  }
                >
                  {renderSidebarSectionContent(
                    section.id,
                  )}
                </SortableSectionItem>
              );
            })}
          </SortableContext>
        </DndContext>

        {/* MAIN */}

        <div className="mb-2 mt-4 rounded-2xl border border-violet-400/10 bg-violet-500/[0.05] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200">
          Main content PDF sections
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleMainDragEnd}
        >
          <SortableContext
            items={mainSectionOrder}
            strategy={verticalListSortingStrategy}
          >
            {mainSections.map((section) => {
              const isActive =
                activeSection === section.id;

              return (
                <SortableSectionItem
                  key={section.id}
                  id={section.id}
                  name={section.name}
                  icon={section.icon}
                  isActive={isActive}
                  onToggle={() =>
                    setActiveSection(
                      activeSection ===
                        section.id
                        ? ""
                        : section.id,
                    )
                  }
                >
                  {renderMainSectionContent(
                    section.id,
                  )}
                </SortableSectionItem>
              );
            })}
          </SortableContext>
        </DndContext>
      </ul>
    </div>
  );
}
import { Sparkles } from "lucide-react";

import { Card } from "@/components/launchly/AppShell";

import { PersonalInfoEditor } from "@/features/resume/components/editor/PersonalInfoEditor";
import { SummaryEditor } from "@/features/resume/components/editor/SummaryEditor";
import { ResumeStructureEditor } from "@/features/resume/components/editor/ResumeStructureEditor";

import type {
  SidebarSectionId,
  MainSectionId,
} from "@/features/resume/types/sections";

type Props = {
  resume: any;
  setResume: any;

  activeSection: string;

  setActiveSection: (
    value: string,
  ) => void;

  updateBasics: (
    field: any,
    value: string,
  ) => void;

  summary: string;

  updateSummary: (
    value: string,
  ) => void;

  sidebarSections: any[];
  mainSections: any[];

  updateSidebarOrder: (
    order: SidebarSectionId[],
  ) => void;

  updateMainOrder: (
    order: MainSectionId[],
  ) => void;

  renderSidebarSectionContent: (
    sectionId: SidebarSectionId,
  ) => React.ReactNode;

  renderMainSectionContent: (
    sectionId: MainSectionId,
  ) => React.ReactNode;
};

export function ResumeLeftPanel({
  resume,
  setResume,

  activeSection,
  setActiveSection,

  updateBasics,

  summary,
  updateSummary,

  sidebarSections,
  mainSections,

  updateSidebarOrder,
  updateMainOrder,

  renderSidebarSectionContent,
  renderMainSectionContent,
}: Props) {
  return (
    <Card className="overflow-hidden lg:col-span-3">

      <div className="flex items-center justify-between border-b border-white/5 pb-4">

        <div>
          <div className="text-sm font-semibold">
            Resume editor
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            Drag, edit and optimize sections
          </div>
        </div>

      </div>

      <div className="mt-5 space-y-5">

        <PersonalInfoEditor
          resume={resume}
          setResume={setResume}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          updateBasics={updateBasics}
        />

        <SummaryEditor
          summary={summary}
          updateSummary={updateSummary}
        />

        <ResumeStructureEditor
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarSections={sidebarSections}
          mainSections={mainSections}
          resume={resume}
          updateSidebarOrder={updateSidebarOrder}
          updateMainOrder={updateMainOrder}
          renderSidebarSectionContent={
            renderSidebarSectionContent
          }
          renderMainSectionContent={
            renderMainSectionContent
          }
        />

        <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-violet-500/10 to-cyan-400/5 p-4">

          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-cyan-300" />
            Recruiter analysis
          </div>

          <div className="mt-4 space-y-3 text-xs text-white/70">

            <div className="rounded-xl bg-black/20 p-3">
              Your resume structure looks modern and recruiter-friendly.
            </div>

            <div className="rounded-xl bg-black/20 p-3">
              Strongest section: Projects & AI Engineering experience.
            </div>

            <div className="rounded-xl bg-black/20 p-3">
              Add more measurable business impact to improve recruiter trust.
            </div>

          </div>
        </div>
      </div>
    </Card>
  );
}
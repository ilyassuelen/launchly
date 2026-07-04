import { Card } from "@/components/launchly/AppShell";
import { useI18n } from "@/i18n/I18nContext";

import { ResumeImportUploader } from "@/features/resume/components/editor/ResumeImportUploader";
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
  const { t } = useI18n();
  return (
    <Card className="overflow-hidden lg:col-span-3">

      <div className="flex items-center justify-between border-b border-white/5 pb-4">

        <div>
          <div className="text-sm font-semibold">
            {t("resume.resumeEditor")}
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            {t("resume.resumeEditorDescription")}
          </div>
        </div>

      </div>

      <div className="mt-5 space-y-5">

        <ResumeImportUploader
          resume={resume}
          setResume={setResume}
        />

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


      </div>
    </Card>
  );
}
import {
  FolderKanban,
  Plus,
} from "lucide-react";

import { ResumeEditorSection } from "@/features/resume/components/ui/ResumeEditorSection";
import { ResumeListItem } from "@/features/resume/components/ui/ResumeListItem";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";

type ProjectItem = {
  id: string;
  title: string;
  stack: string;
  bullets?: string[];
};

type ProjectsSectionProps = {
  projects: ProjectItem[];

  updateProjectBullet: (
    projectId: string,
    bulletIndex: number,
    value: string,
  ) => void;

  updateProjectField: (
    projectId: string,
    field: "title" | "stack",
    value: string,
  ) => void;

  addProject: () => void;

  deleteProject: (
    projectId: string,
  ) => void;

  openProjectModal?: (
    projectId: string,
  ) => void;
};

export function ProjectsSection({
  projects,
  addProject,
  deleteProject,
  openProjectModal,
}: ProjectsSectionProps) {
  return (
    <>
      <ResumeEditorSection
        title="Projects"
        icon={FolderKanban}
        count={projects.length}
        accent="cyan"
      >
        <div className="space-y-2">
          {projects.map((project) => (
            <ResumeListItem
              key={project.id}
              title={project.title || "Untitled Project"}
              subtitle={
                project.stack ||
                "No tech stack added"
              }
              description={
                project.bullets?.[0] ||
                "No project description added"
              }
              accent="cyan"
              onClick={() =>
                openProjectModal?.(project.id)
              }
              onDelete={() =>
                deleteProject(project.id)
              }
            />
          ))}
        </div>
        <ResumeActionButton
            fullWidth
            icon={<Plus className="size-4" />}
            onClick={addProject}
        >
            Add project
        </ResumeActionButton>
      </ResumeEditorSection>
    </>
  );
}
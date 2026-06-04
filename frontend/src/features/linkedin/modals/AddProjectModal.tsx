import {
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useI18n } from "@/i18n/I18nContext";
import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";

export type LinkedInProjectDraft = {
  id: string;
  title: string;
  description: string;
  skills: string[];
};

type AddProjectModalProps = {
  editingProject: LinkedInProjectDraft | null;
  setEditingProject: (project: LinkedInProjectDraft | null) => void;

  projectSkillInput: string;
  setProjectSkillInput: (value: string) => void;

  addProjectSkill: () => void;
  removeProjectSkill: (skill: string) => void;
  saveProjectEditor: () => void;
};

export function AddProjectModal({
  editingProject,
  setEditingProject,
  projectSkillInput,
  setProjectSkillInput,
  addProjectSkill,
  removeProjectSkill,
  saveProjectEditor,
}: AddProjectModalProps) {
  const { t } = useI18n();

  if (!editingProject) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[rgb(13,17,29)] shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between border-b border-white/10 px-7 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">{t("linkedin.editLinkedInProject")}</h2>
            <p className="mt-1 text-sm text-white/60">{t("linkedin.editLinkedInProjectDescription")}</p>
          </div>

          <button
            type="button"
            onClick={() => setEditingProject(null)}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/50 transition hover:bg-white/[0.06] hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-7 py-6">
          <label className="mb-2 block text-sm font-medium text-white/80" htmlFor="project-title">
            {t("linkedin.projectName")}
          </label>
          <ResumeInput
            id="project-title"
            value={editingProject.title}
            onChange={(event) =>
              setEditingProject({
                ...editingProject,
                title: event.target.value,
              })
            }
            placeholder={t("linkedin.projectNamePlaceholder")}
          />

          <label className="mb-2 mt-6 block text-sm font-medium text-white/80" htmlFor="project-description">
            {t("linkedin.projectDescription")}
          </label>
          <textarea
            id="project-description"
            value={editingProject.description}
            onChange={(event) =>
              setEditingProject({
                ...editingProject,
                description: event.target.value,
              })
            }
            rows={5}
            placeholder={t("linkedin.projectDescriptionPlaceholder")}
            className="w-full resize-none rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/30"
          />

          <label className="mb-2 mt-6 block text-sm font-medium text-white/80" htmlFor="skill-input">
            {t("resume.skills")}
          </label>
          <ResumeInput
            id="skill-input"
            value={projectSkillInput}
            onChange={(event) => setProjectSkillInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addProjectSkill();
              }
            }}
            placeholder={t("linkedin.skillInputPlaceholder")}
          />

          <div className="mt-2 text-xs leading-5 text-white/40">
            {t("linkedin.projectSkillsHelperText")}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {editingProject.skills.map((skill) => (
              <div
                key={skill}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-white/70"
              >
                {skill}

                <button
                  type="button"
                  onClick={() => removeProjectSkill(skill)}
                  className="text-white/40 transition hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-7 py-5">
          <button
            type="button"
            onClick={() => setEditingProject(null)}
            className="rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:bg-white/[0.04] hover:text-white"
          >
            {t("common.cancel")}
          </button>

          <button
            type="button"
            onClick={saveProjectEditor}
            className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.10] px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.16]"
          >
            {t("common.saveChanges")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
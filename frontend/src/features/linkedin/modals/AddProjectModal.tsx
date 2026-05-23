import {
  FolderKanban,
  X,
} from "lucide-react";

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
  if (!editingProject) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/70 backdrop-blur-md">
      <div className="relative mx-auto mb-8 mt-8 w-full max-w-3xl rounded-[28px] border border-white/10 bg-[#0b1020] shadow-[0_30px_100px_rgba(0,0,0,0.65)]">
        <div className="border-b border-white/5 px-8 py-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-2xl font-bold text-white">
                Edit LinkedIn project
              </div>

              <div className="mt-2 text-sm leading-7 text-white/50">
                Add project evidence recruiters can understand quickly.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.08]"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="space-y-7 px-8 py-7">
          <div>
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
              Project name
            </div>

            <input
              value={editingProject.title}
              onChange={(event) =>
                setEditingProject({
                  ...editingProject,
                  title: event.target.value,
                })
              }
              placeholder="Enter the project name"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-3.5 text-base text-white outline-none transition focus:border-violet-400/40"
            />
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
              Project description
            </div>

            <textarea
              value={editingProject.description}
              onChange={(event) =>
                setEditingProject({
                  ...editingProject,
                  description: event.target.value,
                })
              }
              rows={5}
              placeholder="Describe what the project does, what you built and why it matters."
              className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-5 py-3.5 text-sm leading-7 text-white outline-none transition focus:border-violet-400/40"
            />
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
              Skills
            </div>

            <input
              value={projectSkillInput}
              onChange={(event) =>
                setProjectSkillInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addProjectSkill();
                }
              }}
              placeholder="Type a skill and press Enter"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-3.5 text-sm text-white outline-none transition focus:border-violet-400/40"
            />

            <div className="mt-3 text-sm text-white/40">
              Add technologies, tools, methods or domain skills individually.
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {editingProject.skills.map((skill) => (
                <div
                  key={skill}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-sm font-medium text-cyan-100"
                >
                  {skill}

                  <button
                    type="button"
                    onClick={() => removeProjectSkill(skill)}
                    className="text-cyan-100/60 transition hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/5 px-8 py-4">
          <button
            type="button"
            onClick={() => setEditingProject(null)}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/70 transition hover:bg-white/[0.06]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={saveProjectEditor}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-brand px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(168,85,247,0.35)] transition hover:scale-[1.02]"
          >
            <FolderKanban className="size-4" />
            Save project
          </button>
        </div>
      </div>
    </div>
  );
}
type SkillEditorModalProps = {
  editingSkillId: string | null;

  skillDraftName: string;
  setSkillDraftName: (
    value: string,
  ) => void;

  skillKeywordInput: string;
  setSkillKeywordInput: (
    value: string,
  ) => void;

  skillDraftKeywords: string[];

  addSkillKeyword: () => void;

  removeSkillKeyword: (
    keyword: string,
  ) => void;

  saveSkillEditor: () => void;

  setEditingSkillId: (
    value: string | null,
  ) => void;
};

export function SkillEditorModal({
  editingSkillId,

  skillDraftName,
  setSkillDraftName,

  skillKeywordInput,
  setSkillKeywordInput,

  skillDraftKeywords,

  addSkillKeyword,

  removeSkillKeyword,

  saveSkillEditor,

  setEditingSkillId,
}: SkillEditorModalProps) {
  if (!editingSkillId) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/70 backdrop-blur-md">

      <div className="relative mx-auto mt-8 mb-8 w-full max-w-3xl rounded-[28px] border border-white/10 bg-[#0b1020] shadow-[0_30px_100px_rgba(0,0,0,0.65)]">

        <div className="border-b border-white/5 px-8 py-6">

          <div className="flex items-start justify-between gap-6">

            <div>
              <div className="text-2xl font-bold text-white">
                Edit technical skill
              </div>

              <div className="mt-2 text-sm leading-7 text-white/50">
                Create professional
                skill groups and
                organize
                recruiter-relevant
                keywords.
              </div>
            </div>

            <button
              onClick={() =>
                setEditingSkillId(
                  null,
                )
              }
              className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl text-white/70 transition hover:bg-white/[0.08]"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-8 py-7">

          <div>

            <div>
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                Skill category
              </div>

              <input
                value={
                  skillDraftName
                }
                onChange={(e) =>
                  setSkillDraftName(
                    e.target.value,
                  )
                }
                placeholder="e.g. Backend & APIs"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-3.5 text-base text-white outline-none transition focus:border-violet-400/40"
              />
            </div>

            <div className="mt-7">

              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                Keywords
              </div>

              <input
                value={
                  skillKeywordInput
                }
                onChange={(e) =>
                  setSkillKeywordInput(
                    e.target.value,
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    e.preventDefault();

                    addSkillKeyword();
                  }
                }}
                placeholder="Type a keyword and press Enter"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-3.5 text-sm text-white outline-none transition focus:border-violet-400/40"
              />

              <div className="mt-3 text-sm text-white/40">
                Add technologies,
                frameworks and tools
                individually.
              </div>

              <div className="mt-5 flex flex-wrap gap-3">

                {skillDraftKeywords.map(
                  (keyword) => (
                    <div
                      key={
                        keyword
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-sm font-medium text-cyan-100"
                    >
                      {keyword}

                      <button
                        onClick={() =>
                          removeSkillKeyword(
                            keyword,
                          )
                        }
                        className="text-cyan-100/60 transition hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/5 px-8 py-4">

          <button
            onClick={() =>
              setEditingSkillId(
                null,
              )
            }
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/70 transition hover:bg-white/[0.06]"
          >
            Cancel
          </button>

          <button
            onClick={
              saveSkillEditor
            }
            className="rounded-2xl bg-gradient-brand px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(168,85,247,0.35)] transition hover:scale-[1.02]"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

import type { Resume } from "@/features/resume/types/resume";

import { ResumePreview } from "@/components/resume/ResumePreview";

interface Props {
  resume: Resume;
}

export function ResumeThumbnail({
  resume,
}: Props) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-[#0f172a]">

      {/* Resume Preview */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1
          origin-top
          -translate-x-1/2
          scale-[0.28] transition-transform duration-500 group-hover:scale-[0.295]
        "
      >
        <div className="w-[794px] overflow-hidden rounded-xl bg-white shadow-2xl">
          <ResumePreview
            resume={resume}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      </div>

      {/* Soft Fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

    </div>
  );
}
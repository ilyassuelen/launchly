import { createFileRoute } from "@tanstack/react-router";

import { ResumePreview } from "@/components/resume/ResumePreview";

export const Route = createFileRoute(
  "/resume-export",
)({
  component: ResumeExportPage,
});

function ResumeExportPage() {

  const stored =
    localStorage.getItem(
      "launchly_pdf_resume",
    );

  if (!stored) {
    return null;
  }

  const resume =
    JSON.parse(stored);

  return (
    <div className="bg-neutral-200 min-h-screen p-10">

      <div
        id="resume-ready"
        className="flex justify-center"
      >
        <ResumePreview
          resume={resume}
        />
      </div>

    </div>
  );
}
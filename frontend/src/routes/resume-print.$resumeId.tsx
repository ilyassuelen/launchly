import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ResumePreview } from "@/components/resume/ResumePreview";
import type { Resume } from "@/features/resume/types/resume";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const Route = createFileRoute("/resume-print/$resumeId")({
  component: ResumePrintPage,
});

function ResumePrintPage() {
  const { resumeId } = Route.useParams();
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    async function loadResume() {
      const response = await fetch(`${API_BASE}/resumes/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not load resume");
      }

      const savedResume = await response.json();

      setResume({
        id: String(savedResume.id),
        title: savedResume.title,
        template: savedResume.template,
        ...savedResume.data,
      });
    }

    loadResume();
  }, [resumeId]);

  if (!resume) {
    return (
      <div className="min-h-screen bg-white text-black">
        Loading resume...
      </div>
    );
  }

  return (
    <div className="bg-white text-black">
      <div
        id="resume-print-root"
        style={{
          width: "794px",
          background: "white",
        }}
      >
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}

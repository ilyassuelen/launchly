import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { CoverLetterRenderer } from "@/components/cover-letter/CoverLetterRenderer";
import type { CoverLetter } from "@/features/cover-letter/types/coverLetter";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const Route =
  createFileRoute("/cover-letter-print/$coverLetterId")({
    component: CoverLetterPrintPage,
  });

function CoverLetterPrintPage() {
  const { coverLetterId } = Route.useParams();

  const [
    coverLetter,
    setCoverLetter,
  ] = useState<CoverLetter | null>(null);

  useEffect(() => {
    const params =
      new URLSearchParams(window.location.search);

    const token = params.get("token");

    async function loadCoverLetter() {
      const response = await fetch(
        `${API_BASE}/cover-letters/${coverLetterId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Could not load cover letter");
      }

      const savedCoverLetter = await response.json();

      setCoverLetter({
        id: String(savedCoverLetter.id),
        title: savedCoverLetter.title,
        template: savedCoverLetter.template,
        ...savedCoverLetter.data,
      });
    }

    loadCoverLetter();
  }, [coverLetterId]);

  if (!coverLetter) {
    return (
      <div className="min-h-screen bg-white text-black">
        Loading cover letter...
      </div>
    );
  }

  return (
    <div className="bg-white text-black">
      <div
        id="cover-letter-print-root"
        style={{
          width: "794px",
          background: "white",
        }}
      >
        <CoverLetterRenderer
          coverLetter={coverLetter}
        />
      </div>
    </div>
  );
}

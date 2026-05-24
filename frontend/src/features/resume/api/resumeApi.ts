import { apiFetch } from "@/lib/api";

import type {
  ResumeAnalysis,
} from "@/features/resume/types/resumeAnalysis";

export async function getResumes() {
  return apiFetch("/resumes");
}

export async function getResume(
  resumeId: number | string,
) {
  return apiFetch(
    `/resumes/${resumeId}`,
  );
}

export async function createResume(
  payload: any,
) {
  return apiFetch("/resumes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateResume(
  resumeId: number | string,
  payload: any,
) {
  return apiFetch(
    `/resumes/${resumeId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteResume(
  resumeId: number | string,
) {
  return apiFetch(
    `/resumes/${resumeId}`,
    {
      method: "DELETE",
    },
  );
}

export async function duplicateResume(
  resumeId: number | string,
) {
  return apiFetch(
    `/resumes/${resumeId}/duplicate`,
    {
      method: "POST",
    },
  );
}

export async function analyzeResume(
  payload: {
    language: string;
    tone: string;
    resume_content: string;
    target_role?: string;
    resume_id?: number | string;
  },
): Promise<ResumeAnalysis> {
  return apiFetch(
    "/ai/resume-analysis/analyze",
    {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        resume_id:
          payload.resume_id !== undefined
            ? Number(payload.resume_id)
            : undefined,
      }),
    },
  );
}
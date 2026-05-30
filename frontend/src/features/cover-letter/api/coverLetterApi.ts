import { apiFetch } from "@/lib/api";

export async function getCoverLetters() {
  return apiFetch("/cover-letters");
}

export async function getCoverLetter(
  coverLetterId: number | string,
) {
  return apiFetch(
    `/cover-letters/${coverLetterId}`,
  );
}

export async function createCoverLetter(
  payload: any,
) {
  return apiFetch("/cover-letters", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCoverLetter(
  coverLetterId: number | string,
  payload: any,
) {
  return apiFetch(
    `/cover-letters/${coverLetterId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteCoverLetter(
  coverLetterId: number | string,
) {
  return apiFetch(
    `/cover-letters/${coverLetterId}`,
    {
      method: "DELETE",
    },
  );
}

export async function duplicateCoverLetter(
  coverLetterId: number | string,
) {
  return apiFetch(
    `/cover-letters/${coverLetterId}/duplicate`,
    {
      method: "POST",
    },
  );
}

export async function generateAICoverLetter(
  payload: {
    language: string;
    tone: string;
    sender_name: string;
    current_role: string;
    skills: string[];
    resume_context: string;
    structured_resume_data?: Record<string, any> | null;
    job_posting: string;
    hiring_contact?: string;
  },
) {
  return apiFetch(
    "/ai/cover-letter/generate",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function analyzeCoverLetter(
  payload: {
    tone: string;
    language: string;
    job_posting: string;
    subject: string;
    body: string;
  },
) {
  return apiFetch(
    "/ai/cover-letter-analysis/analyze",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
import { apiFetch } from "@/lib/api";

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
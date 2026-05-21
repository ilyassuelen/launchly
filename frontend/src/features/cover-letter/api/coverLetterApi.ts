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
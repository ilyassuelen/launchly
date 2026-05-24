import type {
  RecruiterViewRequest,
  RecruiterViewResponse,
  SavedRecruiterViewResponse,
} from "@/features/recruiter/types/recruiterView";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

function getAuthHeaders() {
  const token =
    localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

export async function analyzeRecruiterView(
  payload: RecruiterViewRequest,
): Promise<RecruiterViewResponse> {
  const response = await fetch(
    `${API_BASE}/recruiter/analyze`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...payload,
        resume_id:
          payload.resume_id !== undefined
            ? Number(payload.resume_id)
            : undefined,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to analyze recruiter view",
    );
  }

  return response.json();
}

export async function getSavedRecruiterViewAnalysis(
  resumeId: number | string,
): Promise<SavedRecruiterViewResponse | null> {
  const response = await fetch(
    `${API_BASE}/recruiter/resumes/${resumeId}/analysis`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      "Failed to load saved recruiter analysis",
    );
  }

  return response.json();
}

import type {
  RecruiterViewRequest,
  RecruiterViewResponse,
} from "@/features/recruiter/types/recruiterView";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";


export async function analyzeRecruiterView(
  payload: RecruiterViewRequest,
): Promise<RecruiterViewResponse> {

  const response = await fetch(
    `${API_BASE}/recruiter/analyze`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to analyze recruiter view",
    );
  }

  return response.json();
}

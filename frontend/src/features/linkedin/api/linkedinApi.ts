import type {
  LinkedInAnalyzerRequest,
  LinkedInAnalyzerResponse,
} from "@/features/linkedin/types/linkedinAnalyzer";

import type {
  LinkedInProfileData,
} from "@/features/linkedin/types/linkedinAnalyzer";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

export async function analyzeLinkedInProfile(
  payload: LinkedInAnalyzerRequest,
): Promise<LinkedInAnalyzerResponse> {
  const response = await fetch(
    `${API_BASE}/linkedin/analyze`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to analyze LinkedIn profile",
    );
  }

  return response.json();
}

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
  };
}

export async function getLinkedInProfile(): Promise<LinkedInProfileData | null> {
  const response = await fetch(
    `${API_BASE}/linkedin/profile`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load LinkedIn profile");
  }

  return response.json();
}

export async function saveLinkedInProfile(
  payload: LinkedInProfileData,
): Promise<LinkedInProfileData> {
  const response = await fetch(
    `${API_BASE}/linkedin/profile`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to save LinkedIn profile");
  }

  return response.json();
}
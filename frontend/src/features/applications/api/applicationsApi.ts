import type {
  ApplicationCreatePayload,
  ApplicationItem,
  ApplicationListResponse,
  ApplicationUpdatePayload,
} from "@/features/applications/types/application";

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

export async function fetchApplications(): Promise<ApplicationListResponse> {
  const response = await fetch(
    `${API_BASE}/applications`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load applications",
    );
  }

  return response.json();
}

export async function createApplication(
  payload: ApplicationCreatePayload,
): Promise<ApplicationItem> {
  const response = await fetch(
    `${API_BASE}/applications`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create application",
    );
  }

  return response.json();
}

export async function updateApplication(
  applicationId: number,
  payload: ApplicationUpdatePayload,
): Promise<ApplicationItem> {
  const response = await fetch(
    `${API_BASE}/applications/${applicationId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update application",
    );
  }

  return response.json();
}

export async function deleteApplication(
  applicationId: number,
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/applications/${applicationId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete application",
    );
  }
}

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

async function handleResponse<T>(
  response: Response,
  defaultMessage: string,
): Promise<T> {
  if (!response.ok) {
    let message = defaultMessage;

    try {
      const errorData = await response.json();

      message =
        errorData?.detail ||
        errorData?.message ||
        defaultMessage;
    } catch {
      // Ignore parsing errors and keep fallback message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function fetchApplications(): Promise<ApplicationListResponse> {
  const response = await fetch(
    `${API_BASE}/applications`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  return handleResponse<ApplicationListResponse>(
    response,
    "Failed to load applications",
  );
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

  return handleResponse<ApplicationItem>(
    response,
    "Failed to create application",
  );
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

  return handleResponse<ApplicationItem>(
    response,
    "Failed to update application",
  );
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

  await handleResponse<void>(
    response,
    "Failed to delete application",
  );
}

import type {
  DashboardSummaryResponse,
} from "@/features/dashboard/types/dashboard";

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

async function parseResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  if (!response.ok) {
    let message = fallbackMessage;

    try {
      const data = await response.json();

      if (
        data &&
        typeof data.detail === "string"
      ) {
        message = data.detail;
      }
    } catch {
    }

    throw new Error(message);
  }

  return response.json();
}

export async function fetchDashboardSummary(): Promise<DashboardSummaryResponse> {
  const response = await fetch(
    `${API_BASE}/dashboard/summary`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  return parseResponse<DashboardSummaryResponse>(
    response,
    "Failed to load dashboard summary",
  );
}

export async function runDashboardReview(): Promise<DashboardSummaryResponse> {
  const response = await fetch(
    `${API_BASE}/dashboard/review`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    },
  );

  return parseResponse<DashboardSummaryResponse>(
    response,
    "Failed to run dashboard review",
  );
}

import type {
  CareerPath,
  CareerPathGenerateRequest,
} from "../types/careerPath";

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
    try {
      const errorData = await response.json();

      throw new Error(
        errorData?.detail ||
          errorData?.message ||
          defaultMessage,
      );
    } catch {
      throw new Error(defaultMessage);
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function generateCareerPath(
  payload: CareerPathGenerateRequest,
): Promise<CareerPath> {
  const response = await fetch(
    `${API_BASE}/career-path/generate`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  return handleResponse<CareerPath>(
    response,
    "Failed to generate career path",
  );
}

export async function fetchCareerPaths(): Promise<CareerPath[]> {
  const response = await fetch(
    `${API_BASE}/career-path`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  return handleResponse<CareerPath[]>(
    response,
    "Failed to load career paths",
  );
}

export async function fetchLatestCareerPath(): Promise<CareerPath | null> {
  const response = await fetch(
    `${API_BASE}/career-path/latest`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  return handleResponse<CareerPath | null>(
    response,
    "Failed to load latest career path",
  );
}

export async function fetchCareerPathById(
  careerPathId: number,
): Promise<CareerPath> {
  const response = await fetch(
    `${API_BASE}/career-path/${careerPathId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  return handleResponse<CareerPath>(
    response,
    "Failed to load career path",
  );
}

export async function deleteCareerPath(
  careerPathId: number,
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/career-path/${careerPathId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  return handleResponse<void>(
    response,
    "Failed to delete career path",
  );
}

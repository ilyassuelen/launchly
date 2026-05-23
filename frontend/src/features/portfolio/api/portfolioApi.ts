import type {
  PortfolioAnalyzerRequest,
  PortfolioAnalyzerResponse,
  PortfolioProfileData,
} from "@/features/portfolio/types/portfolioAnalyzer";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
  };
}

export async function analyzePortfolio(
  payload: PortfolioAnalyzerRequest,
): Promise<PortfolioAnalyzerResponse> {
  const response = await fetch(
    `${API_BASE}/portfolio/analyze`,
    {
      method: "POST",

      headers: getAuthHeaders(),

      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to analyze GitHub portfolio",
    );
  }

  return response.json();
}

export async function getPortfolioProfile(): Promise<PortfolioProfileData | null> {
  const response = await fetch(
    `${API_BASE}/portfolio/profile`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load saved portfolio analysis",
    );
  }

  return response.json();
}

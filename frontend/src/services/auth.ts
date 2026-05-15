import { apiFetch } from "@/lib/api";

import type {
  LoginData,
  RegisterData,
  TokenResponse,
  User,
} from "@/types/auth";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000";

export async function register(
  userData: RegisterData,
): Promise<User> {
  return apiFetch<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function login(
  loginData: LoginData,
): Promise<TokenResponse> {
  const formData = new URLSearchParams();

  formData.append("username", loginData.username);
  formData.append("password", loginData.password);

  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || "Login failed",
    );
  }

  localStorage.setItem(
    "access_token",
    data.access_token,
  );

  return data;
}

export async function getCurrentUser(): Promise<User> {
  const token =
    localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${API_URL}/users/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    logout();
    throw new Error(
      "Failed to fetch current user",
    );
  }

  return response.json();
}

export function isAuthenticated(): boolean {
  const token =
    localStorage.getItem("access_token");

  return !!token;
}

export function logout() {
  localStorage.removeItem(
    "access_token",
  );
}

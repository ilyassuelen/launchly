export interface RegisterData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  ai_response_language: "english" | "german";
}

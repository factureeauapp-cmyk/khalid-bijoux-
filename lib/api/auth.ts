import { apiCall } from "./client";

export interface LoginResponse {
  token: string;
  email: string;
  expiresIn: number;
}

export interface AuthError {
  code: string;
  message: string;
}

export const authService = {
  async login(email: string, password: string): Promise<{ data?: LoginResponse; error?: AuthError }> {
    return apiCall<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async logout(): Promise<{ success: boolean; error?: AuthError }> {
    const response = await apiCall<{ success: boolean }>("/api/auth/logout", {
      method: "POST",
    });

    if (response.error) {
      return { success: false, error: response.error };
    }

    return { success: true };
  },

  async getCurrentUser(): Promise<{ data?: { email: string }; error?: AuthError }> {
    return apiCall<{ email: string }>("/api/auth/me");
  },
};


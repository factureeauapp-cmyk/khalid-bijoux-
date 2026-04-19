// API Configuration and utilities

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string[];
  };
}

interface RequestInit extends globalThis.RequestInit {
  headers?: Record<string, string>;
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Accept-Language": getCurrentLocale(),
      ...options?.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || {
          code: "HTTP_ERROR",
          message: `HTTP ${response.status}: ${response.statusText}`,
        },
      };
    }

    return { data };
  } catch (error) {
    console.error("API Call Error:", error);
    return {
      error: {
        code: "NETWORK_ERROR",
        message: error instanceof Error ? error.message : "Network error occurred",
      },
    };
  }
}

function getCurrentLocale(): string {
  if (typeof window !== "undefined") {
    const html = document.documentElement;
    return html.lang || "en";
  }
  return "en";
}

export { API_BASE_URL };

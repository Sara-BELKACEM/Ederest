/**
 * Central API client configuration.
 * All requests gracefully fallback to frontend mock handlers if the backend is not yet available,
 * keeping the frontend entirely independent and functional for the hackathon prototype.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export async function safeFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData: T
): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Quick 2s timeout for mock fallback

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[API] ${endpoint} returned ${response.status}. Using mock fallback.`);
      return fallbackData;
    }

    return await response.json();
  } catch {
    // Backend offline or unreachable: gracefully return fallback mock
    return fallbackData;
  }
}

import type { ApiError } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

const TOKEN_KEY = 'gd_token';
const REFRESH_TOKEN_KEY = 'gd_refresh_token';

export const tokenStore = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (token: string, refreshToken: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export class ApiRequestError extends Error {
  status: number;
  errors?: string[];

  constructor(status: number, body: ApiError) {
    super(body.message || 'Request failed');
    this.status = status;
    this.errors = body.errors;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  isFormData?: boolean;
  skipAuth?: boolean;
}

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  if (!res.ok) return null;
  const data = await res.json();
  tokenStore.setTokens(data.token, refreshToken);
  return data.token as string;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, isFormData = false, skipAuth = false } = options;

  const doFetch = async (token: string | null): Promise<Response> => {
    const headers: Record<string, string> = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';
    if (token && !skipAuth) headers.Authorization = `Bearer ${token}`;

    return fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body)
    });
  };

  let token = skipAuth ? null : tokenStore.getToken();
  let res = await doFetch(token);

  if (res.status === 401 && !skipAuth && tokenStore.getRefreshToken()) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      res = await doFetch(refreshed);
    } else {
      tokenStore.clear();
    }
  }

  if (!res.ok) {
    let errBody: ApiError = { message: `Request failed with status ${res.status}` };
    try {
      errBody = await res.json();
    } catch {
      // response had no JSON body
    }
    throw new ApiRequestError(res.status, errBody);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

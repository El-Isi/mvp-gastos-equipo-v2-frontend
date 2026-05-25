/**
 * Cliente para el auth-service real de Konfío.
 * Base URL: https://auth.konfio.mx/api/v1
 *
 * Usa el patrón estándar de integración: Bearer token + x-api-key
 */

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const AUTH_URL = process.env.AUTH_SERVICE_URL || 'https://auth.konfio.mx/api/v1';
const AUTH_API_KEY = process.env.AUTH_SERVICE_API_KEY || '';

function authHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': AUTH_API_KEY,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function login(credentials: LoginRequest): Promise<AuthTokens> {
  const response = await fetch(`${AUTH_URL}/auth/login`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || `Login failed with status ${response.status}`);
  }

  return response.json() as Promise<AuthTokens>;
}

export async function refreshToken(refresh_token: string): Promise<AuthTokens> {
  const response = await fetch(`${AUTH_URL}/auth/refresh`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ refresh_token }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  return response.json() as Promise<AuthTokens>;
}

export async function logout(token: string): Promise<void> {
  await fetch(`${AUTH_URL}/auth/logout`, {
    method: 'POST',
    headers: authHeaders(token),
  });
}

export async function getMe(token: string): Promise<AuthUser> {
  const response = await fetch(`${AUTH_URL}/auth/me`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch authenticated user');
  }

  return response.json() as Promise<AuthUser>;
}

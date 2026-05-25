/**
 * Cliente HTTP base para el backend de gastos.
 *
 * GAP: Actualmente no existe un backend real para persistir gastos.
 * Este módulo está preparado para cuando se implemente el servicio.
 * Mientras tanto, el MVP usa estado local en el componente React.
 *
 * TODO: Conectar con backend NestJS cuando esté disponible.
 */

import type { Expense } from '@/lib/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  total: number;
}

interface ApiRequestOptions {
  token?: string;
  params?: Record<string, string>;
}

async function apiRequest<T>(
  path: string,
  options: RequestInit & ApiRequestOptions = {}
): Promise<T> {
  const { token, params, ...fetchOptions } = options;

  const url = new URL(`${API_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      statusCode: response.status,
      message: response.statusText,
      timestamp: new Date().toISOString(),
    }));
    throw new Error(error.message || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * TODO: Estas funciones están listas para conectar con el backend real.
 * Actualmente NO se usan porque el MVP opera con estado local.
 * Descomentar y usar cuando el backend esté disponible.
 */

export async function fetchExpenses(
  options?: ApiRequestOptions & { cursor?: string; limit?: number; category?: string; member?: string }
): Promise<PaginatedResponse<Expense>> {
  const params: Record<string, string> = {};
  if (options?.cursor) params['cursor'] = options.cursor;
  if (options?.limit) params['limit'] = String(options.limit);
  if (options?.category && options.category !== 'all') params['category'] = options.category;
  if (options?.member && options.member !== 'all') params['member'] = options.member;

  return apiRequest<PaginatedResponse<Expense>>('/expenses', {
    method: 'GET',
    token: options?.token,
    params,
  });
}

export async function createExpense(
  expense: Omit<Expense, 'id'>,
  options?: ApiRequestOptions
): Promise<Expense> {
  return apiRequest<Expense>('/expenses', {
    method: 'POST',
    token: options?.token,
    body: JSON.stringify(expense),
  });
}

export async function updateExpense(
  id: string,
  updates: Partial<Expense>,
  options?: ApiRequestOptions
): Promise<Expense> {
  return apiRequest<Expense>(`/expenses/${id}`, {
    method: 'PATCH',
    token: options?.token,
    body: JSON.stringify(updates),
  });
}

export async function deleteExpense(
  id: string,
  options?: ApiRequestOptions
): Promise<void> {
  await apiRequest<void>(`/expenses/${id}`, {
    method: 'DELETE',
    token: options?.token,
  });
}

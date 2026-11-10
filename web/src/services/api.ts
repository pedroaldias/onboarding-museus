import type {
  Attraction,
  AttractionInput,
  Work,
  WorkInput,
} from '@/models/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';
const REQUEST_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Requisição cancelada de propósito (troca de rota, remontagem, nova tentativa). */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Algo deu errado. Tente novamente.',
): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body) headers['Content-Type'] = 'application/json';

  // Timeout em toda requisição + cancelamento do chamador (AbortController).
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeout])
    : timeout;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      signal,
      cache: 'no-store',
    });
  } catch (error) {
    if (isAbortError(error)) throw error;
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError('A API demorou demais para responder. Tente novamente.');
    }
    throw new ApiError(
      'Não foi possível conectar à API. Verifique se o servidor está em execução.',
    );
  }

  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const body = await res.json();
      message = Array.isArray(body.message)
        ? body.message.join(', ')
        : (body.message ?? message);
    } catch {
      // resposta sem JSON: mantém a mensagem padrão
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ---- Atrações ----
export const listAttractions = (signal?: AbortSignal) =>
  request<Attraction[]>('/attraction', { signal });

export const getAttraction = (id: number, signal?: AbortSignal) =>
  request<Attraction>(`/attraction/${id}`, { signal });

export const createAttraction = (data: AttractionInput) =>
  request<Attraction>('/attraction', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateAttraction = (id: number, data: Partial<AttractionInput>) =>
  request<Attraction>(`/attraction/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const deleteAttraction = (id: number) =>
  request<void>(`/attraction/${id}`, { method: 'DELETE' });

// ---- Obras ----
export const listWorks = (attractionId: number, signal?: AbortSignal) =>
  request<Work[]>(`/attraction/${attractionId}/work`, { signal });

export const createWork = (attractionId: number, data: WorkInput) =>
  request<Work>(`/attraction/${attractionId}/work`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const deleteWork = (attractionId: number, workId: number) =>
  request<void>(`/attraction/${attractionId}/work/${workId}`, {
    method: 'DELETE',
  });

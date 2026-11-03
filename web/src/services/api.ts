import { Attraction, AttractionInput, Work, WorkInput } from '@/models/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

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
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ---- Atrações ----
export const listAttractions = () => request<Attraction[]>('/attraction');

export const getAttraction = (id: number) =>
  request<Attraction>(`/attraction/${id}`);

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
export const listWorks = (attractionId: number) =>
  request<Work[]>(`/attraction/${attractionId}/work`);

export const createWork = (attractionId: number, data: WorkInput) =>
  request<Work>(`/attraction/${attractionId}/work`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const deleteWork = (attractionId: number, workId: number) =>
  request<void>(`/attraction/${attractionId}/work/${workId}`, {
    method: 'DELETE',
  });

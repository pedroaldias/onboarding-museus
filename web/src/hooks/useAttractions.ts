'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Attraction } from '@/models/types';
import {
  deleteAttraction,
  getErrorMessage,
  isAbortError,
  listAttractions,
} from '@/services/api';

interface State {
  items: Attraction[] | null;
  error: string | null;
}

/**
 * Lista de atrações. Diferenças em relação ao código anterior:
 * - a requisição é CANCELADA de verdade (AbortController), em vez de só ignorar a resposta;
 * - apagar atualiza o estado local (O(n) em memória) em vez de refazer o GET inteiro.
 */
export function useAttractions() {
  const [state, setState] = useState<State>({ items: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    listAttractions(controller.signal)
      .then((items) => setState({ items, error: null }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return;
        setState((current) => ({ ...current, error: getErrorMessage(error) }));
      });
    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => {
    setState((current) => ({ ...current, error: null }));
    setAttempt((n) => n + 1);
  }, []);

  const remove = useCallback(async (id: number) => {
    await deleteAttraction(id);
    setState((current) => ({
      ...current,
      items: current.items && current.items.filter((a) => a.id !== id),
    }));
  }, []);

  return {
    items: state.items,
    error: state.error,
    loading: state.items === null && state.error === null,
    reload,
    remove,
  };
}

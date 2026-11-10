'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  Attraction,
  AttractionInput,
  Work,
  WorkInput,
} from '@/models/types';
import {
  createWork,
  deleteWork,
  getAttraction,
  getErrorMessage,
  isAbortError,
  listWorks,
  updateAttraction,
} from '@/services/api';

interface State {
  attraction: Attraction | null;
  works: Work[];
  error: string | null;
}

/**
 * Atração + obras. As duas requisições saem em paralelo (Promise.all) e as
 * mutações usam a resposta da própria API para atualizar o estado, sem refazer
 * os dois GETs a cada ação. O componente que usa o hook deve receber `key={id}`.
 */
export function useAttractionDetails(id: number) {
  const [state, setState] = useState<State>({
    attraction: null,
    works: [],
    error: null,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      getAttraction(id, controller.signal),
      listWorks(id, controller.signal),
    ])
      .then(([attraction, works]) => setState({ attraction, works, error: null }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return;
        setState((current) => ({ ...current, error: getErrorMessage(error) }));
      });
    return () => controller.abort();
  }, [id, attempt]);

  const reload = useCallback(() => {
    setState((current) => ({ ...current, error: null }));
    setAttempt((n) => n + 1);
  }, []);

  const saveAttraction = useCallback(
    async (data: AttractionInput) => {
      const attraction = await updateAttraction(id, data);
      setState((current) => ({ ...current, attraction }));
    },
    [id],
  );

  const addWork = useCallback(
    async (data: WorkInput) => {
      const work = await createWork(id, data);
      setState((current) => ({ ...current, works: [...current.works, work] }));
    },
    [id],
  );

  const removeWork = useCallback(
    async (workId: number) => {
      await deleteWork(id, workId);
      setState((current) => ({
        ...current,
        works: current.works.filter((w) => w.id !== workId),
      }));
    },
    [id],
  );

  return {
    attraction: state.attraction,
    works: state.works,
    error: state.error,
    loading: state.attraction === null && state.error === null,
    reload,
    saveAttraction,
    addWork,
    removeWork,
  };
}

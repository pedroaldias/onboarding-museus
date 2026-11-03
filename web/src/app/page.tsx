'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Attraction } from '@/models/types';
import { deleteAttraction, listAttractions } from '@/services/api';

export default function HomePage() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    listAttractions()
      .then((data) => {
        if (active) {
          setAttractions(data);
          setError('');
        }
      })
      .catch((e: Error) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [reload]);

  async function handleDelete(id: number) {
    if (!confirm('Apagar esta atração e todas as suas obras?')) return;
    try {
      await deleteAttraction(id);
      setReload((r) => r + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao apagar');
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Atrações</h1>
        <Link
          href="/attractions/new"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Nova atração
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded bg-red-500/10 p-3 text-red-500">
          {error} (a API está rodando em http://localhost:3000?)
        </p>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : attractions.length === 0 ? (
        <p>Nenhuma atração cadastrada ainda.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {attractions.map((a) => (
            <li
              key={a.id}
              className="flex items-start justify-between gap-4 rounded border border-gray-400/40 p-4"
            >
              <div>
                <Link
                  href={`/attractions/${a.id}`}
                  className="text-lg font-semibold text-blue-500 hover:underline"
                >
                  {a.name}
                </Link>
                <p className="mt-1 text-sm opacity-80">{a.description}</p>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                className="shrink-0 rounded border border-red-500 px-3 py-1 text-sm text-red-500"
              >
                Apagar
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

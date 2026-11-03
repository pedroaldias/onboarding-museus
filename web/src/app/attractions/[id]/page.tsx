'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Attraction, Work } from '@/models/types';
import {
  createWork,
  deleteWork,
  getAttraction,
  listWorks,
  updateAttraction,
} from '@/services/api';
import AttractionForm from '@/components/AttractionForm';
import WorkForm from '@/components/WorkForm';

function AttractionDetails() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([getAttraction(id), listWorks(id)])
      .then(([a, w]) => {
        if (active) {
          setAttraction(a);
          setWorks(w);
          setError('');
        }
      })
      .catch((e: Error) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, reload]);

  async function handleDeleteWork(workId: number) {
    if (!confirm('Apagar esta obra?')) return;
    try {
      await deleteWork(id, workId);
      setReload((r) => r + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao apagar');
    }
  }

  if (loading) return <main className="p-6">Carregando...</main>;

  if (!attraction) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="mb-4 text-red-500">{error || 'Atração não encontrada'}</p>
        <Link href="/" className="text-blue-500 hover:underline">
          ← Voltar
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/" className="text-blue-500 hover:underline">
        ← Voltar para atrações
      </Link>

      <section className="my-6">
        {editing ? (
          <AttractionForm
            initial={{
              name: attraction.name,
              description: attraction.description,
            }}
            submitLabel="Salvar alterações"
            onCancel={() => setEditing(false)}
            onSubmit={async (data) => {
              await updateAttraction(id, data);
              setEditing(false);
              setReload((r) => r + 1);
            }}
          />
        ) : (
          <>
            <h1 className="text-3xl font-bold">{attraction.name}</h1>
            <p className="mt-2 opacity-80">{attraction.description}</p>
            <button
              onClick={() => setEditing(true)}
              className="mt-3 rounded border border-gray-400 px-3 py-1 text-sm"
            >
              Editar atração
            </button>
          </>
        )}
      </section>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <h2 className="mb-3 text-2xl font-semibold">Obras</h2>

      {works.length === 0 ? (
        <p className="mb-6">Nenhuma obra cadastrada nesta atração.</p>
      ) : (
        <ul className="mb-8 flex flex-col gap-3">
          {works.map((w) => (
            <li
              key={w.id}
              className="flex items-start justify-between gap-4 rounded border border-gray-400/40 p-4"
            >
              <div>
                <p className="text-lg font-semibold">{w.title}</p>
                <p className="text-sm opacity-70">Autor: {w.author}</p>
                <p className="mt-1 text-sm opacity-80">{w.description}</p>
              </div>
              <button
                onClick={() => handleDeleteWork(w.id)}
                className="shrink-0 rounded border border-red-500 px-3 py-1 text-sm text-red-500"
              >
                Apagar
              </button>
            </li>
          ))}
        </ul>
      )}

      <section className="rounded border border-gray-400/40 p-4">
        <h3 className="mb-3 text-xl font-semibold">Nova obra</h3>
        <WorkForm
          onSubmit={async (data) => {
            await createWork(id, data);
            setReload((r) => r + 1);
          }}
        />
      </section>
    </main>
  );
}

export default function AttractionPage() {
  return (
    <Suspense fallback={<main className="p-6">Carregando...</main>}>
      <AttractionDetails />
    </Suspense>
  );
}

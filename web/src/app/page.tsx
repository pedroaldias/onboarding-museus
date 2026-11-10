'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Attraction } from '@/models/types';
import { useAttractions } from '@/hooks/useAttractions';
import { getErrorMessage } from '@/services/api';
import AttractionCard from '@/components/AttractionCard';
import Alert from '@/components/ui/Alert';
import Button, { buttonClass } from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';

function ListSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Carregando atrações…</span>
      <ul className="grid gap-4 sm:grid-cols-2" aria-hidden="true">
        {[0, 1, 2, 3].map((n) => (
          <li
            key={n}
            className="h-52 animate-pulse rounded-2xl border border-line bg-surface p-6"
          >
            <div className="h-3 w-16 rounded bg-line" />
            <div className="mt-4 h-6 w-3/4 rounded bg-line" />
            <div className="mt-4 h-3 w-full rounded bg-line" />
            <div className="mt-2 h-3 w-2/3 rounded bg-line" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HomePage() {
  const { items, error, loading, reload, remove } = useAttractions();
  const [target, setTarget] = useState<Attraction | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState('');

  async function confirmDelete() {
    if (!target) return;
    setDeleting(true);
    setActionError('');
    try {
      await remove(target.id);
      setTarget(null);
    } catch (e) {
      setActionError(getErrorMessage(e, 'Erro ao apagar'));
      setTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  const newAttractionLink = (
    <Link href="/attractions/new" className={buttonClass('primary')}>
      Nova atração
    </Link>
  );

  return (
    <>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Acervo digital
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.05] tracking-tight">
            Atrações
          </h1>
          <p className="mt-4 text-lg text-muted">
            Museus e espaços cadastrados. Abra uma atração para ver e gerenciar
            as obras do acervo.
          </p>
        </div>
        {newAttractionLink}
      </header>

      {error && (
        <div className="mb-6">
          <Alert
            action={
              <Button variant="secondary" onClick={reload}>
                Tentar novamente
              </Button>
            }
          >
            {error}
          </Alert>
        </div>
      )}

      {actionError && (
        <div className="mb-6">
          <Alert>{actionError}</Alert>
        </div>
      )}

      {loading ? (
        <ListSkeleton />
      ) : items && items.length === 0 ? (
        <EmptyState
          title="Nenhuma atração cadastrada ainda."
          description="Cadastre o primeiro museu para começar a montar o acervo."
          action={newAttractionLink}
        />
      ) : (
        items && (
          <>
            <p className="mb-4 text-sm text-muted" role="status">
              {items.length} {items.length === 1 ? 'atração' : 'atrações'}
            </p>
            <ul className="grid gap-4 sm:grid-cols-2">
              {items.map((attraction, index) => (
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  index={index}
                  onDelete={setTarget}
                />
              ))}
            </ul>
          </>
        )
      )}

      <ConfirmDialog
        open={target !== null}
        title="Apagar atração?"
        description={
          target
            ? `“${target.name}” e todas as obras dela serão apagadas. Essa ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Apagar definitivamente"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}

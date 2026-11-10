'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Work } from '@/models/types';
import { useAttractionDetails } from '@/hooks/useAttractionDetails';
import { getErrorMessage } from '@/services/api';
import AttractionForm from '@/components/AttractionForm';
import WorkForm from '@/components/WorkForm';
import WorkItem from '@/components/WorkItem';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';

function BackLink() {
  return (
    <nav aria-label="Trilha de navegação" className="text-sm">
      <Link href="/" className="text-accent hover:underline">
        ← Voltar para atrações
      </Link>
    </nav>
  );
}

function DetailsSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Carregando atração…</span>
      <div aria-hidden="true" className="animate-pulse">
        <div className="h-3 w-24 rounded bg-line" />
        <div className="mt-6 h-10 w-2/3 rounded bg-line" />
        <div className="mt-4 h-4 w-full max-w-xl rounded bg-line" />
        <div className="mt-2 h-4 w-1/2 rounded bg-line" />
      </div>
    </div>
  );
}

function AttractionDetails({ id }: { id: number }) {
  const {
    attraction,
    works,
    error,
    loading,
    reload,
    saveAttraction,
    addWork,
    removeWork,
  } = useAttractionDetails(id);

  const [editing, setEditing] = useState(false);
  const [target, setTarget] = useState<Work | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState('');

  // Ao sair do modo de edição, devolve o foco ao botão "Editar atração".
  const editButton = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(false);
  useEffect(() => {
    if (wasEditing.current && !editing) editButton.current?.focus();
    wasEditing.current = editing;
  }, [editing]);

  async function confirmDelete() {
    if (!target) return;
    setDeleting(true);
    setActionError('');
    try {
      await removeWork(target.id);
    } catch (e) {
      setActionError(getErrorMessage(e, 'Erro ao apagar'));
    } finally {
      setTarget(null);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <>
        <BackLink />
        <div className="mt-6">
          <DetailsSkeleton />
        </div>
      </>
    );
  }

  if (!attraction) {
    return (
      <div className="mx-auto max-w-xl">
        <BackLink />
        <div className="mt-6">
          <Alert
            action={
              <Button variant="secondary" onClick={reload}>
                Tentar novamente
              </Button>
            }
          >
            {error || 'Atração não encontrada'}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackLink />

      <section className="mt-6 max-w-2xl">
        {editing ? (
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
            <AttractionForm
              initial={{
                name: attraction.name,
                description: attraction.description,
              }}
              submitLabel="Salvar alterações"
              onCancel={() => setEditing(false)}
              onSubmit={async (data) => {
                await saveAttraction(data);
                setEditing(false);
              }}
            />
          </div>
        ) : (
          <>
            <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-tight">
              {attraction.name}
            </h1>
            <p className="mt-4 text-lg text-muted">{attraction.description}</p>
            <Button
              ref={editButton}
              variant="secondary"
              className="mt-6"
              onClick={() => setEditing(true)}
            >
              Editar atração
            </Button>
          </>
        )}
      </section>

      {error && (
        <div className="mt-8">
          <Alert>{error}</Alert>
        </div>
      )}
      {actionError && (
        <div className="mt-8">
          <Alert>{actionError}</Alert>
        </div>
      )}

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
        <section aria-labelledby="obras-titulo">
          <h2
            id="obras-titulo"
            className="font-display text-3xl tracking-tight"
          >
            Obras
          </h2>

          <div className="mt-5">
            {works.length === 0 ? (
              <EmptyState
                title="Nenhuma obra cadastrada nesta atração."
                description="Use o formulário ao lado para adicionar a primeira."
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {works.map((work) => (
                  <WorkItem key={work.id} work={work} onDelete={setTarget} />
                ))}
              </ul>
            )}
          </div>
        </section>

        <aside
          aria-labelledby="nova-obra-titulo"
          className="rounded-2xl border border-line bg-surface p-6 shadow-card lg:sticky lg:top-24"
        >
          <h2
            id="nova-obra-titulo"
            className="mb-4 font-display text-2xl tracking-tight"
          >
            Nova obra
          </h2>
          <WorkForm onSubmit={addWork} />
        </aside>
      </div>

      <ConfirmDialog
        open={target !== null}
        title="Apagar obra?"
        description={
          target ? `“${target.title}” será apagada. Essa ação não pode ser desfeita.` : ''
        }
        confirmLabel="Apagar definitivamente"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}

function AttractionRoute() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  if (!Number.isInteger(id) || id < 1) {
    return (
      <div className="mx-auto max-w-xl">
        <BackLink />
        <div className="mt-6">
          <Alert>Atração não encontrada</Alert>
        </div>
      </div>
    );
  }

  // key: trocar de atração reinicia o estado do hook por completo.
  return <AttractionDetails key={id} id={id} />;
}

export default function AttractionPage() {
  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <AttractionRoute />
    </Suspense>
  );
}

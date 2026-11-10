'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createAttraction } from '@/services/api';
import AttractionForm from '@/components/AttractionForm';

export default function NewAttractionPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-xl">
      <nav aria-label="Trilha de navegação" className="text-sm">
        <Link href="/" className="text-accent hover:underline">
          ← Voltar para atrações
        </Link>
      </nav>

      <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-tight">
        Nova atração
      </h1>
      <p className="mt-2 text-muted">
        Informe o nome e uma breve descrição do museu ou espaço.
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
        <AttractionForm
          submitLabel="Cadastrar atração"
          onCancel={() => router.push('/')}
          onSubmit={async (data) => {
            await createAttraction(data);
            router.push('/');
          }}
        />
      </div>
    </div>
  );
}

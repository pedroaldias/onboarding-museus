'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createAttraction } from '@/services/api';
import AttractionForm from '@/components/AttractionForm';

export default function NewAttractionPage() {
  const router = useRouter();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/" className="text-blue-500 hover:underline">
        ← Voltar para atrações
      </Link>

      <h1 className="my-6 text-3xl font-bold">Nova atração</h1>

      <AttractionForm
        submitLabel="Cadastrar atração"
        onCancel={() => router.push('/')}
        onSubmit={async (data) => {
          await createAttraction(data);
          router.push('/');
        }}
      />
    </main>
  );
}

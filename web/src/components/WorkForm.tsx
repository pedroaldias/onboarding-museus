'use client';

import { useState } from 'react';
import { WorkInput } from '@/models/types';

interface Props {
  onSubmit: (data: WorkInput) => Promise<void>;
}

const inputClass =
  'w-full rounded border border-gray-400 bg-white px-3 py-2 text-black';

export default function WorkForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        author: author.trim(),
        description: description.trim(),
      });
      setTitle('');
      setAuthor('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        className={inputClass}
        placeholder="Título da obra"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className={inputClass}
        placeholder="Autor"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <textarea
        className={inputClass}
        placeholder="Descrição"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="self-start rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {saving ? 'Salvando...' : 'Adicionar obra'}
      </button>
    </form>
  );
}

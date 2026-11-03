'use client';

import { useState } from 'react';
import { AttractionInput } from '@/models/types';

interface Props {
  initial?: AttractionInput;
  submitLabel: string;
  onSubmit: (data: AttractionInput) => Promise<void>;
  onCancel?: () => void;
}

const inputClass =
  'w-full rounded border border-gray-400 bg-white px-3 py-2 text-black';

export default function AttractionForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
      if (!initial) {
        setName('');
        setDescription('');
      }
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
        placeholder="Nome da atração"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {saving ? 'Salvando...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-gray-400 px-4 py-2"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

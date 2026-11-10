'use client';

import { useState } from 'react';
import type { AttractionInput } from '@/models/types';
import { getErrorMessage } from '@/services/api';
import Alert from './ui/Alert';
import Button from './ui/Button';
import { TextAreaField, TextField } from './ui/Field';

interface Props {
  initial?: AttractionInput;
  submitLabel: string;
  onSubmit: (data: AttractionInput) => Promise<void>;
  onCancel?: () => void;
}

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
      setError(getErrorMessage(err, 'Erro ao salvar'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <TextField
        label="Nome da atração"
        placeholder="Ex.: Museu Théo Brandão"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={200}
        autoComplete="off"
        autoFocus={Boolean(initial)}
        required
      />
      <TextAreaField
        label="Descrição"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={5000}
        required
      />
      {error && <Alert>{error}</Alert>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="primary" loading={saving}>
          {saving ? 'Salvando...' : submitLabel}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

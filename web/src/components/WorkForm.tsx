'use client';

import { useState } from 'react';
import type { WorkInput } from '@/models/types';
import { getErrorMessage } from '@/services/api';
import Alert from './ui/Alert';
import Button from './ui/Button';
import { TextAreaField, TextField } from './ui/Field';

interface Props {
  onSubmit: (data: WorkInput) => Promise<void>;
}

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
      setError(getErrorMessage(err, 'Erro ao salvar'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        label="Título da obra"
        placeholder="Ex.: Estátua de Anúbis"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
        autoComplete="off"
        required
      />
      <TextField
        label="Autor"
        placeholder="Ex.: Desconhecido"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        maxLength={200}
        autoComplete="off"
        required
      />
      <TextAreaField
        label="Descrição"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={5000}
        required
      />
      {error && <Alert>{error}</Alert>}
      <Button type="submit" variant="primary" loading={saving} className="self-start">
        {saving ? 'Salvando...' : 'Adicionar obra'}
      </Button>
    </form>
  );
}

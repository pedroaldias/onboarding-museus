import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
}));

vi.mock('@/services/api', () => ({
  getAttraction: vi.fn(),
  listWorks: vi.fn(),
  createWork: vi.fn(),
  deleteWork: vi.fn(),
  updateAttraction: vi.fn(),
}));

import AttractionPage from '@/app/attractions/[id]/page';
import {
  createWork,
  deleteWork,
  getAttraction,
  listWorks,
  updateAttraction,
} from '@/services/api';

const attraction = {
  id: 1,
  name: 'Museu Théo Brandão',
  description: 'Museu de Antropologia e Folclore',
};

const work = {
  id: 1,
  attraction_id: 1,
  title: 'Estátua de Anúbis',
  author: 'Desconhecido',
  description: 'Escultura em basalto, 500 a.C.',
};

describe('Página da atração', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getAttraction).mockResolvedValue(attraction);
  });

  it('mostra a atração e a lista de obras', async () => {
    vi.mocked(listWorks).mockResolvedValue([work]);

    render(<AttractionPage />);

    expect(
      await screen.findByRole('heading', { name: attraction.name }),
    ).toBeInTheDocument();
    expect(screen.getByText('Estátua de Anúbis')).toBeInTheDocument();
    expect(screen.getByText('Autor: Desconhecido')).toBeInTheDocument();
  });

  it('mostra mensagem quando a atração não tem obras', async () => {
    vi.mocked(listWorks).mockResolvedValue([]);

    render(<AttractionPage />);

    expect(
      await screen.findByText('Nenhuma obra cadastrada nesta atração.'),
    ).toBeInTheDocument();
  });

  it('mostra o erro quando a atração não existe', async () => {
    vi.mocked(getAttraction).mockRejectedValue(
      new Error('Atração 1 não encontrada'),
    );
    vi.mocked(listWorks).mockResolvedValue([]);

    render(<AttractionPage />);

    expect(
      await screen.findByText('Atração 1 não encontrada'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Voltar/ })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('cadastra uma nova obra e atualiza a lista', async () => {
    const user = userEvent.setup();
    vi.mocked(listWorks)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([work]);
    vi.mocked(createWork).mockResolvedValue(work);

    render(<AttractionPage />);

    await user.type(
      await screen.findByPlaceholderText('Título da obra'),
      work.title,
    );
    await user.type(screen.getByPlaceholderText('Autor'), work.author);
    await user.type(screen.getByPlaceholderText('Descrição'), work.description);
    await user.click(screen.getByRole('button', { name: 'Adicionar obra' }));

    expect(createWork).toHaveBeenCalledWith(1, {
      title: work.title,
      author: work.author,
      description: work.description,
    });
    expect(await screen.findByText('Autor: Desconhecido')).toBeInTheDocument();
  });

  it('apaga uma obra depois de confirmar', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(listWorks).mockResolvedValue([work]);
    vi.mocked(deleteWork).mockResolvedValue(undefined);

    render(<AttractionPage />);
    await user.click(await screen.findByRole('button', { name: 'Apagar' }));

    expect(deleteWork).toHaveBeenCalledWith(1, 1);
  });

  it('edita a atração e salva as alterações', async () => {
    const user = userEvent.setup();
    vi.mocked(listWorks).mockResolvedValue([]);
    vi.mocked(updateAttraction).mockResolvedValue({
      ...attraction,
      name: 'Novo nome',
    });

    render(<AttractionPage />);
    await user.click(
      await screen.findByRole('button', { name: 'Editar atração' }),
    );

    const nameInput = screen.getByPlaceholderText('Nome da atração');
    expect(nameInput).toHaveValue(attraction.name);

    await user.clear(nameInput);
    await user.type(nameInput, 'Novo nome');
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(updateAttraction).toHaveBeenCalledWith(1, {
      name: 'Novo nome',
      description: attraction.description,
    });
  });
});

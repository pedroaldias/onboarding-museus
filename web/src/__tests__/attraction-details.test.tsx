import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const params = vi.hoisted(() => ({ id: '1' }));

vi.mock('next/navigation', () => ({
  useParams: () => params,
}));

vi.mock('@/services/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/api')>()),
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
    params.id = '1';
    vi.mocked(getAttraction).mockResolvedValue(attraction);
  });

  it('mostra a atração e a lista de obras', async () => {
    vi.mocked(listWorks).mockResolvedValue([work]);

    render(<AttractionPage />);

    expect(
      await screen.findByRole('heading', { level: 1, name: attraction.name }),
    ).toBeInTheDocument();
    expect(screen.getByText('Estátua de Anúbis')).toBeInTheDocument();
    expect(screen.getByText('Autor: Desconhecido')).toBeInTheDocument();
  });

  it('busca atração e obras em paralelo, antes de qualquer resposta', async () => {
    vi.mocked(listWorks).mockResolvedValue([]);
    render(<AttractionPage />);

    expect(getAttraction).toHaveBeenCalledTimes(1);
    expect(listWorks).toHaveBeenCalledTimes(1);
    await screen.findByRole('heading', { level: 1 });
  });

  it('mostra o estado vazio quando a atração não tem obras', async () => {
    vi.mocked(listWorks).mockResolvedValue([]);

    render(<AttractionPage />);

    expect(
      await screen.findByText('Nenhuma obra cadastrada nesta atração.'),
    ).toBeInTheDocument();
  });

  it('mostra o erro quando a atração não existe', async () => {
    vi.mocked(getAttraction).mockRejectedValue(new Error('Atração 1 não encontrada'));
    vi.mocked(listWorks).mockResolvedValue([]);

    render(<AttractionPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Atração 1 não encontrada');
    expect(screen.getByRole('link', { name: /Voltar/ })).toHaveAttribute('href', '/');
  });

  it('não chama a API quando o id da URL é inválido', async () => {
    params.id = 'abc';

    render(<AttractionPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Atração não encontrada');
    expect(getAttraction).not.toHaveBeenCalled();
  });

  it('cadastra uma obra e a adiciona à lista sem refazer os GETs', async () => {
    const user = userEvent.setup();
    vi.mocked(listWorks).mockResolvedValue([]);
    vi.mocked(createWork).mockResolvedValue(work);

    render(<AttractionPage />);

    await user.type(await screen.findByLabelText('Título da obra'), work.title);
    await user.type(screen.getByLabelText('Autor'), work.author);
    const aside = screen.getByRole('complementary', { name: 'Nova obra' });
    await user.type(within(aside).getByLabelText('Descrição'), work.description);
    await user.click(screen.getByRole('button', { name: 'Adicionar obra' }));

    expect(createWork).toHaveBeenCalledWith(1, {
      title: work.title,
      author: work.author,
      description: work.description,
    });
    expect(await screen.findByText('Autor: Desconhecido')).toBeInTheDocument();
    expect(listWorks).toHaveBeenCalledTimes(1);
    expect(getAttraction).toHaveBeenCalledTimes(1);
  });

  it('apaga uma obra depois de confirmar no diálogo', async () => {
    const user = userEvent.setup();
    vi.mocked(listWorks).mockResolvedValue([work]);
    vi.mocked(deleteWork).mockResolvedValue(undefined);

    render(<AttractionPage />);
    await user.click(
      await screen.findByRole('button', { name: `Apagar ${work.title}` }),
    );
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Apagar definitivamente',
      }),
    );

    expect(deleteWork).toHaveBeenCalledWith(1, 1);
    expect(
      await screen.findByText('Nenhuma obra cadastrada nesta atração.'),
    ).toBeInTheDocument();
  });

  it('edita a atração, salva e mostra o nome novo', async () => {
    const user = userEvent.setup();
    vi.mocked(listWorks).mockResolvedValue([]);
    vi.mocked(updateAttraction).mockResolvedValue({ ...attraction, name: 'Novo nome' });

    render(<AttractionPage />);
    await user.click(await screen.findByRole('button', { name: 'Editar atração' }));

    const nameInput = screen.getByLabelText('Nome da atração');
    expect(nameInput).toHaveValue(attraction.name);
    expect(nameInput).toHaveFocus();

    await user.clear(nameInput);
    await user.type(nameInput, 'Novo nome');
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(updateAttraction).toHaveBeenCalledWith(1, {
      name: 'Novo nome',
      description: attraction.description,
    });
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Novo nome' }),
    ).toBeInTheDocument();
    // foco volta para o botão que abriu a edição
    expect(screen.getByRole('button', { name: 'Editar atração' })).toHaveFocus();
  });
});

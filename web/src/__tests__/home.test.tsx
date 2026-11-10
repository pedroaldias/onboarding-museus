import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/services/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/api')>()),
  listAttractions: vi.fn(),
  deleteAttraction: vi.fn(),
}));

import HomePage from '@/app/page';
import { deleteAttraction, listAttractions } from '@/services/api';

const attraction = {
  id: 1,
  name: 'Museu Théo Brandão',
  description: 'Museu de Antropologia e Folclore em Maceió',
};

describe('Página inicial (lista de atrações)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('mostra um estado de carregamento acessível e depois as atrações', async () => {
    vi.mocked(listAttractions).mockResolvedValue([attraction]);

    render(<HomePage />);
    expect(screen.getByText('Carregando atrações…')).toBeInTheDocument();

    const link = await screen.findByRole('link', { name: attraction.name });
    expect(link).toHaveAttribute('href', '/attractions/1');
    expect(screen.getByText(attraction.description)).toBeInTheDocument();
    expect(screen.getByText('1 atração')).toBeInTheDocument();
  });

  it('tem o botão "Nova atração" apontando para /attractions/new', async () => {
    vi.mocked(listAttractions).mockResolvedValue([]);

    render(<HomePage />);

    const links = await screen.findAllByRole('link', { name: 'Nova atração' });
    for (const link of links) expect(link).toHaveAttribute('href', '/attractions/new');
  });

  it('mostra o estado vazio quando não há atrações', async () => {
    vi.mocked(listAttractions).mockResolvedValue([]);

    render(<HomePage />);

    expect(
      await screen.findByText('Nenhuma atração cadastrada ainda.'),
    ).toBeInTheDocument();
  });

  it('mostra o erro e permite tentar novamente', async () => {
    const user = userEvent.setup();
    vi.mocked(listAttractions)
      .mockRejectedValueOnce(new Error('Não foi possível conectar à API.'))
      .mockResolvedValueOnce([attraction]);

    render(<HomePage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível conectar');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByRole('link', { name: attraction.name })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('apaga a atração depois de confirmar no diálogo e atualiza a lista sem novo GET', async () => {
    const user = userEvent.setup();
    vi.mocked(listAttractions).mockResolvedValue([attraction]);
    vi.mocked(deleteAttraction).mockResolvedValue(undefined);

    render(<HomePage />);
    await user.click(
      await screen.findByRole('button', { name: `Apagar ${attraction.name}` }),
    );

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Apagar atração?')).toBeInTheDocument();
    await user.click(
      within(dialog).getByRole('button', { name: 'Apagar definitivamente' }),
    );

    expect(deleteAttraction).toHaveBeenCalledWith(1);
    expect(
      await screen.findByText('Nenhuma atração cadastrada ainda.'),
    ).toBeInTheDocument();
    expect(listAttractions).toHaveBeenCalledTimes(1);
  });

  it('não apaga quando o usuário cancela o diálogo', async () => {
    const user = userEvent.setup();
    vi.mocked(listAttractions).mockResolvedValue([attraction]);

    render(<HomePage />);
    await user.click(
      await screen.findByRole('button', { name: `Apagar ${attraction.name}` }),
    );
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancelar' }),
    );

    expect(deleteAttraction).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: attraction.name })).toBeInTheDocument();
  });

  it('cancela a requisição pendente ao desmontar a página', async () => {
    let signal: AbortSignal | undefined;
    vi.mocked(listAttractions).mockImplementation((s) => {
      signal = s;
      return new Promise(() => {});
    });

    const { unmount } = render(<HomePage />);
    expect(signal?.aborted).toBe(false);
    unmount();
    expect(signal?.aborted).toBe(true);
  });
});

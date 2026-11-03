import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/services/api', () => ({
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

  it('mostra as atrações com link para a página de cada uma', async () => {
    vi.mocked(listAttractions).mockResolvedValue([attraction]);

    render(<HomePage />);

    const link = await screen.findByRole('link', { name: attraction.name });
    expect(link).toHaveAttribute('href', '/attractions/1');
    expect(screen.getByText(attraction.description)).toBeInTheDocument();
  });

  it('tem o botão "Nova atração" apontando para /attractions/new', async () => {
    vi.mocked(listAttractions).mockResolvedValue([]);

    render(<HomePage />);

    expect(
      await screen.findByRole('link', { name: 'Nova atração' }),
    ).toHaveAttribute('href', '/attractions/new');
  });

  it('mostra mensagem quando não há atrações', async () => {
    vi.mocked(listAttractions).mockResolvedValue([]);

    render(<HomePage />);

    expect(
      await screen.findByText('Nenhuma atração cadastrada ainda.'),
    ).toBeInTheDocument();
  });

  it('mostra o erro quando a API falha', async () => {
    vi.mocked(listAttractions).mockRejectedValue(new Error('Failed to fetch'));

    render(<HomePage />);

    expect(await screen.findByText(/Failed to fetch/)).toBeInTheDocument();
  });

  it('apaga a atração depois de confirmar e atualiza a lista', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(listAttractions)
      .mockResolvedValueOnce([attraction])
      .mockResolvedValueOnce([]);
    vi.mocked(deleteAttraction).mockResolvedValue(undefined);

    render(<HomePage />);
    await user.click(await screen.findByRole('button', { name: 'Apagar' }));

    expect(deleteAttraction).toHaveBeenCalledWith(1);
    expect(
      await screen.findByText('Nenhuma atração cadastrada ainda.'),
    ).toBeInTheDocument();
  });

  it('não apaga quando o usuário cancela a confirmação', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    vi.mocked(listAttractions).mockResolvedValue([attraction]);

    render(<HomePage />);
    await user.click(await screen.findByRole('button', { name: 'Apagar' }));

    expect(deleteAttraction).not.toHaveBeenCalled();
    expect(screen.getByText(attraction.name)).toBeInTheDocument();
  });
});

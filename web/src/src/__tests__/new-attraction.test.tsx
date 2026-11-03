import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const push = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/services/api', () => ({
  createAttraction: vi.fn(),
}));

import NewAttractionPage from '@/app/attractions/new/page';
import { createAttraction } from '@/services/api';

describe('Página de nova atração', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('cadastra a atração e volta para a lista', async () => {
    const user = userEvent.setup();
    vi.mocked(createAttraction).mockResolvedValue({
      id: 1,
      name: 'Museu Théo Brandão',
      description: 'Museu em Maceió',
    });

    render(<NewAttractionPage />);

    await user.type(
      screen.getByPlaceholderText('Nome da atração'),
      'Museu Théo Brandão',
    );
    await user.type(screen.getByPlaceholderText('Descrição'), 'Museu em Maceió');
    await user.click(screen.getByRole('button', { name: 'Cadastrar atração' }));

    expect(createAttraction).toHaveBeenCalledWith({
      name: 'Museu Théo Brandão',
      description: 'Museu em Maceió',
    });
    expect(push).toHaveBeenCalledWith('/');
  });

  it('mostra o erro da API e não sai da página', async () => {
    const user = userEvent.setup();
    vi.mocked(createAttraction).mockRejectedValue(new Error('Erro ao salvar'));

    render(<NewAttractionPage />);

    await user.type(screen.getByPlaceholderText('Nome da atração'), 'Museu');
    await user.type(screen.getByPlaceholderText('Descrição'), 'Desc');
    await user.click(screen.getByRole('button', { name: 'Cadastrar atração' }));

    expect(await screen.findByText('Erro ao salvar')).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it('o botão Cancelar volta para a lista sem salvar', async () => {
    const user = userEvent.setup();

    render(<NewAttractionPage />);
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(push).toHaveBeenCalledWith('/');
    expect(createAttraction).not.toHaveBeenCalled();
  });
});

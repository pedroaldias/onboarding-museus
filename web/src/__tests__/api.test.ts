import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ApiError,
  createAttraction,
  deleteAttraction,
  isAbortError,
  listAttractions,
} from '@/services/api';

const fetchMock = vi.fn();

function jsonResponse(status: number, body?: unknown) {
  return { ok: status < 400, status, json: async () => body } as unknown as Response;
}

describe('services/api', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('listAttractions faz GET em /attraction e devolve o JSON', async () => {
    const data = [{ id: 1, name: 'Museu', description: 'Desc' }];
    fetchMock.mockResolvedValue(jsonResponse(200, data));

    await expect(listAttractions()).resolves.toEqual(data);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/attraction$/),
      expect.objectContaining({ cache: 'no-store' }),
    );
  });

  it('repassa o AbortSignal do chamador ao fetch', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, []));
    const controller = new AbortController();

    await listAttractions(controller.signal);

    const { signal } = fetchMock.mock.calls[0][1] as RequestInit;
    expect(signal?.aborted).toBe(false);
    controller.abort();
    expect(signal?.aborted).toBe(true);
  });

  it('createAttraction envia POST com JSON no corpo', async () => {
    const input = { name: 'Museu', description: 'Desc' };
    fetchMock.mockResolvedValue(jsonResponse(201, { id: 1, ...input }));

    await createAttraction(input);

    const [, options] = fetchMock.mock.calls[0];
    expect(options.method).toBe('POST');
    expect(options.body).toBe(JSON.stringify(input));
    expect(options.headers['Content-Type']).toBe('application/json');
  });

  it('junta as mensagens quando a API devolve uma lista de erros (400)', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(400, { message: ['name não pode ser vazio', 'description inválida'] }),
    );

    await expect(createAttraction({ name: '', description: '' })).rejects.toThrow(
      'name não pode ser vazio, description inválida',
    );
  });

  it('usa a mensagem da API em um 404 e expõe o status', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(404, { message: 'Atração 999 não encontrada' }),
    );

    const error = await listAttractions().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(404);
    expect((error as ApiError).message).toBe('Atração 999 não encontrada');
  });

  it('usa uma mensagem padrão quando a resposta de erro não é JSON', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('sem json');
      },
    } as unknown as Response);

    await expect(listAttractions()).rejects.toThrow('Erro 500');
  });

  it('traduz falha de rede em mensagem amigável', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(listAttractions()).rejects.toThrow(/Não foi possível conectar à API/);
  });

  it('propaga o cancelamento sem transformá-lo em erro de rede', async () => {
    fetchMock.mockRejectedValue(new DOMException('Aborted', 'AbortError'));

    const error = await listAttractions().catch((e: unknown) => e);
    expect(isAbortError(error)).toBe(true);
  });

  it('retorna undefined em respostas 204 (DELETE)', async () => {
    fetchMock.mockResolvedValue(jsonResponse(204));

    await expect(deleteAttraction(1)).resolves.toBeUndefined();
    expect(fetchMock.mock.calls[0][1].method).toBe('DELETE');
  });
});

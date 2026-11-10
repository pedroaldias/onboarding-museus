import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AttractionService } from './attraction.service';
import { AttractionRepository } from '../repositories/attraction.repository';

const p2025 = () =>
  new Prisma.PrismaClientKnownRequestError('not found', {
    code: 'P2025',
    clientVersion: 'test',
  });

describe('AttractionService', () => {
  const findById = jest.fn();
  const update = jest.fn();
  const remove = jest.fn();
  let repo: jest.Mocked<AttractionRepository>;
  let service: AttractionService;

  beforeEach(() => {
    jest.resetAllMocks();
    repo = {
      findAll: jest.fn(),
      findById,
      create: jest.fn(),
      update,
      delete: remove,
    } as unknown as jest.Mocked<AttractionRepository>;
    service = new AttractionService(repo);
  });

  it('findOne lança 404 quando não existe', async () => {
    findById.mockResolvedValue(null);
    await expect(service.findOne(9)).rejects.toThrow(
      new NotFoundException('Atração 9 não encontrada'),
    );
  });

  it('update faz uma única chamada ao banco', async () => {
    update.mockResolvedValue({ id: 1, name: 'x', description: 'y' });
    await service.update(1, { name: 'x' });
    expect(update).toHaveBeenCalledTimes(1);
    expect(findById).not.toHaveBeenCalled();
  });

  it('update traduz P2025 em 404 com a mesma mensagem de antes', async () => {
    update.mockRejectedValue(p2025());
    await expect(service.update(9, { name: 'x' })).rejects.toThrow(
      new NotFoundException('Atração 9 não encontrada'),
    );
  });

  it('remove traduz P2025 em 404', async () => {
    remove.mockRejectedValue(p2025());
    await expect(service.remove(9)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('erros inesperados não são escondidos como 404', async () => {
    remove.mockRejectedValue(new Error('disco cheio'));
    await expect(service.remove(1)).rejects.toThrow('disco cheio');
  });
});

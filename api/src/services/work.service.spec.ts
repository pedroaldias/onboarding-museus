import { NotFoundException } from '@nestjs/common';
import { WorkService } from './work.service';
import { WorkRepository } from '../repositories/work.repository';
import { AttractionService } from './attraction.service';

describe('WorkService', () => {
  const findByAttraction = jest.fn();
  const createWork = jest.fn();
  const deleteFromAttraction = jest.fn();
  let repo: jest.Mocked<WorkRepository>;
  let attractions: jest.Mocked<AttractionService>;
  let service: WorkService;

  beforeEach(() => {
    jest.resetAllMocks();
    repo = {
      findByAttraction,
      create: createWork,
      deleteFromAttraction,
    } as unknown as jest.Mocked<WorkRepository>;
    attractions = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<AttractionService>;
    service = new WorkService(repo, attractions);
  });

  it('lista vazia é válida (atração existe, sem obras)', async () => {
    findByAttraction.mockResolvedValue([]);
    await expect(service.findByAttraction(1)).resolves.toEqual([]);
  });

  it('atração inexistente vira 404 na listagem', async () => {
    findByAttraction.mockResolvedValue(null);
    await expect(service.findByAttraction(9)).rejects.toThrow(
      new NotFoundException('Atração 9 não encontrada'),
    );
  });

  it('create confere a atração antes de gravar', async () => {
    attractions.findOne.mockRejectedValue(new NotFoundException());
    await expect(
      service.create(9, { title: 'a', author: 'b', description: 'c' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(createWork).not.toHaveBeenCalled();
  });

  it('remove retorna 404 quando a obra não pertence à atração', async () => {
    deleteFromAttraction.mockResolvedValue(false);
    await expect(service.remove(2, 5)).rejects.toThrow(
      new NotFoundException('Obra 5 não encontrada na atração 2'),
    );
  });

  it('remove com sucesso não lança', async () => {
    deleteFromAttraction.mockResolvedValue(true);
    await expect(service.remove(1, 1)).resolves.toBeUndefined();
  });
});

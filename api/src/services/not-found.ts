import { NotFoundException } from '@nestjs/common';

export const attractionNotFound = (id: number) =>
  new NotFoundException(`Atração ${id} não encontrada`);

export const workNotFound = (workId: number, attractionId: number) =>
  new NotFoundException(
    `Obra ${workId} não encontrada na atração ${attractionId}`,
  );

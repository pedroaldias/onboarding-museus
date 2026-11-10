import { Injectable } from '@nestjs/common';
import type { Work } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkDto } from '../models/work.dto';

@Injectable()
export class WorkRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Uma única query (com índice em attraction_id): devolve `null` se a atração
   * não existe e `[]` se existe sem obras. Antes eram duas queries (checar + listar).
   */
  async findByAttraction(attractionId: number): Promise<Work[] | null> {
    const row = await this.prisma.attraction.findUnique({
      where: { id: attractionId },
      select: { works: { orderBy: { id: 'asc' } } },
    });
    return row?.works ?? null;
  }

  create(attractionId: number, data: CreateWorkDto) {
    return this.prisma.work.create({
      data: {
        title: data.title,
        author: data.author,
        description: data.description,
        attraction_id: attractionId,
      },
    });
  }

  /**
   * Apaga só se a obra pertencer à atração, de forma atômica (sem checar antes
   * e apagar depois). Retorna false quando nada foi apagado.
   */
  async deleteFromAttraction(
    attractionId: number,
    workId: number,
  ): Promise<boolean> {
    const { count } = await this.prisma.work.deleteMany({
      where: { id: workId, attraction_id: attractionId },
    });
    return count > 0;
  }
}

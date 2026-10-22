import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkDto } from '../models/work.dto';

@Injectable()
export class WorkRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByAttraction(attractionId: number) {
    return this.prisma.work.findMany({
      where: { attraction_id: attractionId },
      orderBy: { id: 'asc' },
    });
  }

  findById(id: number) {
    return this.prisma.work.findUnique({ where: { id } });
  }

  create(attractionId: number, data: CreateWorkDto) {
    return this.prisma.work.create({
      data: { ...data, attraction_id: attractionId },
    });
  }

  delete(id: number) {
    return this.prisma.work.delete({ where: { id } });
  }
}

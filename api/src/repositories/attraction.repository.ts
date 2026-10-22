import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttractionDto, UpdateAttractionDto } from '../models/attraction.dto';

@Injectable()
export class AttractionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.attraction.findMany({ orderBy: { id: 'asc' } });
  }

  findById(id: number) {
    return this.prisma.attraction.findUnique({ where: { id } });
  }

  create(data: CreateAttractionDto) {
    return this.prisma.attraction.create({ data });
  }

  update(id: number, data: UpdateAttractionDto) {
    return this.prisma.attraction.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.attraction.delete({ where: { id } });
  }
}

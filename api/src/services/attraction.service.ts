import { Injectable, NotFoundException } from '@nestjs/common';
import { AttractionRepository } from '../repositories/attraction.repository';
import { CreateAttractionDto, UpdateAttractionDto } from '../models/attraction.dto';

@Injectable()
export class AttractionService {
  constructor(private readonly repo: AttractionRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  async findOne(id: number) {
    const attraction = await this.repo.findById(id);
    if (!attraction) throw new NotFoundException(`Atração ${id} não encontrada`);
    return attraction;
  }

  create(dto: CreateAttractionDto) {
    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateAttractionDto) {
    await this.findOne(id);
    return this.repo.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}

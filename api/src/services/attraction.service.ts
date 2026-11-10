import { Injectable } from '@nestjs/common';
import { AttractionRepository } from '../repositories/attraction.repository';
import {
  CreateAttractionDto,
  UpdateAttractionDto,
} from '../models/attraction.dto';
import { isRecordNotFound } from '../prisma/prisma-errors';
import { attractionNotFound } from './not-found';

@Injectable()
export class AttractionService {
  constructor(private readonly repo: AttractionRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  async findOne(id: number) {
    const attraction = await this.repo.findById(id);
    if (!attraction) throw attractionNotFound(id);
    return attraction;
  }

  create(dto: CreateAttractionDto) {
    return this.repo.create(dto);
  }

  /**
   * Uma query em vez de duas: o Prisma já lança P2025 quando o registro não
   * existe. Isso também elimina a janela de corrida entre "checar" e "gravar".
   */
  async update(id: number, dto: UpdateAttractionDto) {
    try {
      return await this.repo.update(id, dto);
    } catch (error) {
      if (isRecordNotFound(error)) throw attractionNotFound(id);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.repo.delete(id);
    } catch (error) {
      if (isRecordNotFound(error)) throw attractionNotFound(id);
      throw error;
    }
  }
}

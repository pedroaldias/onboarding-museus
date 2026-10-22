import { Injectable, NotFoundException } from '@nestjs/common';
import { AttractionService } from './attraction.service';
import { WorkRepository } from '../repositories/work.repository';
import { CreateWorkDto } from '../models/work.dto';

@Injectable()
export class WorkService {
  constructor(
    private readonly repo: WorkRepository,
    private readonly attractionService: AttractionService,
  ) {}

  async findByAttraction(attractionId: number) {
    await this.attractionService.findOne(attractionId);
    return this.repo.findByAttraction(attractionId);
  }

  async create(attractionId: number, dto: CreateWorkDto) {
    await this.attractionService.findOne(attractionId);
    return this.repo.create(attractionId, dto);
  }

  async remove(attractionId: number, workId: number) {
    const work = await this.repo.findById(workId);
    if (!work || work.attraction_id !== attractionId) {
      throw new NotFoundException(
        `Obra ${workId} não encontrada na atração ${attractionId}`,
      );
    }
    await this.repo.delete(workId);
  }
}

import { Injectable } from '@nestjs/common';
import { AttractionService } from './attraction.service';
import { WorkRepository } from '../repositories/work.repository';
import { CreateWorkDto } from '../models/work.dto';
import { attractionNotFound, workNotFound } from './not-found';

@Injectable()
export class WorkService {
  constructor(
    private readonly repo: WorkRepository,
    private readonly attractionService: AttractionService,
  ) {}

  async findByAttraction(attractionId: number) {
    const works = await this.repo.findByAttraction(attractionId);
    if (!works) throw attractionNotFound(attractionId);
    return works;
  }

  async create(attractionId: number, dto: CreateWorkDto) {
    // Mantida a checagem explícita: dá a mensagem certa sem depender do código
    // de erro de violação de FK, que varia entre bancos.
    await this.attractionService.findOne(attractionId);
    return this.repo.create(attractionId, dto);
  }

  async remove(attractionId: number, workId: number) {
    const deleted = await this.repo.deleteFromAttraction(attractionId, workId);
    if (!deleted) throw workNotFound(workId, attractionId);
  }
}

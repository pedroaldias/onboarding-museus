import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { WorkService } from '../services/work.service';
import { CreateWorkDto } from '../models/work.dto';
import { IdPipe } from '../pipes/id.pipe';

// As URLs são as mesmas de antes: /api/attraction/:id/work[/:workId]
@Controller('attraction/:attractionId/work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Get()
  findAll(@Param('attractionId', IdPipe) attractionId: number) {
    return this.workService.findByAttraction(attractionId);
  }

  @Post()
  create(
    @Param('attractionId', IdPipe) attractionId: number,
    @Body() dto: CreateWorkDto,
  ) {
    return this.workService.create(attractionId, dto);
  }

  @Delete(':workId')
  @HttpCode(204)
  remove(
    @Param('attractionId', IdPipe) attractionId: number,
    @Param('workId', IdPipe) workId: number,
  ) {
    return this.workService.remove(attractionId, workId);
  }
}

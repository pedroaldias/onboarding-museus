import {
  Body, Controller, Delete, Get, HttpCode, Param,
  ParseIntPipe, Patch, Post,
} from '@nestjs/common';
import { AttractionService } from '../services/attraction.service';
import { WorkService } from '../services/work.service';
import { CreateAttractionDto, UpdateAttractionDto } from '../models/attraction.dto';
import { CreateWorkDto } from '../models/work.dto';

@Controller('attraction')
export class AttractionController {
  constructor(
    private readonly attractionService: AttractionService,
    private readonly workService: WorkService,
  ) {}

  @Get()
  findAll() {
    return this.attractionService.findAll();
  }

  @Post()
  create(@Body() dto: CreateAttractionDto) {
    return this.attractionService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attractionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAttractionDto) {
    return this.attractionService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attractionService.remove(id);
  }

  // ---- Obras ----

  @Get(':id/work')
  findWorks(@Param('id', ParseIntPipe) id: number) {
    return this.workService.findByAttraction(id);
  }

  @Post(':id/work')
  createWork(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateWorkDto) {
    return this.workService.create(id, dto);
  }

  @Delete(':id/work/:workId')
  @HttpCode(204)
  removeWork(
    @Param('id', ParseIntPipe) id: number,
    @Param('workId', ParseIntPipe) workId: number,
  ) {
    return this.workService.remove(id, workId);
  }
}

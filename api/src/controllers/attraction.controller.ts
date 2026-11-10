import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AttractionService } from '../services/attraction.service';
import {
  CreateAttractionDto,
  UpdateAttractionDto,
} from '../models/attraction.dto';
import { IdPipe } from '../pipes/id.pipe';

@Controller('attraction')
export class AttractionController {
  constructor(private readonly attractionService: AttractionService) {}

  @Get()
  findAll() {
    return this.attractionService.findAll();
  }

  @Post()
  create(@Body() dto: CreateAttractionDto) {
    return this.attractionService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', IdPipe) id: number) {
    return this.attractionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', IdPipe) id: number, @Body() dto: UpdateAttractionDto) {
    return this.attractionService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', IdPipe) id: number) {
    return this.attractionService.remove(id);
  }
}

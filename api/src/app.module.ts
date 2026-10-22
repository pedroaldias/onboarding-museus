import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AttractionController } from './controllers/attraction.controller';
import { AttractionService } from './services/attraction.service';
import { WorkService } from './services/work.service';
import { AttractionRepository } from './repositories/attraction.repository';
import { WorkRepository } from './repositories/work.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AttractionController],
  providers: [AttractionService, WorkService, AttractionRepository, WorkRepository],
})
export class AppModule {}

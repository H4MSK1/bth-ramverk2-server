import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { Report } from './reports.entity';
import { ReportsController } from './reports.controller';

@Module({
  providers: [ReportsService],
  exports: [ReportsService],
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [ReportsController],
})
export class ReportsModule {}

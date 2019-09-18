import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { Report } from './reports.entity';

@Module({
  providers: [ReportsService],
  exports: [ReportsService],
  imports: [TypeOrmModule.forFeature([Report])],
})
export class UsersModule {}

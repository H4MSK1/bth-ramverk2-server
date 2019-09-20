import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './reports.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(reportData: CreateReportDto) {
    return await this.reportsService.create(reportData);
  }

  @Get()
  async getReports() {
    return await this.reportsService.findAll();
  }

  @Get('/week/:id')
  async getReportFromWeek(week: number) {
    return await this.reportsService.findOne(week);
  }
}

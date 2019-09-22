import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportDto } from './reports.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getReports() {
    return await this.reportsService.findAll();
  }

  @Get('/week/:week')
  async getReportFromWeek(@Param('week') week: number) {
    return await this.reportsService.findOne(week);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() reportData: CreateReportDto) {
    return await this.reportsService.create(reportData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async update(@Body() reportData: UpdateReportDto) {
    return await this.reportsService.update(reportData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/week/:week')
  async delete(@Param('week') week: number) {
    return await this.reportsService.delete(week);
  }
}

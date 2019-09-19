import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { User } from '../users/decorator';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@User() user): Promise<any> {
    const fakeData = {
      authorId: user.id,
      content: 'lmayo',
      week: 1,
    };

    return await this.reportsService.create(fakeData);
  }

  @Get()
  async getReports(): Promise<any> {
    return await this.reportsService.findAll();
  }
}

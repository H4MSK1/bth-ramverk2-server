import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './reports.entity';
import { CreateReportDto, UpdateReportDto } from './reports.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly repository: Repository<Report>,
  ) {}

  async findAll(): Promise<Report[]> {
    return await this.repository.find();
  }

  async findOne(week: number): Promise<Report> {
    return await this.repository.findOneOrFail({ where: { week } });
  }

  async create(params: CreateReportDto): Promise<Report> {
    const report = new Report();
    report.week = params.week;
    report.body = params.body;

    return await this.repository.save(report);
  }

  async update(params: UpdateReportDto): Promise<Report> {
    const report = await this.findOne(params.week);
    const updatedReport = Object.assign(report, params);

    return await this.repository.save(updatedReport);
  }

  async delete(week: number): Promise<any> {
    const report = await this.findOne(week);
    return await this.repository.remove(report);
  }
}

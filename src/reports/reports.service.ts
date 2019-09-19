import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './reports.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly repository: Repository<Report>,
  ) {}

  findAll(): Promise<Report[]> {
    return this.repository.find();
  }

  findOne(week: number): Promise<any> {
    return this.repository.findOne({ where: { week } });
  }

  create(params): Promise<Report> {
    const report = new Report();
    report.authorId = params.authorId;
    report.content = params.content;
    report.week = params.week;

    return this.repository.save(report);
  }
}

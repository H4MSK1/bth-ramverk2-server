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

  async findAll(): Promise<Report[]> {
    return this.repository.find();
  }

  async findOne(kmom: number): Promise<any> {
    return this.repository.findOne({ where: { kmom } });
  }
}

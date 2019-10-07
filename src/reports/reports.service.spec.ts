import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateReportDto, UpdateReportDto } from './reports.dto';

describe('ReportsService', () => {
  let repository: Repository<Report>;
  let service: ReportsService;
  let module: TestingModule;

  const getMockedReport = (): Report => ({
    id: '1a',
    week: 3,
    body: 'this is a mocked entity!',
  });

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  beforeEach(() => {
    repository = module.get<Repository<Report>>(getRepositoryToken(Report));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return array of entities for findAll', async () => {
    const testReport: Report = getMockedReport();

    jest.spyOn(repository, 'find').mockResolvedValueOnce([testReport]);
    expect(await service.findAll()).toEqual([testReport]);
  });

  it('should return entity for findOne', async () => {
    const testReport: Report = getMockedReport();

    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(testReport);
    expect(await service.findOne(testReport.week)).toEqual(testReport);
  });

  it('should return newly created entity', async () => {
    const testReport: Report = getMockedReport();
    const dto = new CreateReportDto();
    dto.body = 'this is body';
    dto.week = 1;

    jest.spyOn(repository, 'save').mockResolvedValueOnce(testReport);
    expect(await service.create(dto)).toEqual(testReport);
  });

  it('should update entity and return the new values', async () => {
    const testReport: Report = getMockedReport();
    const dto = new UpdateReportDto();
    dto.week = testReport.week;
    dto.body = 'something new';

    const testReportUpdated = { ...getMockedReport(), ...dto };
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(testReportUpdated);
    jest.spyOn(repository, 'save').mockResolvedValueOnce(testReportUpdated);

    const result = await service.update(dto);
    expect(result.body).not.toEqual(testReport.body);
    expect(result.body).toEqual(dto.body);
  });

  it('should delete entity and return the object', async () => {
    const testReport: Report = getMockedReport();

    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(testReport);
    jest.spyOn(repository, 'remove').mockResolvedValueOnce(testReport);
    expect(await service.delete(testReport.week)).toEqual(testReport);
  });
});

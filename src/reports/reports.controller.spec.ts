import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportDto } from './reports.dto';

jest.mock('./reports.service');

describe('Reports Controller', () => {
  let controller: ReportsController;
  let service: ReportsService;
  let module: TestingModule;

  const testReport = {
    id: '1a',
    week: 3,
    body: 'this is a mocked entity!',
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [ReportsService],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  beforeEach(() => {
    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get reports', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([testReport]);
    const result = await controller.getReports();

    expect(result).toEqual([testReport]);
  });

  it('should get report for week 3', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(testReport);
    const result = await controller.getReportFromWeek(3);

    expect(result).toEqual(testReport);
  });

  it('should not get report for week 0', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(null);
    const result = await controller.getReportFromWeek(0);

    expect(result).toStrictEqual(null);
  });

  it('should create new report and return it', async () => {
    const dto = new CreateReportDto();
    dto.body = 'hello';
    dto.week = 1;

    jest
      .spyOn(service, 'create')
      .mockResolvedValue({ id: '1a', body: 'hello', week: 1 });

    const result = await controller.create(dto);
    expect(result.body).toEqual(dto.body);
    expect(result.week).toEqual(dto.week);
  });

  it('should update report and return it', async () => {
    const dto = new UpdateReportDto();
    dto.body = 'hello';
    dto.week = 1;

    jest.spyOn(service, 'findOne').mockRejectedValue(testReport);
    jest.spyOn(service, 'update').mockResolvedValue({ ...testReport, ...dto });

    const result = await controller.update(dto);
    expect(result.body).toEqual(dto.body);
    expect(result.week).toEqual(dto.week);
  });

  it('should delete report and return it', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValue(testReport);
    jest.spyOn(service, 'delete').mockResolvedValue(testReport);

    const result = await controller.delete(testReport.week);
    expect(result.week).toEqual(testReport.week);
  });
});

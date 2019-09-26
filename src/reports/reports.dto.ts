export class CreateReportDto {
  body: string;
  week: number;
}

export class UpdateReportDto extends CreateReportDto {}

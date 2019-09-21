export class CreateReportDto {
  readonly body: string;
  readonly week: number;
}

export class UpdateReportDto extends CreateReportDto {}

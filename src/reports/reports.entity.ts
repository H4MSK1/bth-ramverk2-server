import { Entity, ObjectIdColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['week'])
export class Report {
  @ObjectIdColumn()
  id: string;

  @Column()
  body: string;

  @Column()
  week: number;
}

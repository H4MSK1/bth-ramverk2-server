import { Entity, ObjectIdColumn, ObjectID, Column, Unique } from 'typeorm';

@Entity()
@Unique(['week'])
export class Report {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  body: string;

  @Column()
  week: number;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'numeric' })
  week: number;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric' })
  week: number;

  @Column({ type: 'text' })
  content: string;

  @Column()
  authorId: string;
}

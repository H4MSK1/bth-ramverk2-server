import { Entity, ObjectIdColumn, ObjectID, Column, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @ObjectIdColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  birthDate: string;
}

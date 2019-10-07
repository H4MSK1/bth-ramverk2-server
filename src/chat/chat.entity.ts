import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';

@Entity()
export class ChatMessage {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  message: string;

  @Column()
  userId: string;

  @Column()
  nickname: string;

  @Column()
  timestamp: number;

  @Column()
  isStatusMessage: boolean;
}

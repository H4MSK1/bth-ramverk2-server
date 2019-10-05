import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ChatMessage } from './chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly repository: MongoRepository<ChatMessage>,
  ) {}

  async findAll(): Promise<ChatMessage[]> {
    return await this.repository.find();
  }

  async truncate() {
    const entities = await this.findAll();
    if (entities.length) {
      await this.repository.clear();
    }
  }

  async create(
    message: string,
    nickname: string,
    userId: string,
    isStatusMessage: boolean = false,
  ): Promise<ChatMessage> {
    const chatMessage = new ChatMessage();
    chatMessage.message = message;
    chatMessage.nickname = nickname;
    chatMessage.userId = String(userId);
    chatMessage.isStatusMessage = isStatusMessage;
    chatMessage.timestamp = Date.now();

    return await this.repository.save(chatMessage);
  }
}

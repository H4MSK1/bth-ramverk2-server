import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatMessage } from './chat.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage])],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}

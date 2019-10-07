import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { IUser } from './interfaces';
import { SocketEvents } from './enums';

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: any;

  constructor(private readonly chatService: ChatService) {}

  async createAndBroadcastMessage(
    client: any,
    message: string,
    isStatusMessage: boolean = false,
  ) {
    const { userMetadata } = client;
    const messageEntity = await this.chatService.create(
      message,
      userMetadata.nickname,
      userMetadata.userId,
      isStatusMessage,
    );

    this.server.emit(SocketEvents.NEW_MESSAGE, messageEntity);
  }

  async handleDisconnect(socket: any) {
    const user: IUser = socket.userMetadata;
    if (!user) {
      return;
    }

    await this.createAndBroadcastMessage(
      socket,
      `${user.nickname} has left the chat`,
      true,
    );
  }

  @SubscribeMessage(SocketEvents.CHAT_HISTORY)
  async onChatHistory(client: any) {
    const messages = await this.chatService.findAll();
    client.emit(SocketEvents.CHAT_HISTORY, messages);
  }

  @SubscribeMessage(SocketEvents.JOIN)
  async onJoin(client: any, data: IUser) {
    client.userMetadata = data;

    await this.createAndBroadcastMessage(
      client,
      `${data.nickname} has joined the chat`,
      true,
    );
  }

  @SubscribeMessage(SocketEvents.NEW_MESSAGE)
  async onChat(client: any, data: { message: string }) {
    if (!data.message.trim().length) {
      return;
    }

    if (data.message === '!truncate') {
      await this.chatService.truncate();
      const messages = await this.chatService.findAll();
      this.server.emit(SocketEvents.CHAT_HISTORY, messages);
      return;
    }

    await this.createAndBroadcastMessage(client, data.message);
  }
}

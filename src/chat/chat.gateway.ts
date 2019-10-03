import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { IMessage } from './interfaces';
import { SocketEvents } from './enums';

const composeMessageSchema = (
  message: string,
  nickname: string,
  isStatusMessage = false,
): IMessage => ({
  message,
  nickname,
  isStatusMessage,
  timestamp: Date.now(),
});

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: any;
  messagesCache: Array<IMessage> = [];

  async handleDisconnect(socket) {
    const { nickname } = socket;
    if (!nickname) {
      return;
    }

    const message = composeMessageSchema(
      `${nickname} has left the chat`,
      nickname,
      true,
    );

    this.messagesCache.push(message);
    this.server.emit(SocketEvents.NEW_MESSAGE, message);
  }

  async handleNewMessage(client: any, message: IMessage) {
    this.messagesCache.push(message);
    client.broadcast.emit(SocketEvents.NEW_MESSAGE, message);
  }

  @SubscribeMessage(SocketEvents.JOIN)
  async onJoin(client: any, data: any) {
    const { nickname } = data;
    const message = composeMessageSchema(
      `${nickname} has joined the chat`,
      nickname,
      true,
    );

    client.nickname = nickname;
    this.messagesCache.push(message);
    client.broadcast.emit(SocketEvents.NEW_MESSAGE, message);
  }

  @SubscribeMessage(SocketEvents.CHAT_HISTORY)
  async onChatHistory(client: any) {
    client.emit(SocketEvents.CHAT_HISTORY, this.messagesCache);
  }

  @SubscribeMessage(SocketEvents.NEW_MESSAGE)
  async onChat(client: any, data: any) {
    if (!data.nickname || !data.nickname.trim().length) {
      return;
    }

    const message = composeMessageSchema(data.message, data.nickname);
    this.messagesCache.push(message);
    client.broadcast.emit(SocketEvents.NEW_MESSAGE, message);
  }
}

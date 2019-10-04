import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { IMessage, IUser } from './interfaces';
import { SocketEvents } from './enums';

const composeMessageSchema = (
  message: string,
  user: IUser,
  isStatusMessage = false,
): IMessage => ({
  message,
  user,
  isStatusMessage,
  timestamp: Date.now(),
});

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: any;
  messagesCache: Array<IMessage> = [];

  async handleNewMessage(message: IMessage) {
    this.messagesCache.push(message);
    this.server.emit(SocketEvents.NEW_MESSAGE, message);
  }

  async handleDisconnect(socket) {
    const user: IUser = socket.userMetadata;
    if (!user) {
      return;
    }

    const message = composeMessageSchema(
      `${user.nickname} has left the chat`,
      user,
      true,
    );

    this.handleNewMessage(message);
  }

  @SubscribeMessage(SocketEvents.CHAT_HISTORY)
  async onChatHistory(client: any) {
    client.emit(SocketEvents.CHAT_HISTORY, this.messagesCache);
  }

  @SubscribeMessage(SocketEvents.JOIN)
  async onJoin(client: any, data: IUser) {
    const message = composeMessageSchema(
      `${data.nickname} has joined the chat`,
      data,
      true,
    );

    client.userMetadata = data;
    this.handleNewMessage(message);
  }

  @SubscribeMessage(SocketEvents.NEW_MESSAGE)
  async onChat(client: any, data: any) {
    const { message = '' } = data;
    if (!message.trim().length) {
      return;
    }

    if (message === '!truncate') {
      this.messagesCache = [];
      this.server.emit(SocketEvents.CHAT_HISTORY, this.messagesCache);
      return;
    }

    this.handleNewMessage(composeMessageSchema(message, client.userMetadata));
  }
}

import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { WebsocketJwtGuard } from './ws.jwt.guard';
import { AuthService } from '../auth/auth.service';

const composeUserObj = ({ name, id }) => ({ name, id });
const composeMessageObj = (message: any, user: any): object => ({
  timestamp: Date.now(),
  message: message,
  user: composeUserObj(user),
});

@WebSocketGateway({
  origins: 'https://jsramverk.alburhan.se',
  serveClient: true,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: any;
  usersCount: number = 0;
  messages: Array<object> = [];

  constructor(private readonly authService: AuthService) {}

  async verifyTokenFromHandshake(socket: any) {
    if (!socket.handshake.query || !socket.handshake.query.token) {
      return;
    }
    const { token } = socket.handshake.query;
    return await this.authService.verifyToken(token);
  }

  async handleConnection(socket: any) {
    if (await this.verifyTokenFromHandshake(socket)) {
      this.usersCount++;
    }
    this.server.emit('users_count', this.usersCount);
  }

  async handleDisconnect(socket: any) {
    const user = await this.verifyTokenFromHandshake(socket);
    if (user) {
      this.server.emit('user_left', composeUserObj(user));
      this.usersCount--;
    }

    this.server.emit('users_count', this.usersCount);
  }

  @SubscribeMessage('join')
  async onJoin(client: any): Promise<any> {
    client.emit('chat_history', this.messages);

    const user = await this.verifyTokenFromHandshake(client);
    if (user) {
      client.broadcast.emit('user_joined', composeUserObj(user));
    }
  }

  @UseGuards(WebsocketJwtGuard)
  @SubscribeMessage('chat')
  async onChat(client: any, data: any) {
    const message = composeMessageObj(data.message, data.user);

    this.messages.push(message);
    client.broadcast.emit('chat', message);
  }
}

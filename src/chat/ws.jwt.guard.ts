import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class WebsocketJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const authToken = client.handshake.query.token;

    const user = await this.authService.verifyToken(authToken);

    context.switchToWs().getData().user = user;
    return Boolean(user);
  }
}

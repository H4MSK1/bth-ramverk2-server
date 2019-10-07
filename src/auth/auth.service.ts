import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compareHash, omit } from '../utils';
import { User } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmailWithPassword(username);
    if (user && (await compareHash(user.password, password))) {
      return omit(user, 'password');
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      userId: user.id,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token);
      return await this.usersService.findByID(payload.userId);
    } catch {
      return null;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compareHash, omit } from '../utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmailWithPassword(username);
    if (!user) {
      return false;
    }

    const isPasswordValid = await compareHash(user.password, password);
    if (!isPasswordValid) {
      return false;
    }

    return omit(user, 'password');
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      userId: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

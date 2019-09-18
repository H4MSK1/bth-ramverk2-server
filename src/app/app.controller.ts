import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  root(): string {
    return 'Hello World!';
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getCurrentUser(@Request() req): any {
    return req.user;
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }

  @Get('create')
  async createUser(): Promise<any> {
    const fakeData = {
      email: 'hello@world.com',
      name: 'Rocky Balboa',
      password: 'pass123',
      birthDate: '1990-01-01',
    };

    try {
      return await this.usersService.create(fakeData);
    } catch {
      return 'Email is already in use!';
    }
  }

  @Get('users')
  async getUsers(): Promise<any> {
    return await this.usersService.findAll();
  }
}

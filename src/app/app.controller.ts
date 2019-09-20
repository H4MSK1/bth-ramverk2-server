import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/users.dto';

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

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async createUser(@Body() userData: CreateUserDto) {
    try {
      return await this.usersService.create(userData);
    } catch {
      return 'Email is already in use!';
    }
  }

  @Get('users')
  async getUsers() {
    return await this.usersService.findAll();
  }
}

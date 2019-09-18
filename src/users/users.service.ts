import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { createHashFromString } from '../utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findOne(email: string): Promise<any> {
    return this.repository.findOne({ where: { email } });
  }

  async create(params): Promise<any> {
    const { name, email, password, birthDate } = params;

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = await createHashFromString(password);
    user.birthDate = birthDate;

    return await this.repository.save(user);
  }
}

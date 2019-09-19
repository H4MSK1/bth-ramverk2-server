import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { createHashFromString, omit } from '../utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const result: User[] = await this.repository.find();
    return result.map(user => omit(user, 'password'));
  }

  async findByID(id: any): Promise<User> {
    const result: User = await this.repository.findOne({ where: { id } });
    return omit(result, 'password');
  }

  async findOneByEmail(email: string): Promise<User> {
    const result: User = await this.repository.findOne({ where: { email } });
    return omit(result, 'password');
  }

  async findOneByEmailWithPassword(email: string): Promise<User> {
    return await this.repository.findOne({ where: { email } });
  }

  async create(params): Promise<any> {
    const { name, email, password, birthDate } = params;

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = await createHashFromString(password);
    user.birthDate = birthDate;

    return this.repository.save(user);
  }
}

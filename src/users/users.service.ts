import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './users.entity';
import { createHashFromString, omit } from '../utils';
import { CreateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: MongoRepository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const result: User[] = await this.repository.find();
    return result.map(user => omit(user, 'password'));
  }

  async findByID(id: any): Promise<User> {
    const result: User = await this.repository.findOne(id);
    return omit(result, 'password');
  }

  async findOneByEmail(email: string): Promise<User> {
    const result: User = await this.repository.findOne({ where: { email } });
    return omit(result, 'password');
  }

  async findOneByEmailWithPassword(email: string): Promise<User> {
    return await this.repository.findOne({ where: { email } });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const user = new User();
    user.name = userData.name;
    user.email = userData.email;
    user.password = await createHashFromString(userData.password);
    user.birthDate = userData.birthDate;

    const savedUser = await this.repository.save(user);
    return omit(savedUser, 'password');
  }
}

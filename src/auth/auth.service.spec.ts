import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import {
  getMockedUser,
  getMockedUserWithoutPassword,
} from '../users/users.mock';

jest.mock('../users/users.service');

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;
  let usersService: UsersService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        { provide: JwtService, useValue: { sign: jest.fn(entity => entity) } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return null with invalid username and password', async () => {
    jest
      .spyOn(usersService, 'findOneByEmailWithPassword')
      .mockResolvedValueOnce(await getMockedUser());

    const result = await service.validateUser('', '');
    expect(result).toBeNull();
  });

  it('should return user object with valid username and password', async () => {
    const testUser: User = await getMockedUser();

    jest
      .spyOn(usersService, 'findOneByEmailWithPassword')
      .mockResolvedValueOnce(testUser);

    const result = await service.validateUser('test@unit.local', 'pass1');
    expect(result).toEqual(await getMockedUserWithoutPassword());
  });

  it('should return [access_token] with payload', async () => {
    const { email, id }: User = await getMockedUser();

    const result = await service.login({ email, id });
    expect(result).toHaveProperty('access_token');
    expect(result.access_token).not.toBeNull();
  });
});

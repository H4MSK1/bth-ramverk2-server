import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';
import {
  getMockedUser,
  getMockedUserWithoutPassword,
} from '../users/users.mock';

describe('UsersService', () => {
  let repository: Repository<User>;
  let service: UsersService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return array of users without password for findAll', async () => {
    const testUser: User = await getMockedUserWithoutPassword();

    jest.spyOn(repository, 'find').mockResolvedValueOnce([testUser]);
    expect(await service.findAll()).toEqual([testUser]);
  });

  it('should return one user without password by ID', async () => {
    const testUser: User = await getMockedUserWithoutPassword();

    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(testUser);
    expect(await service.findByID(testUser.id)).toEqual(testUser);
  });

  it('should return one user without password by Email', async () => {
    const testUser: User = await getMockedUserWithoutPassword();

    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(testUser);
    expect(await service.findOneByEmail(testUser.email)).toEqual(testUser);
  });

  it('should return one user with password by Email', async () => {
    const testUser: User = await getMockedUser();

    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(testUser);

    const result = await service.findOneByEmailWithPassword(testUser.email);
    expect(result.password).toBeDefined();
    expect(result).toEqual(testUser);
  });

  it('should create new user and omit [password] from returned values', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@unit.local';
    dto.name = 'user1';
    dto.password = 'pass1';
    dto.birthDate = '1900-10-20';

    const testUser: User = await getMockedUserWithoutPassword();
    jest.spyOn(repository, 'save').mockResolvedValueOnce(testUser);

    const result = await service.create(dto);
    expect(result.id).toEqual(testUser.id);
    expect(result.email).toEqual(testUser.email);
    expect(result.name).toEqual(testUser.name);
    expect(result.birthDate).toEqual(testUser.birthDate);
    expect(result.password).toBeUndefined();
  });
});

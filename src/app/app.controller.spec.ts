import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { getMockedUserWithoutPassword } from '../users/users.mock';
import { CreateUserDto } from '../users/users.dto';

jest.mock('../auth/auth.service');
jest.mock('../users/users.service');

describe('AppController', () => {
  let controller: AppController;
  let module: TestingModule;
  let authService: AuthService;
  let usersService: UsersService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AuthService, UsersService],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  beforeEach(() => {
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('root', () => {
    it('should return content', () => {
      expect(controller.root()).not.toBeNull();
    });
  });

  describe('login', () => {
    it('should authenticate user and return access_token', async () => {
      jest
        .spyOn(authService, 'login')
        .mockResolvedValueOnce({ access_token: 'token' });

      const result = await controller.login({});
      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toEqual('token');
    });
  });

  describe('create', () => {
    it('should add user', async () => {
      const testUser = await getMockedUserWithoutPassword();
      const dto = new CreateUserDto();
      dto.name = 'user';
      dto.password = 'pass1';
      dto.email = 'user@unit.local';
      dto.birthDate = '1990-12-15';

      jest.spyOn(usersService, 'create').mockResolvedValueOnce(testUser);

      const result = await controller.createUser(dto);
      expect(result).toEqual(testUser);
    });

    it('should throw error if passing user email already exist', async () => {
      const testUser = await getMockedUserWithoutPassword();
      const dto = new CreateUserDto();
      dto.name = 'user';
      dto.password = 'pass1';
      dto.email = testUser.email;
      dto.birthDate = '1990-12-15';

      jest.spyOn(usersService, 'create').mockImplementation(async () => {
        throw new Error();
      });

      expect(await controller.createUser(dto)).toEqual(
        'Email is already in use!',
      );
    });
  });
});

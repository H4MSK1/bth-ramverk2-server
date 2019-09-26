import { User } from '../users/users.entity';
import { createHashFromString, omit } from '../utils';

export const getMockedUser = async (): Promise<User> => ({
  id: 'cea2de3e-d504-4575-a22c-b54b384d3d00',
  email: 'test@unit.local',
  name: 'user1',
  password: await createHashFromString('pass1'),
  birthDate: '1900-10-20',
});

export const getMockedUserWithoutPassword = async (): Promise<User> =>
  omit(await getMockedUser(), 'password');

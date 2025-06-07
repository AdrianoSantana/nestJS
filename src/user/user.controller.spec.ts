/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UserController;
  let mockUserService: Partial<UserService>;
  let mockAuthService: Partial<AuthService>;

  const user: User = {
    id: '9b193127-406a-49ac-854b-83f025c528f3',
    email: 'abcdef@gmail.com',
    password: 'hashedPass',
  };

  beforeEach(async () => {
    mockUserService = {
      findById: (id: string) => Promise.resolve(user),
      find: (email: string) => Promise.resolve([user]),
      delete: (id: string) => Promise.resolve(),
      update: (id: string, args: Partial<User>) => Promise.resolve(user),
    };

    mockAuthService = {
      //signUp: () => {},
      //signIn: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  describe('find All users', () => {
    it('find all returns a list of users', async () => {
      const result = await controller.getAll();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].email).toEqual('abcdef@gmail.com');
    });
  });
});

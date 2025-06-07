/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { CryptService } from '../common/bcrypt-service'; // caminho relativo
import { User } from './user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthUserDTO } from './dtos/auth-user.dto';

describe('AuthService', () => {
  let sut: AuthService;
  let mockUsersService: Partial<UserService>;
  let mockCryptService: Partial<CryptService>;

  const responseUser: User = {
    id: '2c67c253-328c-4ed2-993d-adc92515e8d9',
    email: 'user@mail.com',
    password: 'hashedPass',
  } as User;

  beforeEach(async () => {
    mockUsersService = {
      findOne: (email: string) => Promise.resolve(responseUser),
      createUser: (user: { email: string; password: string }) =>
        Promise.resolve(responseUser),
    };

    mockCryptService = {
      hash: (arg: string) => Promise.resolve('hashedPass'),
      compare: (arg: string, hash: string) =>
        Promise.resolve(arg === 'correctPassword'),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUsersService },
        { provide: CryptService, useValue: mockCryptService },
      ],
    }).compile();

    sut = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('authservice should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('Sign in', () => {
    it('should failed if user not exists', async () => {
      mockUsersService.findOne = (email: string) => Promise.resolve(null);
      const result = sut.signIn({
        email: 'usernotexists@mail.com',
        password: '123#321',
      });

      await expect(result).rejects.toEqual(
        new BadRequestException('error to sign in, verify your credentials'),
      );
    });

    it('should failed if passwords are not equal', async () => {
      const resultPromise = sut.signIn({
        email: 'user@mail.com',
        password: '123#321',
      });

      await expect(resultPromise).rejects.toEqual(
        new UnauthorizedException('error to sign in, verify your credentials'),
      );
    });

    it('should return success if has the same pass and user is valid', async () => {
      const result = await sut.signIn({
        email: 'user@mail.com',
        password: 'correctPassword',
      });

      expect(result).toEqual(responseUser);
    });
  });

  describe('Sign up', () => {
    let args: AuthUserDTO;

    beforeEach(() => {
      args = {
        email: 'user@mail.com',
        password: '123#321',
      };
    });
    it('should throws if email already in use', async () => {
      const resultPromise = sut.signUp(args);

      await expect(resultPromise).rejects.toThrow(
        new BadRequestException('email already in use'),
      );
    });

    it('Should create a user with hashed pass', async () => {
      mockUsersService.findOne = (email: string) => Promise.resolve(null);
      const result = await sut.signUp(args);

      expect(result.password).toEqual('hashedPass');
      expect(result.email).toEqual(args.email);
      expect(result.id).toBeDefined();
    });
  });
});

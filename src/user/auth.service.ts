import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CryptService } from '../common/bcrypt-service';
import { User } from './user.entity';
import { CreateUserDTO } from './dtos/create-user.dto';
import { AuthUserDTO } from './dtos/auth-user.dto';

@Injectable()
export class AuthService {
  private ERROR_TO_SIGN_IN: string =
    'error to sign in, verify your credentials';

  constructor(
    private readonly usersService: UserService,
    private readonly cryptService: CryptService,
  ) {}

  public async signUp(args: AuthUserDTO): Promise<User> {
    const userAlreadyExists = await this.usersService.findOne(args.email);
    if (userAlreadyExists) {
      throw new BadRequestException('email already in use');
    }

    const hashedPass = await this.cryptService.hash(args.password);
    const userToInsert: CreateUserDTO = {
      email: args.email,
      password: hashedPass,
    };

    return await this.usersService.createUser(userToInsert);
  }

  public async signIn(args: AuthUserDTO): Promise<User> {
    const user = await this.usersService.findOne(args.email);
    if (!user) {
      throw new BadRequestException(this.ERROR_TO_SIGN_IN);
    }

    const isValid = await this.cryptService.compare(
      args.password,
      user.password,
    );

    if (!isValid) {
      throw new UnauthorizedException(this.ERROR_TO_SIGN_IN);
    }

    return user;
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { User } from './user.entity';
import { GetUserDTO } from './dtos/get-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { AuthUserDTO } from './dtos/auth-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(GetUserDTO)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/whoami')
  public async whoAmI(@CurrentUser() user: User): Promise<User | null> {
    return user;
  }

  @Post('/signup')
  public async createUser(
    @Body() body: AuthUserDTO,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signUp(body);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  public async signIn(
    @Body() body: AuthUserDTO,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signIn(body);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  public async signOut(@Session() session: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    session.userId = null;
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  public async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDTO,
  ): Promise<User> {
    return await this.userService.update(id, body);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  public async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.userService.delete(id);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  public async getAll(@Query('email') email?: string): Promise<User[]> {
    return await this.userService.find(email);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  public async getById(@Param('id') id: string): Promise<User | null> {
    return await this.userService.findById(id);
  }
}

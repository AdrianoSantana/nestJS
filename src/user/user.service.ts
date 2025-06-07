import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dtos/create-user.dto';
import { CryptService } from '../common/bcrypt-service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly cryptService: CryptService,
  ) {}

  public async createUser(args: CreateUserDTO): Promise<User> {
    const userEntity = this.userRepository.create({
      email: args.email,
      password: args.password,
    });

    await this.userRepository.save(userEntity);

    return userEntity;
  }

  public async findOne(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  public async delete(id: string): Promise<void> {
    const storedUser = await this.findUserById(id);
    await this.userRepository.remove(storedUser);
  }

  public async update(id: string, args: Partial<User>): Promise<User> {
    const storedUser = await this.findUserById(id);

    let hashedPass = storedUser.password;

    if (args.password) {
      hashedPass = await this.cryptService.hash(args.password);
    }

    Object.assign(storedUser, { ...args, password: hashedPass });

    await this.userRepository.save(storedUser);

    return storedUser;
  }

  public async find(email?: string): Promise<User[]> {
    const result = await this.userRepository.find({ where: { email } });

    return result;
  }

  public async findById(id: string): Promise<User | null> {
    if (!id) {
      return null;
    }
    return await this.findUserById(id);
  }

  private async findUserById(id: string): Promise<User> {
    const storedUser = await this.userRepository.findOne({ where: { id } });

    if (storedUser == null) {
      throw new NotFoundException('User not found');
    }

    return storedUser;
  }
}

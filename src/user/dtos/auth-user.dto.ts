import { IsEmail, IsString } from 'class-validator';

export class AuthUserDTO {
  @IsEmail()
  email: string;

  @IsString({ message: 'Digite uma senha válida.' })
  password: string;
}

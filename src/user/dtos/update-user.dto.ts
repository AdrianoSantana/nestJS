import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString({ message: 'Digite uma senha válida.' })
  password?: string;
}

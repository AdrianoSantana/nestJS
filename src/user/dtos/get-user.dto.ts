import { Expose } from 'class-transformer';

export class GetUserDTO {
  @Expose()
  id: string;

  @Expose()
  email: string;
}

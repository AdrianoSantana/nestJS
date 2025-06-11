import { Expose, Transform } from 'class-transformer';

export class GetUserDTO {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  isAdmin: boolean
}

import { Exclude, Expose } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  access_token: string;
}

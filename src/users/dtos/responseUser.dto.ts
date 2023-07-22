import { Exclude, Expose } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude() // hidden
  password: string;

  @Expose()
  access_token: string;

  @Expose()
  refresh_token: string;
}

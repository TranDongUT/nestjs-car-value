import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @MinLength(6)
  @IsOptional()
  password: string;
}

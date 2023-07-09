import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto';

@Controller('auth')
export class UserController {
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    console.log(body);
    console.log('signup success');
  }
}

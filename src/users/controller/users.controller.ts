import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from '../dtos/createUser.dto';
import { ResponseUserDto } from '../dtos/responseUser.dto';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { UsersService } from './../services/users.service';

@Controller('auth')
@Serialize(ResponseUserDto)
export class UserController {
  constructor(private UsersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.UsersService.create(body.email, body.password);
  }

  @Get('/:id')
  // @Serialize(AuthDto) exp
  // @Serialize(OtherDto) exp
  async findUser(@Param('id') id: string) {
    const user = await this.UsersService.findOne(id);
    return user;
  }

  @Get()
  findAllUser(@Query('email') email: string) {
    return this.UsersService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.UsersService.update(id, body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.UsersService.remove(id);
  }
}

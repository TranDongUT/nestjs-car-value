import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/dercorators/currentUser.decorator';
import { Roles } from 'src/dercorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guards/role.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from '../dtos/createUser.dto';
import { ResponseUserDto } from '../dtos/responseUser.dto';
import { UpdateUserDto } from '../dtos/updateUser.dto';

import { UserEntity } from '../user.entity';
import { UsersService } from './../services/users.service';
import { AuthService } from '../services/auth.service';

@Controller('auth')
@Serialize(ResponseUserDto)
export class UserController {
  constructor(
    private UsersService: UsersService,
    private AuthService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.AuthService.signup(body.email, body.password);
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto) {
    const user = await this.AuthService.signin(body.email, body.password);
    return user;
  }

  @Get('/infor')
  getAuthInfor(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Post('/refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.AuthService.refreshToken(refreshToken);
  }

  @Post('/signout')
  signout(@Body('refreshToken') refreshToken: string) {
    return this.AuthService.signout(refreshToken);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.UsersService.findOne(id);
    return user;
  }

  @Get()
  findAllUser(@Query('email') email: string) {
    return this.UsersService.find(email);
  }

  @Patch('/:id')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.UsersService.update(id, body);
  }

  @Delete('/:id')
  // authorization: ONLY ADMIN
  @Roles(Role.ADMIN)
  removeUser(@Param('id') id: string) {
    return this.UsersService.remove(id);
  }
}

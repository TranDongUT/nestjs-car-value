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
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/dercorators/currentUser.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from '../dtos/createUser.dto';
import { ResponseUserDto } from '../dtos/responseUser.dto';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { AuthService } from '../services/auth.service';
import { UsersService } from './../services/users.service';
import { CurrentUserInterceptor } from '../interceptors/currentUser.interceptor';
import { UserEntity } from '../user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(ResponseUserDto)
export class UserController {
  constructor(
    private UsersService: UsersService,
    private AuthService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.AuthService.signup(body.email, body.password);
    // attach session
    // session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto) {
    const user = await this.AuthService.signin(body.email, body.password);
    // attach session
    // session.userId = user.id;
    return user;
  }

  @Post('/infor')
  @UseGuards(AuthGuard)
  getAuthInfor(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async findUser(@Param('id') id: string) {
    const user = await this.UsersService.findOne(id);
    return user;
  }

  @Get()
  @UseGuards(AuthGuard)
  findAllUser(@Query('email') email: string) {
    return this.UsersService.find(email);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.UsersService.update(id, body);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  removeUser(@Param('id') id: string) {
    return this.UsersService.remove(id);
  }
}

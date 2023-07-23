import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UserController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { CurrentUserInterceptor } from './interceptors/currentUser.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthService } from './services/auth.service';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TokensModule],
  providers: [
    UsersService,
    AuthService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CurrentUserInterceptor,
    // },
  ],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}

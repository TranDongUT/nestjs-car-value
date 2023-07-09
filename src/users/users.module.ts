import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UserController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService],
  controllers: [UserController],
})
export class UsersModule {}

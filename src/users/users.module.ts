import { Module } from '@nestjs/common';
import { ServicesService } from './services/services.service';
import { UserController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [ServicesService],
  controllers: [UserController],
})
export class UsersModule {}

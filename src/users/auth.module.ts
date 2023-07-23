import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './services/auth.service';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [UsersModule],
})
export default class AuthModule {}

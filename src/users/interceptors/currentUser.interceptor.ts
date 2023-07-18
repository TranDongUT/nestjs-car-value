import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './../services/users.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    // for request - context value is before going to control handler
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      //  add to request a property currentUser -> go to controller handle
      request.currentUser = { ...payload, role: 'GUEST' }; // role: for TEST
    } catch (error) {
      throw new UnauthorizedException();
    }

    return next.handle();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

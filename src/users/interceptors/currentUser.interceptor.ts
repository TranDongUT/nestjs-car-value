import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from './../services/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    // for request - context value is before going to control handler
    const request = context.switchToHttp().getRequest();

    const { userId } = request.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);
      //  add to request a property currentUser -> go to controller handle
      request.currentUser = user;
    }

    return next.handle();
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/dercorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // define what role which this route require
    const rolesRequire = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!rolesRequire) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { id } = request.user;
    const currentRole = (await this.usersService.findOne(id)).role;

    return rolesRequire.some((role) => role === currentRole);
  }
}

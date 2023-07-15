import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/dercorators/role.decorator';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // define what role which this route require
    const rolesRequire = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!rolesRequire) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { role: userRoles } = request.user;
    // console.log(userRoles);
    // console.log(rolesRequire);

    return rolesRequire.some((role) => role === userRoles);
  }
}

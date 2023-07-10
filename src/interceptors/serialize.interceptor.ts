import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable, map } from 'rxjs';
import { ResponseUserDto } from 'src/users/dtos/responseUser.dto';

// validate type is class for Serialize
interface ClassContructor {
  new (...agrs: any);
}

export function Serialize(dto: ClassContructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassContructor) {}

  intercept(
    // for request
    context: ExecutionContext,
    // for response
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: ClassContructor) => {
        return plainToClass(this.dto, data, {
          // false -> response all
          // true -> response only properties have @Expose
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

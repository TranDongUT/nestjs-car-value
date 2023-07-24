import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './middlewares/authen.middleware';
import { ReportController } from './reports/controllers/report.controller';
import { ReportEntity } from './reports/report.entity';
import { UserEntity } from './users/user.entity';
import { TokensModule } from './tokens/tokens.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // typeORM
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [UserEntity, ReportEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),

    // modules
    UsersModule,
    ReportsModule,
    TokensModule,

    // config enviroment variable
    ConfigModule.forRoot(),

    // config jwt
    JwtModule.register({
      global: true,
      secret: process.env.SECERT_JWT,
      signOptions: { expiresIn: '10m' },
    }),

    // rate limit
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'auth/:id', method: RequestMethod.PATCH },
        { path: 'auth/infor', method: RequestMethod.GET },
        { path: 'auth/:id', method: RequestMethod.DELETE },
        ReportController,
      );
  }
}

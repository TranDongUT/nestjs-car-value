import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/user.entity';
import { ReportEntity } from './reports/report.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './middlewares/authen.middleware';
import { ReportController } from './reports/controllers/report.controller';

@Module({
  imports: [
    // typeORM
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [UserEntity, ReportEntity],
      synchronize: true,
    }),

    // modules
    UsersModule,
    ReportsModule,

    // config enviroment variable
    ConfigModule.forRoot(),

    // config jwt
    JwtModule.register({
      global: true,
      secret: process.env.SECERT_JWT,
      signOptions: { expiresIn: '600s' },
    }),
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

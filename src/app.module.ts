import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './middlewares/authen.middleware';
import { ReportController } from './reports/controllers/report.controller';
import { ReportEntity } from './reports/report.entity';
import { UserEntity } from './users/user.entity';
import { TokensModule } from './tokens/tokens.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TokenEntity } from './tokens/token.entity';

@Module({
  imports: [
    // config enviroment variable
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),

    // typeORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        database: config.get<string>('MYSQL_DATABASE'),
        username: config.get<string>('MYSQL_USER'),
        password: config.get<string>('MYSQL_PASSWORD'),
        synchronize: true,
        autoLoadEntities: true,
        entities: [UserEntity, ReportEntity, TokenEntity],
      }),
    }),

    // modules
    UsersModule,
    ReportsModule,
    TokensModule,

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

import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import * as Joi from 'joi';
import { AtGuard } from './common/guards';
import { ReqLoggingInterceptor } from './common/interceptors';
import User from './user/entities/user.entity';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { WeatherModule } from './weather/weather.module';
import { MailerModule } from './mailer/mailer.module';
import {
  MailerOptions,
  MailerModule as NestMailerModule,
} from '@nestjs-modules/mailer';
import { GalleryModule } from './gallery/gallery.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),

        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.number().port().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),

        ACCESS_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 5,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User],
        synchronize: true,
      }),
    }),
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MailerOptions => {
        return {
          transport: {
            host: configService.get<string>('MAIL_HOST'),
            secure: false,
            auth: {
              user: configService.get<string>('MAIL_USERNAME'),
              pass: configService.get<string>('MAIL_PASSWORD'),
            },
            defaults: {
              from: '"Your Service Name" <mrvorobetso228@gmail.com>',
            },
          },
        } as MailerOptions;
      },
    }),

    AuthModule,
    UserModule,
    WeatherModule,
    MailerModule,
    GalleryModule,
    FirebaseModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    { provide: APP_GUARD, useClass: AtGuard },
    { provide: APP_INTERCEPTOR, useClass: ReqLoggingInterceptor },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}

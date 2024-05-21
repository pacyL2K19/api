import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './logger/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './environment/mongo-config.service';
import { UserModule } from './user/user.module';
import { GithubModule } from './github/github.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 100, ttl: 1 }],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    GithubModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}

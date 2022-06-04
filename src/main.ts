import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as RedisStoreFactory from 'connect-redis';
import Redis from 'ioredis';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const RedisStore = RedisStoreFactory(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    session({
      store: new RedisStore({
        client: new Redis(process.env.REDIS_CONNECTION_STRING),
      }),
      secret: process.env.SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(3000);
}
bootstrap();

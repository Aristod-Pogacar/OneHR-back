import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { UserRole } from './users/entities/user.entity';
import { NotFoundFilter } from './common/filters/not-found/not-found.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    session({
      secret: 'avahelanehufahealfaecyakjkefhjayebfkzrghfycbkzgfczb;vjdkvtqfqjvnlcqgefkqkdjfqgsfyukgqkdjjcnqkfyu',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        // maxAge: 1000 * 60 * 60,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use((req, res, next) => {
    res.locals.UserRole = UserRole;
    next();
  });

  app.useGlobalFilters(new NotFoundFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

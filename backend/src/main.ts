import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? '*',
  });
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`EYFI leaderboard API listening on :${port}`);
}
await bootstrap();

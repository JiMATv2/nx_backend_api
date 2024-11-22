import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    credentials: true, // Allow cookies and other credentials
  });
  await app.listen(3001); // Set backend port
}
bootstrap();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { WebhookController } from './webhook/webhook.controller';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    JwtModule.register({
      secret: 'your_secret_key', // Replace with your secret key
      signOptions: { expiresIn: '1h' }, // Token expiration
  }),
  ],
  controllers: [AppController, WebhookController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { MetricsModule } from './metrics/metrics.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MetricsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

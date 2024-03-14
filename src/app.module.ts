import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { MetricsModule } from './metrics/metrics.module';
import { ClickhouseModule } from './clickhouse/clickhouse.module';

@Module({
  imports: [MetricsModule, ClickhouseModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

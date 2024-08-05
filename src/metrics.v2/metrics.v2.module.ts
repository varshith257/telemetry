import { Module } from '@nestjs/common';
import { MetricsV2Service } from './metrics.v2.service';
import { MetricsV2Controller } from './metrics.v2.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MetricsV2Controller],
  providers: [MetricsV2Service, PrismaService],
})
export class MetricsV2Module {}

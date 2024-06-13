import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MetricsV1Controller } from './metrics.v1.controller';
import { MetricsService } from './metrics.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TELEMETRY_BROKER, TELEMETRY_QUEUE } from 'src/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: TELEMETRY_BROKER,
        transport: Transport.RMQ,
        options: {
          urls: [ process.env.BROKER_URL ],
          queue: TELEMETRY_QUEUE,
          queueOptions: {
            durable: true
          }
        }
      }
    ])
  ],
  controllers: [MetricsV1Controller],
  providers: [MetricsService, PrismaService],
})
export class MetricsModule {}

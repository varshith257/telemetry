import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as multipart from 'fastify-multipart';
import { ResponseFormatInterceptor } from '@samagra-x/stencil';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // bind pipes and interceptors
  await app.register(multipart);
  // app.useGlobalInterceptors(new ResponseFormatInterceptor()); // response-formatting out of the box
  new ValidationPipe({
    transform: true,
  }),

  // start the server
  await app.listen(3000);
}
bootstrap();

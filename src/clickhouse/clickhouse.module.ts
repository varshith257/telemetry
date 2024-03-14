import { Module } from '@nestjs/common';
import { ClickHouse } from 'clickhouse';

@Module({
  providers: [
    {
      provide: 'CLICKHOUSE_CONNECTION',
      useFactory: async () => {
        const connection = new ClickHouse({
          url: 'http://localhost',
          port: 19000,
          basicAuth: null,
        });

        return connection;
      },
    },
  ],
  exports: ['CLICKHOUSE_CONNECTION'],
})
export class ClickhouseModule { }

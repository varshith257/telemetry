import { Test, TestingModule } from '@nestjs/testing';
import { MetricsV2Controller } from './metrics.v2.controller';
import { MetricsV2Service } from './metrics.v2.service';

describe('MetricsV2Controller', () => {
  let controller: MetricsV2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsV2Controller],
      providers: [MetricsV2Service],
    }).compile();

    controller = module.get<MetricsV2Controller>(MetricsV2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
});

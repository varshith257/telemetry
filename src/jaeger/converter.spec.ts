import { Test, TestingModule } from '@nestjs/testing';
import {
  convertToOTelTelemetry,
  InternalTelemetryEvent,
  OTelEvent,
} from './convertor';

describe('TelemetryConverter', () => {
  let converterFunction: (internalEvent: InternalTelemetryEvent) => OTelEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();

    converterFunction = convertToOTelTelemetry;
  });

  it('convert a internal telemetry event to OTEL format', () => {
    const internalTelemetryEvent: InternalTelemetryEvent = {
      generator: 'akai',
      version: '0.0.1',
      timestamp: 1713943647,
      actorId: '550e8400-e29b-41d4-a716-446655440000',
      actorType: 'user',
      env: 'prod',
      eventId: 'E001',
      event: 'speechToText',
      subEvent: 'receivedAudio',
      eventData: {
        botId: '550e8400-e29b-41d4-a716-446655440000',
        orgId: '550e8400-e29b-41d4-a716-446655440000',
        createdAt: 1713943647,
        audioUrl:
          'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        audioId: '550e8400-e29b-41d4-a716-446655440000',
        language: 'en',
        conversationId: '550e8400-e29b-41d4-a716-446655440000',
        messageId: '550e8400-e29b-41d4-a716-446655440000',
      },
    };

    const expectedOTelEvent: OTelEvent = {
      resource: {
        attributes: {
          'service.name': 'akai',
          'service.version': '0.0.1',
          environment: 'prod',
          'user.id': '550e8400-e29b-41d4-a716-446655440000',
          'user.type': 'user',
          'device.id': undefined,
        },
      },
      events: [
        {
          name: 'speechToText',
          time: 1713943647,
          attributes: {
            'event.id': 'E001',
            subEvent: 'receivedAudio',
            timeElapsed: undefined,
            botId: '550e8400-e29b-41d4-a716-446655440000',
            orgId: '550e8400-e29b-41d4-a716-446655440000',
            createdAt: 1713943647,
            audioUrl:
              'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
            audioId: '550e8400-e29b-41d4-a716-446655440000',
            language: 'en',
            conversationId: '550e8400-e29b-41d4-a716-446655440000',
            messageId: '550e8400-e29b-41d4-a716-446655440000',
          },
        },
      ],
    };

    const result = converterFunction(internalTelemetryEvent);
    expect(result).toEqual(expectedOTelEvent);
  });
});

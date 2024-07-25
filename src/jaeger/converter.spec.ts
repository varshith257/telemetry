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

  it('should convert a internal telemetry event to OTEL format', () => {
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

  it('should handle missing optional fields gracefully', () => {
    const internalTelemetryEvent: InternalTelemetryEvent = {
      generator: 'akai',
      version: '0.0.1',
      timestamp: 1713943647,
      actorId: '550e8400-e29b-41d4-a716-446655440000',
      actorType: 'user',
      env: 'prod',
      eventId: 'E003',
      event: 'logout',
      subEvent: 'complete',
      eventData: {
        reason: 'user_initiated',
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
          name: 'logout',
          time: 1713943647,
          attributes: {
            'event.id': 'E003',
            subEvent: 'complete',
            timeElapsed: undefined,
            reason: 'user_initiated',
          },
        },
      ],
    };

    const result = converterFunction(internalTelemetryEvent);
    expect(result).toEqual(expectedOTelEvent);
  });

  it('should convert eventData fields correctly', () => {
    const internalTelemetryEvent: InternalTelemetryEvent = {
      generator: 'akai',
      version: '0.0.1',
      timestamp: 1713943647,
      actorId: '550e8400-e29b-41d4-a716-446655440000',
      actorType: 'user',
      env: 'prod',
      eventId: 'E004',
      event: 'purchase',
      subEvent: 'complete',
      eventData: {
        productId: '12345',
        amount: 99.99,
        currency: 'USD',
        transactionId: 'tx1234567890',
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
          name: 'purchase',
          time: 1713943647,
          attributes: {
            'event.id': 'E004',
            subEvent: 'complete',
            timeElapsed: undefined,
            productId: '12345',
            amount: 99.99,
            currency: 'USD',
            transactionId: 'tx1234567890',
          },
        },
      ],
    };

    const result = converterFunction(internalTelemetryEvent);
    expect(result).toEqual(expectedOTelEvent);
  });

  it('should handle empty eventData object', () => {
    const internalTelemetryEvent: InternalTelemetryEvent = {
      generator: 'akai',
      version: '0.0.1',
      timestamp: 1713943647,
      actorId: '550e8400-e29b-41d4-a716-446655440000',
      actorType: 'user',
      env: 'prod',
      eventId: 'E005',
      event: 'heartbeat',
      subEvent: 'ping',
      eventData: {},
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
          name: 'heartbeat',
          time: 1713943647,
          attributes: {
            'event.id': 'E005',
            subEvent: 'ping',
            timeElapsed: undefined,
          },
        },
      ],
    };

    const result = converterFunction(internalTelemetryEvent);
    expect(result).toEqual(expectedOTelEvent);
  });

  it('should handle different data types in eventData correctly', () => {
    const internalTelemetryEvent: InternalTelemetryEvent = {
      generator: 'akai',
      version: '0.0.1',
      timestamp: 1713943647,
      actorId: '550e8400-e29b-41d4-a716-446655440000',
      actorType: 'user',
      env: 'prod',
      eventId: 'E006',
      event: 'feedback',
      subEvent: 'submit',
      eventData: {
        rating: 4.5,
        comments: 'Great service!',
        tags: ['service', 'quality'],
        metadata: {
          key1: 'value1',
          key2: 'value2',
        },
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
          name: 'feedback',
          time: 1713943647,
          attributes: {
            'event.id': 'E006',
            subEvent: 'submit',
            timeElapsed: undefined,
            rating: 4.5,
            comments: 'Great service!',
            tags: ['service', 'quality'],
            metadata: {
              key1: 'value1',
              key2: 'value2',
            },
          },
        },
      ],
    };

    const result = converterFunction(internalTelemetryEvent);
    expect(result).toEqual(expectedOTelEvent);
  });

  it('should throw an error for invalid event data', () => {
    const invalidInternalTelemetryEvent: InternalTelemetryEvent = {
      generator: 'akai',
      version: '0.0.1',
      timestamp: 1713943647,
      actorId: '550e8400-e29b-41d4-a716-446655440000',
      actorType: 'user',
      env: 'prod',
      eventId: 'E007',
      event: 'invalidEvent',
      subEvent: 'invalidSubEvent',
      eventData: {
        invalidField: undefined,
      },
    };

    expect(() => converterFunction(invalidInternalTelemetryEvent)).toThrow();
  });
});

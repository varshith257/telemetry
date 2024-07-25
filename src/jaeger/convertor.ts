// BHASAI Internal Telemetry Event Interface
interface InternalTelemetryEvent {
  generator: string;
  version: string;
  timestamp: number;
  actorId: string;
  actorType: string;
  sessionId?: string;
  deviceId?: string;
  env: string;
  eventId: string;
  event: string;
  subEvent: string;
  timeElapsed?: number;
  eventData: any;
}

// OTEL Event Interface
interface OTelEvent {
  resource: {
    attributes: {
      'service.name': string;
      'service.version': string;
      environment: string;
      'user.id': string;
      'user.type': string;
      'device.id'?: string;
      [key: string]: any;
    };
  };
  events: {
    name: string;
    time: number;
    attributes: {
      'event.id': string;
      [key: string]: any;
    };
  }[];
}

function convertToOTelTelemetry(
  internalEvent: InternalTelemetryEvent,
): OTelEvent {
  // OTEL event structure
  const otelEvent: OTelEvent = {
    resource: {
      attributes: {
        'service.name': internalEvent.generator,
        'service.version': internalEvent.version,
        environment: internalEvent.env,
        'user.id': internalEvent.actorId,
        'user.type': internalEvent.actorType,
        'device.id': internalEvent.deviceId || undefined,
      },
    },
    events: [
      {
        name: internalEvent.event,
        time: internalEvent.timestamp,
        attributes: {
          'event.id': internalEvent.eventId,
          subEvent: internalEvent.subEvent,
          timeElapsed: internalEvent.timeElapsed || undefined,
        },
      },
    ],
  };

  const eventData = internalEvent.eventData;

  for (const key in eventData) {
    if (eventData.hasOwnProperty(key)) {
      otelEvent.events[0].attributes[key] = eventData[key];
    }
  }
  return otelEvent;
}

export { OTelEvent, InternalTelemetryEvent, convertToOTelTelemetry };

// // Example internal telemetry event
// const internalTelemetryEvent: InternalTelemetryEvent = {
//   generator: 'akai',
//   version: '0.0.1',
//   timestamp: 1713943647,
//   actorId: '123456',
//   actorType: 'user',
//   env: 'prod',
//   eventId: 'E001',
//   event: 'speechToText',
//   subEvent: 'receivedAudio',
//   eventData: {
//     botId: '550e8400-e29b-41d4-a716-446655440000',
//     orgId: '550e8400-e29b-41d4-a716-446655440000',
//     createdAt: 1713943647,
//     audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
//     audioId: '550e8400-e29b-41d4-a716-446655440000',
//     language: 'en',
//     conversationId: '550e8400-e29b-41d4-a716-446655440000',
//     messageId: '550e8400-e29b-41d4-a716-446655440000',
//   },
// };

// // Convert to simplified OTEL traces schema
// const otelEvent: OTelEvent = convertToOTelTelemetry(internalTelemetryEvent);

// // Print converted event
// console.log(JSON.stringify(otelEvent, null, 2));

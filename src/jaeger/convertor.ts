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
  if (!internalEvent) {
    throw new Error('Missing required fields in internal telemetry event');
  }

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
      if (eventData[key] === undefined || eventData[key] === null) {
        throw new Error(`Invalid data: ${key} is undefined or null`);
      }
      otelEvent.events[0].attributes[key] = eventData[key];
    }
  }
  return otelEvent;
}

export { OTelEvent, InternalTelemetryEvent, convertToOTelTelemetry };

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

  switch (internalEvent.event) {
    case 'speechToText':
      if (internalEvent.subEvent === 'receivedAudio') {
        otelEvent.events[0].attributes['botId'] = eventData.botId;
        otelEvent.events[0].attributes['orgId'] = eventData.orgId;
        otelEvent.events[0].attributes['audioUrl'] = eventData.audioUrl;
        otelEvent.events[0].attributes['audioId'] = eventData.audioId;
        otelEvent.events[0].attributes['language'] = eventData.language;
        otelEvent.events[0].attributes['conversationId'] =
          eventData.conversationId;
        otelEvent.events[0].attributes['messageId'] = eventData.messageId;
        otelEvent.events[0].attributes['createdAt'] = eventData.createdAt;
      } else if (internalEvent.subEvent === 'speechToTextResponse') {
        otelEvent.events[0].attributes['text'] = eventData.text;
        otelEvent.events[0].attributes['spellCorrectedText'] =
          eventData.spellCorrectedText;
        otelEvent.events[0].attributes['error'] = eventData.error;
        otelEvent.events[0].attributes['timeTaken'] = eventData.timeTaken;
        otelEvent.events[0].attributes['spellCheckTimeTaken'] =
          eventData.spellCheckTimeTaken;
        otelEvent.events[0].attributes['phoneNumber'] = eventData.phoneNumber;
        otelEvent.events[0].attributes['queryId'] = eventData.queryId;
        otelEvent.events[0].attributes['language'] = eventData.language;
      }
      break;
    case 'userQuery':
      if (internalEvent.subEvent === 'incomingMessage') {
        otelEvent.events[0].attributes['text'] = eventData.text;
        otelEvent.events[0].attributes['mediaIds'] = eventData.mediaIds;
        otelEvent.events[0].attributes['phoneNumber'] = eventData.phoneNumber;
        otelEvent.events[0].attributes['did'] = eventData.did;
        otelEvent.events[0].attributes['createdAt'] = eventData.createdAt;
      } else if (internalEvent.subEvent === 'userHistory') {
        otelEvent.events[0].attributes['userHistory'] = eventData.userHistory;
        otelEvent.events[0].attributes['timeTaken'] = eventData.timeTaken;
        otelEvent.events[0].attributes['createdAt'] = eventData.createdAt;
        otelEvent.events[0].attributes['did'] = eventData.did;
      } else if (internalEvent.subEvent === 'userInfo') {
        otelEvent.events[0].attributes['text'] = eventData.text;
        otelEvent.events[0].attributes['error'] = eventData.error;
        otelEvent.events[0].attributes['timeTaken'] = eventData.timeTaken;
        otelEvent.events[0].attributes['createdAt'] = eventData.createdAt;
        otelEvent.events[0].attributes['queryId'] = eventData.queryId;
        otelEvent.events[0].attributes['block'] = eventData.block;
        otelEvent.events[0].attributes['district'] = eventData.district;
        otelEvent.events[0].attributes['eventLog'] = eventData.eventLog;
        otelEvent.events[0].attributes['transformerId'] =
          eventData.transformerId;
      }
      break;
  }

  return otelEvent;
}

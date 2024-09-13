import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Function to send OTEL event to the OTEL Collector
async function sendToOTelCollector(otelEvent: OTelEvent) {
  try {
    const url = 'http://localhost:4317/v1/traces';
    console.log(JSON.stringify(otelEvent, null, 2));

    await axios.post(url, otelEvent, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });

    console.log('Event sent successfully');
  } catch (error) {
    console.error('Error sending event to OTEL Collector', error);
  }
}

interface SpanContext {
  traceId: string;
  spanId: string;
}

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

// Function to sanitize the sessionId and ensure it is a valid 32-character hexadecimal string
function sanitizeTraceId(sessionId: string): string {
  const sanitized = sessionId.replace(/[^a-f0-9]/gi, '');
  return sanitized.padEnd(32, '0').substring(0, 32);
}

// Function to sanitize the spanId (16-character hexadecimal)
function sanitizeSpanId(spanId: string): string {
  const sanitized = spanId.replace(/[^a-f0-9]/gi, '');
  return sanitized.padEnd(16, '0').substring(0, 16);
}

function getOrGenerateSpanContext(sessionId?: string): SpanContext {
  const traceId = sessionId ? sanitizeTraceId(sessionId) : uuidv4().replace(/-/g, ''); // Generate new or sanitize sessionId
  const spanId = sanitizeSpanId(uuidv4().replace(/-/g, '')); // Generate a sanitized spanId
  return {
    traceId,
    spanId,
  };
}

// OTEL Event Interface
interface OTelEvent {
  resourceSpans: {
    resource: {
      attributes: {
        key: string;
        value: { stringValue: string };
      }[];
    };
    scopeSpans: {
      scope: {
        name: string;
        version: string;
      };
      spans: {
        traceId: string;
        spanId: string;
        name: string;
        startTimeUnixNano: number;
        endTimeUnixNano: number;
        attributes: {
          key: string;
          value: { stringValue?: string; intValue?: number };
        }[];
      }[];
    }[];
  }[];
}

async function convertToOTelTelemetry(
  internalEvent: InternalTelemetryEvent,
): Promise<OTelEvent> {
  if (!internalEvent) {
    throw new Error('Missing required fields in internal telemetry event');
  }

  const { traceId, spanId } = getOrGenerateSpanContext(internalEvent.sessionId);

  // OTEL event structure
  const otelEvent: OTelEvent = {
    resourceSpans: [
      {
        resource: {
          attributes: [
            {
              key: 'service.name',
              value: { stringValue: internalEvent.generator },
            },
            {
              key: 'service.version',
              value: { stringValue: internalEvent.version },
            },
            { key: 'environment', value: { stringValue: internalEvent.env } },
            { key: 'user.id', value: { stringValue: internalEvent.actorId } },
            {
              key: 'user.type',
              value: { stringValue: internalEvent.actorType },
            },
            {
              key: 'device.id',
              value: { stringValue: internalEvent.deviceId || '' },
            },
          ],
        },
        scopeSpans: [
          {
            scope: {
              name: 'internal-telemetry-library',
              version: '1.0.0',
            },
            spans: [
              {
                traceId,
                spanId,
                name: internalEvent.event,
                startTimeUnixNano: internalEvent.timestamp * 1_000_000,
                endTimeUnixNano:
                  (internalEvent.timestamp + (internalEvent.timeElapsed || 0)) *
                  1_000_000,
                attributes: [
                  {
                    key: 'event.id',
                    value: { stringValue: internalEvent.eventId },
                  },
                  {
                    key: 'subEvent',
                    value: { stringValue: internalEvent.subEvent },
                  },
                  {
                    key: 'timeElapsed',
                    value: { intValue: internalEvent.timeElapsed || 0 },
                  },
                  // Spread internalEvent.eventData as key-value pairs
                  ...Object.entries(internalEvent.eventData).map(([k, v]) => ({
                    key: k,
                    value:
                      typeof v === 'number'
                        ? { intValue: v }
                        : { stringValue: v?.toString() || '' },
                  })),
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const eventData = internalEvent.eventData;

  for (const key in eventData) {
    if (eventData.hasOwnProperty(key)) {
      if (eventData[key] === undefined || eventData[key] === null) {
        throw new Error(`Invalid data: ${key} is undefined or null`);
      }
      otelEvent.resourceSpans[0].scopeSpans[0].spans[0].attributes[key] =
        eventData[key];
    }
  }

  await sendToOTelCollector(otelEvent);

  return otelEvent;
}

export { OTelEvent, InternalTelemetryEvent, convertToOTelTelemetry };

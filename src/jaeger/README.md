# Telemetry Converter

## Overview

This telemetry converter transforms internal BHASAI telemetry events into the OpenTelemetry (OTEL) format. This conversion enables integration with observability tools like Jaeger for monitoring and tracing.

## Approach

The convertToOTelTelemetry function of convertor performs validation to ensure that the InternalBHASAITelemetryEvent object contains all required fields and that they are properly formatted. If the object is missing fields or contains invalid data, an error is thrown.

### Validation Rules:

The InternalBHASAITelemetryEvent must contain `generator`, `version`, `timestamp`, `actorId`, `actorType`, `env`, `eventId`, `event` and `subEvent` which are common fields.
Optional fields such as `sessionId`, `deviceId`, and `timeElapsed` can be present but are not required.

### Conversion Logic

The conversion process maps fields from the InternalTelemetryEvent interface to the equivalent OTelEvent interface. This involves:

#### Resource Attributes:

| **OTEL Resource Attribute** | **Internal Telemetry Event Field** |
| --------------------------- | ---------------------------------- |
| `service.name`              | `generator`                        |
| `service.version`           | `version`                          |
| `environment`               | `env`                              |
| `user.id`                   | `actorId`                          |
| `user.type`                 | `actorType`                        |
| `device.id`                 | `deviceId` (if present)            |

#### Event Attributes:

| **OTEL Event Attribute** | **Internal Telemetry Event Field** |
| ------------------------ | ---------------------------------- |
| `name`                   | `event`                            |
| `time`                   | `timestamp`                        |
| `event.id`               | `eventId`                          |
| `subEvent`               | `subEvent`                         |
| `timeElapsed`            | `timeElapsed` (if present)         |

Note: Additional attributes from eventData are included dynamically

The convertor also includes basic error handling to manage missing or malformed data. If any required fields are missing or contain invalid values, the function will throw an error indicating the issue.

The current implementation can be easily extended. New fields or modifications to the conversion logic can be added by updating the convertToOTelTelemetry function to handle additional data.

## Integration with Jaeger

Jaeger is an open-source tracing system that can be used to monitor and analyse distributed applications. By converting internal telemetry events to the OTEL format, we can integrate with Jaeger for observability.

### Steps to Integrate with Jaeger

#### Exporting Data:

Use the OTLP (OpenTelemetry Protocol) `exporter` to send the converted OTEL events to Jaeger.
Configure docker application to use the OTLP `exporter` to communicate with Jaeger's backend.

#### Tracing Integration:

Jaeger will visualize and analyse the OTEL formatted events as `spans` and `traces`. We need to ensure that Jaeger instance is set up to receive and process OTLP data.

#### Configuration

Configure Jaeger client libraries and OTEL exporter settings through docker setup to point to the Jaeger instance.

## References

1) [BHASAI Telemetry Schema](../../docs/03_specification_and_data_model.md)
2) [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)
3) [Jaeger Deployment Integration](https://www.jaegertracing.io/docs/1.59/deployment/#all-in-one)
# OpenTelemetry Collector Configuration for Jaeger Integration

This project outlines the setup and configuration of the OpenTelemetry Collector to facilitate telemetry data collection and forwarding to Jaeger, utilizing both gRPC and HTTP protocols. The setup includes configuring receivers, processors, exporters and extensions within the OTEL Collector to ensure efficient data handling and observability.

## Prerequisites

- OpenTelemetry Collector
- Jaeger All-In-One
- Basic understanding of telemetry data (traces, metrics)

## Key Components

**Receivers:** OTLP receiver configured to accept data over HTTP and gRPC.
**Processors:** A batch processor to enhance performance by batching operations.
**Exporters:** Data is exported to Jaeger and logging systems.
**Extensions:** Health checks and performance profiling extensions are enabled.

## Collector Configuration

```yaml
receivers:
  otlp:
    protocols:
      http:
        endpoint: 'localhost:4318'

processors:
  batch:

exporters:
  otlp/jaeger:
    endpoint: 'jaeger-all-in-one:14250'
  logging:
    loglevel: debug

extensions:
  health_check:

service:
  extensions: [health_check]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [logging, otlp/jaeger]
```

# OpenTelemetry Collector Configuration for Jaeger Integration

This project outlines the setup and configuration of the OpenTelemetry Collector to facilitate telemetry data collection and forwarding to Jaeger, utilizing both gRPC and HTTP protocols. The setup includes configuring receivers, processors, exporters and extensions within the OTEL Collector to ensure efficient data handling and observability.

## Prerequisites

- OpenTelemetry Collector
- Jaeger All-In-One
- Basic understanding of telemetry data (traces, metrics)
- Docker: Ensure Docker is installed on your system. Download it from [Docker's website](https://www.docker.com/products/docker-desktop).
- Docker Compose: Typically included with Docker Desktop installations.

## Key Components

**Receivers:** OTLP receiver configured to accept data over HTTP and gRPC.
**Processors:** A batch processor to enhance performance by batching operations.
**Exporters:** Data is exported to Jaeger and logging systems.
**Extensions:** Health checks and performance profiling extensions are enabled.

## Step 1: Collector Configuration

```yaml
receivers:
  otlp:
    protocols:
      http:
        endpoint: '0.0.0.0:4317'

processors:
  batch:

exporters:
  otlp/jaeger:
    endpoint: 'jaeger-all-in-one:4317'
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

## Step 2: Docker Compose Configuration

Create a `docker-compose.yml` file in the root of your project with the following content:

```yaml
version: '3.7'
services:
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "6831:6831/udp"
      - "16686:16686"
      - "14268:14268"
    networks:
      - telemetry

  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    volumes:
      - ./config/otel-collector-config.yaml:/etc/otel-collector-config.yaml
    command: ["--config=/etc/otel-collector-config.yaml"]
    depends_on:
      - jaeger
    ports:
      - "4317:4317"
      - "4318:4318"
    networks:
      - telemetry

networks:
  telemetry:
```

This configuration starts Jaeger and the OpenTelemetry Collector, setting up the necessary network and port configurations.

## Step 3: Run the Containers

Start the services using Docker Compose:

```bash
docker-compose up -d
```

## Step 4: Run the Process Events Script

Ensure Node.js is installed locally for script execution. Navigate to the `src/jaeger` directory, install dependencies, and run the script:

```bash
cd src/jaeger
npm install
ts-node processEvents.ts
```

### Viewing the Data

Access the Jaeger UI at `http://localhost:16686` to view the traces collected by the OpenTelemetry Collector.

### Cleanup

To stop and remove the containers:

```bash
docker-compose down
```



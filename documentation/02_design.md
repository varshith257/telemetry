## Design

**Use Cases**
1. Debugging
    - Building Traces for a single packet of data
2. Usage Analytics
3. Performance monitoring
    - Model latency
4. User Journey Tracking

**Design Diagram**
![design](./assets/telemetry-design.drawio.svg)
1. Event Specification
    - CSV
    - JSON
2. Event API - Allows you publish you event to store them in the event store
3. Event Store
4. Event Query Engine - Clickhouse (SQL)
5. View Creation (SQL Queries)
6. View Sharing (API - Generic for any View)
7. Dashboard Creation (Superset/Metabase)

- - - 


**Design Choices**
1. Picking up Clickhouse for event store
    - Speed
    - OLAP
    - Horizontally Scalable
    d. Simple <> no brainer clustering
2. Event Specifications
    - Aligned with Sunbird Telemetry
3. Event API - NestJS
    - Know how in building MS in NestJS
    - Decent Async support
    - Enforce types by generating them at runtime
4. Event Validation - AJV
    - Realtime Validation
5. View Sharing
6. Dashboard Creation - Superset
    - Great support for Clickhouse

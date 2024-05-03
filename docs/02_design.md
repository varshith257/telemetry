# Design

## Design Diagram
![design](./assets/telemetry-design.drawio.svg)

## About Design
1. Event Specification
    - [CSV](./03_specification_and_data_model.md#event-csv-structure)
    - [JSON](./03_specification_and_data_model.md#v1-specification)
2. [Event API](./03_specification_and_data_model.md#api) - Allows you publish your event to store them in the event store
3. Event Store - [Clickhouse](https://clickhouse.com/)
    - ClickHouse is an open-source columnar database management system designed for real-time analytics. It excels in handling high-volume data with blazing fast query performance, making it ideal for use cases such as ad tech, IoT, and log analytics. Its architecture prioritizes efficient storage, compression, and query execution for analytical workloads.
4. Event Schema Store - [Postgres](https://www.postgresql.org/)
5. Event Query Engine - Clickhouse (SQL)
    - ClickHouse query engine is a massively parallel processing (MPP) analytical database engine optimized for executing SQL queries on large volumes of data with high performance and low latency.
6. View Creation (SQL Queries)
    - ClickHouse materialized views are precomputed query results stored as tables, providing accelerated access to frequently accessed or complex query results. They automatically update as underlying data changes, offering a convenient way to optimize query performance and simplify analytical workflows in ClickHouse databases.
7. View Sharing (API - Generic for any View)
8. Dashboard Creation (Superset/Metabase)

## Design Choices
1. Picking up Clickhouse for event store
    - Compared to some competitors, ClickHouse stands out for its exceptional speed due to its columnar storage, aggressive compression techniques, and optimized query execution. For instance, when compared to traditional row-based databases like MySQL or PostgreSQL, ClickHouse can achieve significantly faster query performance, especially for analytical workloads involving large volumes of data.
    - Its OLAP capabilities support complex analytical queries, including aggregations, filtering, and window functions, for in-depth data analysis.
    - ClickHouse achieves horizontal scalability through its distributed architecture, allowing it to seamlessly distribute data and queries across multiple nodes in a cluster.
2. [Event Specifications](./03_specification_and_data_model.md#v1-specification)
    - Aligned with Sunbird Telemetry
3. Event API - NestJS
    - Know how in building MS in NestJS
    - Decent Async support
    - Enforce types by generating them at runtime
4. Event Validation - [AJV](https://ajv.js.org/)
    - AJV (Another JSON Schema Validator) is considered one of the best for JSON validation due to its high performance and extensive JSON Schema support. Additionally, AJV offers great flexibility and customization options, allowing users to tailor validation rules according to their specific requirements.
5. Dashboard Creation - [Superset](https://superset.apache.org/)
    - Superset excels in data exploration and visualization, offering user-friendly dashboards and rich visualization options. ClickHouse, on the other hand, specializes in high-performance analytical processing, focusing on efficient storage and querying of large datasets. Both tools serve complementary roles in the data analytics stack.

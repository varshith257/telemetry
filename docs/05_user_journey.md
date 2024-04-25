## User Journey

### Adding an event
Following the CSV format explained [here](./03_specification_and_data_model.md#event-csv-parser). Taking same CSV structure as before.
|eventName|subEventName|When is it generated|...|eventId|botId\|uuid|orgId\|uuid|createdAt\|unix-time|question\|string|prompt\|string|response\|string|
|-|-|-|-|-|-|-|-|-|-|-|
|userQuery|messageSent|When user sends a message|...|E001|Requried|Required|Required|Required|Optional|||

Scope out what all things you want to track from an event. For example we want to track `messageReceive` event, and we want to track `botId`, `orgId`, `createdAt`, `question`, and `response`. We would need to add a new row, with unique `eventId` (going with E002 for now).

Our updated CSV would look like
|eventName|subEventName|When is it generated|...|eventId|botId\|uuid|orgId\|uuid|createdAt\|unix-time|question\|string|prompt\|string|response\|string|
|-|-|-|-|-|-|-|-|-|-|-|
|userQuery|messageSent|When user sends a message|...|E001|Requried|Required|Required|Required|Optional||
|userQuery|messageReceived|When received a message|...|E001|Requried|Required|Required|Required||Required|

Save this as CSV, and paste it to path `<project-root>/schema-generator`. Restarting the project will reflect the changes made to event schema.

### View an Event
Tracking though Superset

### Post Processing an event
MV created on clickhouse

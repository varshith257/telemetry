# Design

Wide Events Telemetry Service Design
![](./assets/telemetry-design.drawio.svg)

#### About Design
On project startup, `./setup.sh` runs which internally runs 3 scripts, which parses CSV, generate event schema and updated Postgres with updated event schema, and generate SQL to update clickhouse table.
Telemetry listens for events on `/metrics/v1/save`, then passes the list of events to `AJV Validator`, which then pulls up the schema for events from Postgres DB, and validated the events received. In case of success, `AJV Validator` return `201` and passes on the data to get processed ahead. In case events doesn't satisfy schema, `AJV Validator` then returns `400` along with errors, according to the index of events receved by it.
Now, we have schema validated events. We then process this data ahead, flatten it out as reuquired by the clickhouse, and then save the events to clickhouse.
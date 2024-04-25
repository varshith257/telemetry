## Event Specification

###  V1 Specification
These fields are common for every event. The table below describes the fields for v1 specification for telemetry API.
| Field Name       | Type      | Requirement | Example                      | Description                                                                                               |
|------------------|-----------|-------------|------------------------------|-----------------------------------------------------------------------------------------------------------|
| generator        | String    | Required    | bff                          | The service/PWA that generated this event.                                                                |
| version          | String    | Required    | 0.1.0                        | Version of the generator service/PWA.                                                                     |
| timestamp        | Number  | Required    | 1710997763      | Epoch Unix Timestamp when the event is generated.                                                                    |
| actorId          | String    | Required    | 550e8400-e29b-41d4-a716-446655440000 | ID of the actor who initiated the event. For example, UID in case of a user.                      |
| actorType        | String    | Required    | user                         | Type of the actor initiating the event, whether it's a User or System.                                    |
| sessionId        | String    | Optional    | 550e8400-e29b-41d4-a716-441234123541 | Session ID to identify the session.                                                               |
| deviceId         | String    | Optional    | 550e8400-e29b-41d4-a716-441234123541 | ID of the device the service is running on.                                                       |
| env              | String    | Required    | prod                         | Environment your service is running on (e.g., prod, dev).                                                 |
| eventId          | String    | Required    | E001                         | Unique ID for the event.                                                                                  |
| event            | String    | Required    | speechToText                 | Name of the generated event.                                                                              |
| subEvent         | String    | Required    | receivedAudio                | Name of the generated sub-event.                                                                          |
| timeElapsed      | Number    | Optional    | 3428                         | Time taken for the event to complete in milliseconds (e.g., time taken in getting API response).          |
| os               | String    | Optional    | iOS                          | Operating system (e.g., iOS, Android, Windows, ...).                                                      |
| browser          | String    | Optional    | Chrome                       | Browser used, if available (e.g., Chrome, Safari, Firefox).                                               |
| browserVersion   | String    | Optional    | 12.4.1                       | Version of the browser, if available.                                                                     |
| deviceType       | String    | Optional    | mobile                       | Type of device (e.g., mobile, tablet, desktop).                                                           |
| platform         | String    | Optional    |                              | Platform or framework used by the client, if relevant.                                                    |
| ip               | String    | Optional    | 29.111.32.12                 | IP address of the requester.                                                                              |
| eventData        | Object    | Required    | {}                           | Data required for that event.                                                                             |

How the eventData is formatted, is explained ahead.

## Event CSV Parser
In section we'll dive into how the Event CSV is structured, and how the `parse.event.csv.js` script uses this CSV to generate event schema, and `SQL` to create table in `clickhouse`. 

#### Event CSV Structure
**CSV Header & Example event**
|eventName|subEventName|When is it generated|...|eventId|botId \|uuid|orgId \|uuid|createdAt \|unix-time|question \|string|prompt  \|string|response \|string|
|-|-|-|-|-|-|-|-|-|-|-|
|userQuery|messageSent|When user sends a message|...|E001|Requried|Required|Required|Required|Optional||||


CSV is divided in to two parts. 
First, this part which holds information about the event. There can be any number of columns here, which can be used to describe the field. The first division goes upto `eventId`, which is unique for each event. This is helpful in describing the event, documenting about it, which can help other developers get context on what the event is about.

Second, this part holds the key and it's type. These are the actual keys to be sent in the request body of telemetry `save` API. Using these keys and their type represented as `Key|Type` in CSV header (example `orgId|uuid`), we generate event schema that is validated by `AJV`, and `SQL` to create `clickhouse` table.

`Key|Type` column for any event can have 3 values, `Required`, `Optional`, _`BLANK`_.
`Required`: If any column have this value, event body `MUST` have this key inside of it's `eventData` object. Else, `AVJ Validator` return `400` with error explaining what key is missing.
`Optional`: If any column have this value, event body `CAN` have this key inside of it's `eventData` object. In case it's not present, data is still stored to clickhouse.
_`BLANK`_: For now, this behaved the same as `Optional`.

#### Event CSV Parser
Parser expects a CSV with name `events.csv` inside of `<project-root>/schema-generator` folder. And then parses it, to generate event schema and `SQL` to create `clickhouse` table. Only `eventId` & `Key|Type` columns of the CSV are relevant here. To create schema json & create table SQL, we need Type mappings for `AJV` & `Clickhouse`. Type mapping is different for `AJV` & `Clickhouse`. For this we have these two mappings files.
CSV Type <> AJV Type path: `schema-generator/csv.ajv.type.mapping.json`
```json
{
  "string": {
    "type": "string"
  },
  "uuid": {
    "type": "string",
    "format": "uuid"
  },
  "url": {
    "type": "string",
    "format": "url"
  },
  "unix-time": {
    "type": "number"
  },
  "json": {
    "type": "object"
  },
  "array": {
    "type": "array"
  },
  "number": {
    "type": "number"
  }
}
```
CSV Type <> Clickhouse Type path: `schema-generator/csv.clickhouse.type.mapping.json`
```json
{
  "number": "UInt32",
  "string": "String",
  "url": "String",
  "uuid": "UUID",
  "unix-time": "DateTime",
  "json": "String",
  "array": "String"
}
```
Mappings can be added to these fiels, to support more `Types`.

For the above example CSV with single event. It would have this event schema and create table SQL
Event Schema
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "createdAt": {
            "type": "number"
        },
        "question": {
            "type": "string"
        },
        "prompt": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "orgId",
        "createdAt",
        "question"
    ],
}
```
In case of SQL, these extra fields are top level telemetry fields that are expected from each event.
```sql
CREATE TABLE IF NOT EXISTS event
(
	generator String,
	version String,
	timestamp DateTime,
	actorId String,
	actorType String,
	sessionId Nullable(String),
	deviceId Nullable(String),
	env String,
	eventId String,
	event String,
	subEvent Nullable(String),
	timeElapsed Nullable(UInt32),
	os Nullable(String),
	browser Nullable(String),
	browserVersion Nullable(String),
	deviceType Nullable(String),
	platform Nullable(String),
	ip String,
	botId Nullable(UUID),
	orgId Nullable(UUID),
	createdAt Nullable(DateTime),
	question Nullable(String),
	prompt Nullable(String)
)
ENGINE = MergeTree
ORDER BY timestamp;
```

## Data Model
Clickhouse data types used
1. `UInt32` - Used to store any interger. Example, latency.
2. `String` - This stores anything string. Can be stringified JSON, array of strings.
3. `UUID` - Helps in faster querying compared to string.
4. `DateTime` - stores fields with date and time.

## API
Endpoint:
```
POST /metrics/v1/save
```

Example curl for E001 defined above.
```sh
curl --location '<telemetry-service-url>/metrics/v1/save' \
--header 'Content-Type: application/json' \
--data '[
    {
        "generator": "akai",
        "version": "0.0.1",
        "timestamp": "1713943647",
        "actorId": "<actor-id>",
        "actorType": "user",
        "sessionId": "<session-id>",
        "deviceId": "<device-id",
        "env": "prod",
        "eventId": "E001",
        "event": "speechToText",
        "subEvent": "receivedAudio",
        "timeElapsed": 45270
        "eventData": {
          "botId": "550e8400-e29b-41d4-a716-446655440000",
          "orgId": "550e8400-e29b-41d4-a716-446655440000",
          "createdAt": "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
          "question": "How to grow wheat?",
          "prompt": "Some prompt"
        }
    },
    {
        "generator": "akai",
        "version": "0.0.1",
        "timestamp": "1713943647",
        "actorId": "<actor-id>",
        "actorType": "user",
        "sessionId": "<session-id>",
        "deviceId": "<device-id",
        "env": "prod",
        "eventId": "E001",
        "event": "speechToText",
        "subEvent": "receivedAudio",
        "timeElapsed": 45270
        "eventData": {
          "botId": "550e8400-e29b-41d4-a716-446655440000",
          "orgId": "550e8400-e29b-41d4-a716-446655440000",
          "createdAt": "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
          "question": "How to grow wheat?"
        }
    }
]'

Success Response:
```json
{
    "error": false,
    "message": "Metric stored successfully"
}
```

Failure Response (in case `eventData` does not satisfies the schema defined [here](event-schema-docs.md)): 
```sh
# Request curl
curl --location '<telemetry-service-url>/metrics/v1/save' \
--header 'Content-Type: application/json' \
--data '[
    {
        "generator": "akai",
        "version": "0.0.1",
        "timestamp": "1713943647",
        "actorId": "<actor-id>",
        "actorType": "user",
        "sessionId": "<session-id>",
        "deviceId": "<device-id",
        "env": "prod",
        "eventId": "E001",
        "event": "speechToText",
        "subEvent": "receivedAudio",
        "timeElapsed": 45270
        "eventData": {
          "botId": "550e8400-e29b-41d4-a716-446655440000",
          "orgId": "550e8400-e29b-41d4-a716-446655440000",
          "createdAt": "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
          "question": "How to grow wheat?",
          "prompt": "Some prompt"
        }
    },
    {
        "generator": "akai",
        "version": "0.0.1",
        "timestamp": "1713943647",
        "actorId": "<actor-id>",
        "actorType": "user",
        "sessionId": "<session-id>",
        "deviceId": "<device-id",
        "env": "prod",
        "eventId": "E001",
        "event": "speechToText",
        "subEvent": "receivedAudio",
        "timeElapsed": 45270
        "eventData": {
          "botId": "not-in-uuid-format",
          "orgId": "550e8400-e29b-41d4-a716-446655440000",
          "createdAt": "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
          "question": "How to grow wheat?",
          "prompt": "Some prompt"
        }
    }
]'

# botId in second eventData object is not in UUID format, and therefore will fail to POST this request
# Response
{
    "error": true,
    "message": "Request body does not satisfies the schema",
    "errorData": {
        "1": [
            {
                "instancePath": "/botId",
                "schemaPath": "#/properties/botId/format",
                "keyword": "format",
                "params": {
                    "format": "uuid"
                },
                "message": "must match format \"uuid\""
            }
        ]
    }
}
```


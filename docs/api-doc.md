# API DOCS

## Top Level metrics fields

These fields are common for every event. The table below describes the fields for v1 specification for telemetry API.
| Field Name       | Type      | Requirement | Example                      | Description                                                                                               |
|------------------|-----------|-------------|------------------------------|-----------------------------------------------------------------------------------------------------------|
| generator        | String    | Required    | bff                          | The service/PWA that generated this event.                                                                |
| version          | String    | Required    | 0.1.0                        | Version of the generator service/PWA.                                                                     |
| timestamp        | DateTime  | Required    | 2020-07-10 15:00:00.000      | Timestamp when the event is generated.                                                                    |
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

## API
Endpoint:
```
POST <telemetry-service-url>/metrics/v1/save
```

Example curl for (eventId, event, subEvent) (E001, speechToText, receivedAudio), `eventData` schema defined [here](./event-schema-docs.md)
```sh
curl --location '<telemetry-service-url>/metrics/v1/save' \
--header 'Content-Type: application/json' \
--data '[
    {
        "generator": "bff",
        "version": "0.0.1",
        "timestamp": "2020-07-10 15:00:00.000",
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
            "userId": "550e8400-e29b-41d4-a716-446655440000",
            "orgId": "550e8400-e29b-41d4-a716-446655440000",
            "audiourl": "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
            "audioId": "550e8400-e29b-41d4-a716-446655440000"
        }
    },
    {
        "generator": "bff",
        "version": "0.0.1",
        "timestamp": "2020-07-10 15:00:00.000",
        "actorId": "123412341234",
        "actorType": "sser",
        "sessionId": "123412341234",
        "deviceId": "123412341234",
        "env": "prod",
        "eventId": "E001",
        "event": "speechToText",
        "subEvent": "receivedAudio",
        "timeElapsed": 45270
        "eventData": {
            "botId": "550e8400-e29b-41d4-a716-446655440000",
            "userId": "550e8400-e29b-41d4-a716-446655440000",
            "orgId": "550e8400-e29b-41d4-a716-446655440000",
            "audiourl": "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
            "audioId": "550e8400-e29b-41d4-a716-446655440000"
        }
    }
]'
```

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
        "generator": "bff",
        "version": "0.0.1",
        "timestamp": "2020-07-10 15:00:00.000",
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
            "userId": "550e8400-e29b-41d4-a716-446655440000",
            "orgId": "550e8400-e29b-41d4-a716-446655440000",
            "audiourl": "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
            "audioId": "550e8400-e29b-41d4-a716-446655440000"
        }
    },
    {
        "generator": "bff",
        "version": "0.0.1",
        "timestamp": "2020-07-10 15:00:00.000",
        "actorId": "123412341234",
        "actorType": "sser",
        "sessionId": "123412341234",
        "deviceId": "123412341234",
        "env": "prod",
        "eventId": "E001",
        "event": "speechToText",
        "subEvent": "receivedAudio",
        "timeElapsed": 45270
        "eventData": {
            "botId": "not-in-uuid-format",
            "userId": "550e8400-e29b-41d4-a716-446655440000",
            "orgId": "550e8400-e29b-41d4-a716-446655440000",
            "audiourl": "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
            "audioId": "550e8400-e29b-41d4-a716-446655440000"
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
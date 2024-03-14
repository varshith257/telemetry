# Event Data
These are auto-generated schema specification through CSV
## speechToText
### receivedAudio
When is it generated: BFF received audio from a bot
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "audiourl": {
            "type": "string",
            "format": "url"
        },
        "audioId": {
            "type": "string",
            "format": "uuid"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "audiourl",
        "audioId"
    ],
    "description": "BFF received audio from a bot"
}
```
### speechToTextResponse
When is it generated: Audio is converted to text from audio
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "audiourl": {
            "type": "string",
            "format": "url"
        },
        "audioId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "spellCorrectedText": {
            "type": "string"
        },
        "error": {
            "type": "string"
        },
        "timeTaken": {
            "type": "number"
        },
        "spellCheckTimeTaken": {
            "type": "number"
        },
        "phoneNumber": {
            "type": "string"
        },
        "createdAt": {
            "type": "string",
            "format": "iso-date-time"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "audiourl",
        "audioId",
        "text",
        "spellCorrectedText",
        "error",
        "timeTaken",
        "spellCheckTimeTaken",
        "phoneNumber",
        "createdAt"
    ],
    "description": "Audio is converted to text from audio"
}
```
### mapQueryIdToAudio
When is it generated: AudioId is mapped to QueryId
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "audiourl": {
            "type": "string",
            "format": "url"
        },
        "audioId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "spellCorrectedText": {
            "type": "string"
        },
        "error": {
            "type": "string"
        },
        "timeTaken": {
            "type": "number"
        },
        "spellCheckTimeTaken": {
            "type": "number"
        },
        "phoneNumber": {
            "type": "string"
        },
        "createdAt": {
            "type": "string",
            "format": "iso-date-time"
        },
        "queryId": {
            "type": "string",
            "format": "uuid"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "audiourl",
        "audioId",
        "text",
        "spellCorrectedText",
        "error",
        "timeTaken",
        "spellCheckTimeTaken",
        "phoneNumber",
        "createdAt",
        "queryId"
    ],
    "description": "AudioId is mapped to QueryId"
}
```
## userQuery
### incomingMessage
When is it generated: User sent a message to a bot
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "mediaIds": {
            "type": "array"
        },
        "phoneNumber": {
            "type": "string"
        },
        "createdAt": {
            "type": "string",
            "format": "iso-date-time"
        },
        "deviceId": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "text",
        "createdAt",
        "deviceId"
    ],
    "description": "User sent a message to a bot"
}
```
### userHistory
When is it generated: Fetching user history at inbound
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "timeTaken": {
            "type": "number"
        },
        "phoneNumber": {
            "type": "string"
        },
        "queryId": {
            "type": "string",
            "format": "uuid"
        },
        "userHistory": {
            "type": "object"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "text",
        "timeTaken",
        "queryId",
        "userHistory"
    ],
    "description": "Fetching user history at inbound"
}
```
### userInfo
When is it generated: Fetching user info - transformer
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "timeTaken": {
            "type": "number"
        },
        "queryId": {
            "type": "string",
            "format": "uuid"
        },
        "block": {
            "type": "string"
        },
        "district": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "text",
        "timeTaken",
        "queryId",
        "block",
        "district"
    ],
    "description": "Fetching user info - transformer"
}
```
### translateInput
When is it generated: translate - transformer
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "timeTaken": {
            "type": "number"
        },
        "phoneNumber": {
            "type": "string"
        },
        "queryId": {
            "type": "string",
            "format": "uuid"
        },
        "textInEnglish": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "text",
        "timeTaken",
        "queryId",
        "textInEnglish"
    ],
    "description": "translate - transformer"
}
```
### nuralCoreference
When is it generated: nuralCoref - transformer
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "timeTaken": {
            "type": "number"
        },
        "phoneNumber": {
            "type": "string"
        },
        "queryId": {
            "type": "string",
            "format": "uuid"
        },
        "textInEnglish": {
            "type": "string"
        },
        "coreferencedText": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "text",
        "timeTaken",
        "queryId",
        "textInEnglish",
        "coreferencedText"
    ],
    "description": "nuralCoref - transformer"
}
```
### classifyQuestion
When is it generated: classifier - transformer
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "timeTaken": {
            "type": "number"
        },
        "phoneNumber": {
            "type": "string"
        },
        "queryId": {
            "type": "string",
            "format": "uuid"
        },
        "textInEnglish": {
            "type": "string"
        },
        "queryClass": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "text",
        "timeTaken",
        "queryId",
        "textInEnglish",
        "queryClass"
    ],
    "description": "classifier - transformer"
}
```
### retreiveSimilarChunks
When is it generated: retieveDocs - transformer
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "timeTaken": {
            "type": "number"
        },
        "phoneNumber": {
            "type": "string"
        },
        "queryId": {
            "type": "string",
            "format": "uuid"
        },
        "textInEnglish": {
            "type": "string"
        },
        "similarChunks": {
            "type": "object"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "text",
        "timeTaken",
        "queryId",
        "textInEnglish",
        "similarChunks"
    ],
    "description": "retieveDocs - transformer"
}
```
### NER
When is it generated: ner - transformer
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "timeTaken": {
            "type": "number"
        },
        "phoneNumber": {
            "type": "string"
        },
        "queryId": {
            "type": "string",
            "format": "uuid"
        },
        "textInEnglish": {
            "type": "string"
        },
        "NER": {
            "type": "object"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "text",
        "timeTaken",
        "queryId",
        "textInEnglish",
        "NER"
    ],
    "description": "ner - transformer"
}
```
### llmResponse
When is it generated: llm - transformer
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "timeTaken": {
            "type": "number"
        },
        "phoneNumber": {
            "type": "string"
        },
        "queryId": {
            "type": "string",
            "format": "uuid"
        },
        "textInEnglish": {
            "type": "string"
        },
        "responseInEnglish": {
            "type": "string"
        },
        "response": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "text",
        "timeTaken",
        "queryId",
        "textInEnglish",
        "responseInEnglish"
    ],
    "description": "llm - transformer"
}
```
### translateOutput
When is it generated: translate - transformer
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "timeTaken": {
            "type": "number"
        },
        "phoneNumber": {
            "type": "string"
        },
        "queryId": {
            "type": "string",
            "format": "uuid"
        },
        "textInEnglish": {
            "type": "string"
        },
        "responseInEnglish": {
            "type": "string"
        },
        "response": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "text",
        "timeTaken",
        "queryId",
        "textInEnglish",
        "responseInEnglish",
        "response"
    ],
    "description": "translate - transformer"
}
```
### textToSpeech
When is it generated: textToSpeech - transformer
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "audiourl": {
            "type": "string",
            "format": "url"
        },
        "audioId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "timeTaken": {
            "type": "number"
        },
        "phoneNumber": {
            "type": "string"
        },
        "queryId": {
            "type": "string",
            "format": "uuid"
        },
        "textInEnglish": {
            "type": "string"
        },
        "responseInEnglish": {
            "type": "string"
        },
        "response": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "audiourl",
        "audioId",
        "text",
        "timeTaken",
        "queryId",
        "textInEnglish",
        "responseInEnglish",
        "response"
    ],
    "description": "textToSpeech - transformer"
}
```
### audioPlayed
When is it generated: When user plays audio at app
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "timeTaken": {
            "type": "number"
        },
        "phoneNumber": {
            "type": "string"
        },
        "queryId": {
            "type": "string",
            "format": "uuid"
        },
        "timesAudioUsed": {
            "type": "number"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "text",
        "timeTaken",
        "queryId"
    ],
    "description": "When user plays audio at app"
}
```
### responseReceivedAtApp
When is it generated: When user gets the response at app
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "timeTaken": {
            "type": "number"
        },
        "phoneNumber": {
            "type": "string"
        },
        "queryId": {
            "type": "string",
            "format": "uuid"
        },
        "responseInEnglish": {
            "type": "string"
        },
        "response": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "text",
        "timeTaken",
        "queryId",
        "responseInEnglish",
        "response"
    ],
    "description": "When user gets the response at app"
}
```
## userQueryInbound
### outgoingMessage
When is it generated: A message was sent to user
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "mediaIds": {
            "type": "array"
        },
        "timeTaken": {
            "type": "number"
        },
        "createdAt": {
            "type": "string",
            "format": "iso-date-time"
        },
        "deviceId": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "timeTaken",
        "createdAt",
        "deviceId"
    ],
    "description": "A message was sent to user"
}
```
### convertXmsgFailed
When is it generated: XMessage to raw message conversion failed
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "botId": {
            "type": "string",
            "format": "uuid"
        },
        "userId": {
            "type": "string",
            "format": "uuid"
        },
        "orgId": {
            "type": "string",
            "format": "uuid"
        },
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "mediaIds": {
            "type": "array"
        },
        "createdAt": {
            "type": "string",
            "format": "iso-date-time"
        },
        "deviceId": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "userId",
        "orgId",
        "conversationId",
        "messageId",
        "createdAt",
        "deviceId"
    ],
    "description": "XMessage to raw message conversion failed"
}
```
### convertMsgFailed
When is it generated: Raw message conversion to XMessage failed
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
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "mediaIds": {
            "type": "array"
        },
        "createdAt": {
            "type": "string",
            "format": "iso-date-time"
        },
        "deviceId": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "orgId",
        "createdAt",
        "deviceId"
    ],
    "description": "Raw message conversion to XMessage failed"
}
```
### registrationRequest
When is it generated: A registration request was sent to the bot
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
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "mediaIds": {
            "type": "array"
        },
        "createdAt": {
            "type": "string",
            "format": "iso-date-time"
        },
        "deviceId": {
            "type": "string"
        },
        "userManagementUrl": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "orgId",
        "conversationId",
        "messageId",
        "createdAt",
        "deviceId",
        "userManagementUrl"
    ],
    "description": "A registration request was sent to the bot"
}
```
### registrationFailed
When is it generated: A registration request failed
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
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "mediaIds": {
            "type": "array"
        },
        "createdAt": {
            "type": "string",
            "format": "iso-date-time"
        },
        "deviceId": {
            "type": "string"
        },
        "userManagementUrl": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "orgId",
        "conversationId",
        "messageId",
        "createdAt",
        "deviceId",
        "userManagementUrl"
    ],
    "description": "A registration request failed"
}
```
### feedbackRequest
When is it generated: A user sent a feedback on a message
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
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "createdAt": {
            "type": "string",
            "format": "iso-date-time"
        },
        "deviceId": {
            "type": "string"
        },
        "reaction": {
            "type": "number"
        }
    },
    "required": [
        "botId",
        "orgId",
        "conversationId",
        "messageId",
        "createdAt",
        "deviceId",
        "reaction"
    ],
    "description": "A user sent a feedback on a message"
}
```
### messageRead
When is it generated: User read the message sent by a bot
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
        "conversationId": {
            "type": "string",
            "format": "uuid"
        },
        "messageId": {
            "type": "string",
            "format": "uuid"
        },
        "text": {
            "type": "string"
        },
        "mediaIds": {
            "type": "array"
        },
        "createdAt": {
            "type": "string",
            "format": "iso-date-time"
        },
        "deviceId": {
            "type": "string"
        }
    },
    "required": [
        "botId",
        "orgId",
        "conversationId",
        "messageId",
        "createdAt",
        "deviceId"
    ],
    "description": "User read the message sent by a bot"
}
```

import fs from 'fs';
import path from 'path';
import { convertToOTelTelemetry, InternalTelemetryEvent, OTelEvent } from './convertor';

// Example Event to Test Convertor Functionality - BFF received audio from a bot
const receivedAudioEvent: InternalTelemetryEvent = {
  generator: 'BFF-Backend',
  version: '1.0.0',
  timestamp: Date.now(),
  actorId: 'user-12345',
  actorType: 'user',
  env: 'production',
  eventId: 'event-67890',
  event: 'speechToText',
  subEvent: 'receivedAudio',
  eventData: {
    botId: 'bot-abc123',
    userId: 'user-12345',
    orgId: 'org-98765',
    conversationId: 'conv-54321',
    messageId: 'msg-11111',
    audioUrl: 'https://example.com/audiofile.mp3',
    audioId: 'audio-654321',
    createdAt: Date.now(),
    language: 'en-US',
  },
};

// Example Event - Audio converted to text
const speechToTextResponseEvent: InternalTelemetryEvent = {
  generator: 'BFF-Backend',
  version: '1.0.0',
  timestamp: Date.now(),
  actorId: 'user-12345',
  actorType: 'user',
  env: 'production',
  eventId: 'event-67891',
  event: 'speechToTextResponse',
  subEvent: 'textGenerated',
  eventData: {
    botId: 'bot-abc123',
    userId: 'user-12345',
    orgId: 'org-98765',
    conversationId: 'conv-54321',
    messageId: 'msg-11112',
    audioFileName: 'audiofile.mp3',
    audioUrl: 'https://example.com/audiofile.mp3',
    audioId: 'audio-654322',
    text: 'Hello, how can I assist you today?',
    spellCorrectedText: 'Hello, how can I assist you today?',
    timeTaken: 2000,
    spellCheckTimeTaken: 100,
    phoneNumber: '+1234567890',
    createdAt: Date.now(),
    queryId: 'query-789012',
    language: 'en-US',
  },
};

// // Function to save OTEL events to a JSON file
// function saveEventToFile(event: OTelEvent, fileName: string) {
//   try {
//     const filePath = path.join(__dirname, 'logs', fileName || 'default-log.json');  // Default file name
//     const eventData = JSON.stringify(event, null, 2);
    
//     fs.writeFileSync(filePath, eventData);
//     console.log('Event saved successfully to', filePath);
//   } catch (error) {
//     console.error('Error saving event to file:', error);
//   }
// }

(async () => {
  try {
    const convertedReceivedAudioEvent = await convertToOTelTelemetry(receivedAudioEvent);
    const convertedSpeechToTextResponseEvent = await convertToOTelTelemetry(speechToTextResponseEvent);
  } catch (error) {
    console.error('Error processing event:', error);
  }
})();

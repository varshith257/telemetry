import {
  convertToOTelTelemetry,
  InternalTelemetryEvent,
  OTelEvent,
} from './convertor';

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
  sessionId: '550e8400-e29b-41d4-a716-441234123541',
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
  sessionId: '750e8400-e29s-51d5-a715-541234123545',
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

(async () => {
  try {
    await convertToOTelTelemetry(receivedAudioEvent);
    await convertToOTelTelemetry(speechToTextResponseEvent);
  } catch (error) {
    console.error('Error processing event:', error);
  }
})();

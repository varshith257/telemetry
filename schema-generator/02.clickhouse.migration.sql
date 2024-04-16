ALTER TABLE event
ADD COLUMN translatedResponse Nullable(String) AFTER prompt,
ADD COLUMN streamStartLatency Nullable(UInt32) AFTER translatedResponse;
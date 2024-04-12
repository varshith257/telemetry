ALTER TABLE event
ADD COLUMN eventLog Nullable(String) AFTER requestId,
ADD COLUMN transformerId Nullable(String) AFTER eventLog;
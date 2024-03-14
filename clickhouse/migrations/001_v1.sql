CREATE TABLE IF NOT EXISTS events_v1 
(
  generator String,
  version String,
  timestamp DateTime,
  name String,
  actor_id String,
  actor_type String,
  env String,
  event_id UUID,
  event String,
  sub_event String,
  time_taken UInt32
) 
ENGINE = MergeTree
ORDER BY timestamp;
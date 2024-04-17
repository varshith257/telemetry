ALTER TABLE event
ADD COLUMN reactionType Nullable(String) AFTER streamStartLatency,
ADD COLUMN reactionText Nullable(String) AFTER reactionType;
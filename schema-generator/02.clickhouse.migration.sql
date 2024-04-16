ALTER TABLE event
ADD COLUMN prompt Nullable(String) AFTER language;
ALTER TABLE event
ADD COLUMN language Nullable(String) AFTER transformerId;

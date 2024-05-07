ALTER TABLE event
ADD COLUMN userHistory Nullable(String) AFTER reactionText,
ADD COLUMN replyId Nullable(String) AFTER userHistory;
ALTER TABLE event
ADD COLUMN schemaId Nullable(UUID) AFTER errorRate,
ADD COLUMN datasetId Nullable(UUID) AFTER schemaId,
ADD COLUMN question Nullable(String) AFTER datasetId,
ADD COLUMN field Nullable(String) AFTER question,
ADD COLUMN threshold Nullable(UInt32) AFTER field,
ADD COLUMN sqlQuery Nullable(String) AFTER threshold,
ADD COLUMN result Nullable(String) AFTER sqlQuery,
ADD COLUMN documentId Nullable(String) AFTER result,
ADD COLUMN requestId Nullable(UUID) AFTER documentId,
ADD COLUMN eventLog Nullable(String) AFTER requestId,
ADD COLUMN transformerId Nullable(String) AFTER eventLog
ADD COLUMN language Nullable(String) AFTER transformerId;
DROP TABLE IF EXISTS combined_data;

SET allow_experimental_refreshable_materialized_view = 1;

CREATE MATERIALIZED VIEW IF NOT EXISTS combined_data
REFRESH EVERY 30 SECONDS
ENGINE = MergeTree
ORDER BY createdAt
SETTINGS allow_nullable_key = 1
AS
SELECT
    messageId,
a    (SELECT createdAt FROM event WHERE messageId = event.messageId AND eventId = 'E002'  LIMIT 1) AS createdAt,
a    (SELECT userId FROM event WHERE messageId = event.messageId AND eventId = 'E001'  LIMIT 1) AS userId,
a    (SELECT conversationId FROM event WHERE messageId = event.messageId AND eventId = 'E002'  LIMIT 1) AS conversationId,
a    (SELECT audioUrl FROM event WHERE messageId = event.messageId AND eventId = 'E002'  LIMIT 1) AS s2tInput,
a    (SELECT spellCorrectedText FROM event WHERE messageId = event.messageId AND eventId = 'E002' LIMIT 1) AS spell_corrected_text,
a    (SELECT text FROM event WHERE messageId = event.messageId AND eventId = 'E002' LIMIT 1) AS finalQuery,
a    (SELECT textInEnglish FROM event WHERE messageId = event.messageId AND eventId = 'E007' LIMIT 1) AS queryInEnglish,
a    (SELECT coreferencedText FROM event WHERE messageId = event.messageId AND eventId = 'E008' LIMIT 1) AS coreferencedQuery,
a    (SELECT queryClass FROM event WHERE messageId = event.messageId AND eventId = 'E009' LIMIT 1) AS queryClass,
a    (SELECT similarChunks FROM event WHERE messageId = event.messageId AND eventId = 'E010' LIMIT 1) AS contentUsed,
a    (SELECT responseInEnglish FROM event WHERE messageId = event.messageId AND eventId = 'E013' LIMIT 1) AS responseInEnglish,
a    (SELECT NER FROM event WHERE messageId = event.messageId AND eventId = 'E011' LIMIT 1) AS NER,
b    (SELECT text FROM event WHERE messageId = event.messageId AND eventId = 'E008' LIMIT 1) AS neuralCoreference,
    (SELECT text FROM event WHERE messageId = event.messageId AND eventId = 'E012' LIMIT 1) AS response,
a    groupArray(tuple(eventId, subEvent, error)) as error,
    (SELECT createdAt FROM event WHERE messageId = event.messageId AND eventId = 'E012' LIMIT 1) AS responseAt,
a    (SELECT reaction FROM event WHERE messageId = event.messageId AND eventId = 'E023' LIMIT 1) AS reaction,
a    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E002' LIMIT 1) AS s2tLatency,
b    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E002' LIMIT 1) AS spellCheckLatency,
b    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E007' LIMIT 1) AS translateInputLatency,
b    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E005' LIMIT 1) AS getUserHistoryLatency,
b    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E008' LIMIT 1) AS getNeuralCoreferenceLatency,
a    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E009' LIMIT 1) AS classifiedQuestionLatency,
a    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E010' LIMIT 1) AS getSimilarDocsLatency,
a    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E012' LIMIT 1) AS getResponseLatency,
a    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E011' LIMIT 1) AS NERLatency,
a    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E045' LIMIT 1) AS T2SLatency,
a    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E046' LIMIT 1) AS S2TLatency,
    (SELECT CASE WHEN (SELECT text FROM event WHERE messageId = event.messageId AND eventId = 'E004' LIMIT 1) != (SELECT text FROM event WHERE messageId = event.messageId AND eventId = 'E002' LIMIT 1) THEN 1 ELSE 0 END) AS isFinalQueryEdited,
a    (SELECT audioUrl FROM event WHERE messageId = event.messageId AND eventId = 'E001' LIMIT 1) AS audioURL,
a    (SELECT timesAudioUsed FROM event WHERE messageId = event.messageId AND eventId = 'E015' LIMIT 1) AS timesAudioUsed,
a    (SELECT phoneNumber FROM event WHERE messageId = event.messageId AND eventId = 'E004' LIMIT 1) AS phoneNumber,
a    (SELECT district FROM event WHERE messageId = event.messageId AND eventId = 'E006' LIMIT 1) AS district,
a    (SELECT block FROM event WHERE messageId = event.messageId AND eventId = 'E006' LIMIT 1) AS block
FROM
    event
GROUP BY
    messageId;
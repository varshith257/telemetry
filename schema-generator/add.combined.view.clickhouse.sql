DROP 

CREATE MATERIALIZED VIEW IF NOT EXISTS combined_data
REFRESH EVERY 30 SECONDS
ENGINE = MergeTree
ORDER BY createdAt
SETTINGS allow_nullable_key = 1
AS
SELECT
    messageId,
    (SELECT createdAt FROM event WHERE messageId = event.messageId AND eventId = 'E002'  LIMIT 1) AS createdAt,
    (SELECT userId FROM event WHERE messageId = event.messageId AND eventId = 'E001'  LIMIT 1) AS userId,
    (SELECT conversationId FROM event WHERE messageId = event.messageId AND eventId = 'E002'  LIMIT 1) AS conversationId,
    (SELECT audioUrl FROM event WHERE messageId = event.messageId AND eventId = 'E002'  LIMIT 1) AS s2tInput,
    (SELECT spellCorrectedText FROM event WHERE messageId = event.messageId AND eventId = 'E002' LIMIT 1) AS spell_corrected_text,
    (SELECT text FROM event WHERE messageId = event.messageId AND eventId = 'E002' LIMIT 1) AS finalQuery,
    (SELECT textInEnglish FROM event WHERE messageId = event.messageId AND eventId = 'E007' LIMIT 1) AS queryInEnglish,
    (SELECT coreferencedText FROM event WHERE messageId = event.messageId AND eventId = 'E008' LIMIT 1) AS coreferencedQuery,
    (SELECT queryClass FROM event WHERE messageId = event.messageId AND eventId = 'E009' LIMIT 1) AS queryClass,
    (SELECT similarChunks FROM event WHERE messageId = event.messageId AND eventId = 'E010' LIMIT 1) AS contentUsed,
    (SELECT responseInEnglish FROM event WHERE messageId = event.messageId AND eventId = 'E013' LIMIT 1) AS responseInEnglish,
    (SELECT NER FROM event WHERE messageId = event.messageId AND eventId = 'E011' LIMIT 1) AS NER,
    (SELECT text FROM event WHERE messageId = event.messageId AND eventId = 'E008' LIMIT 1) AS neuralCoreference,
    (SELECT text FROM event WHERE messageId = event.messageId AND eventId = 'E012' LIMIT 1) AS response,
    groupArray(tuple(eventId, subEvent, error)) as error,
    (SELECT createdAt FROM event WHERE messageId = event.messageId AND eventId = 'E012' LIMIT 1) AS responseAt,
    (SELECT reaction FROM event WHERE messageId = event.messageId AND eventId = 'E023' LIMIT 1) AS reaction,
    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E002' LIMIT 1) AS s2tLatency,
    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E002' LIMIT 1) AS spellCheckLatency,
    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E007' LIMIT 1) AS translateInputLatency,
    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E005' LIMIT 1) AS getUserHistoryLatency,
    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E008' LIMIT 1) AS getNeuralCoreferenceLatency,
    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E009' LIMIT 1) AS classifiedQuestionLatency,
    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E010' LIMIT 1) AS getSimilarDocsLatency,
    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E012' LIMIT 1) AS getResponseLatency,
    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E011' LIMIT 1) AS NERLatency,
    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E045' LIMIT 1) AS T2SLatency,
    (SELECT timeTaken FROM event WHERE messageId = event.messageId AND eventId = 'E046' LIMIT 1) AS S2TLatency,
    (SELECT CASE WHEN (SELECT text FROM event WHERE messageId = event.messageId AND eventId = 'E004' LIMIT 1) != (SELECT text FROM event WHERE messageId = event.messageId AND eventId = 'E002' LIMIT 1) THEN 1 ELSE 0 END) AS isFinalQueryEdited,
    (SELECT audioUrl FROM event WHERE messageId = event.messageId AND eventId = 'E001' LIMIT 1) AS audioURL,
    (SELECT timesAudioUsed FROM event WHERE messageId = event.messageId AND eventId = 'E015' LIMIT 1) AS timesAudioUsed,
    (SELECT phoneNumber FROM event WHERE messageId = event.messageId AND eventId = 'E004' LIMIT 1) AS phoneNumber,
    (SELECT district FROM event WHERE messageId = event.messageId AND eventId = 'E006' LIMIT 1) AS district,
    (SELECT block FROM event WHERE messageId = event.messageId AND eventId = 'E006' LIMIT 1) AS block
FROM
    event
GROUP BY
    messageId;
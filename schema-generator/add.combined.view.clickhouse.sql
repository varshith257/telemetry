DROP TABLE IF EXISTS combined_data;

SET allow_experimental_refreshable_materialized_view = 1;

CREATE MATERIALIZED VIEW IF NOT EXISTS combined_data 
REFRESH EVERY 5 SECONDS 
ENGINE = MergeTree
ORDER BY timestamp 
SETTINGS allow_nullable_key = 1 AS
SELECT
    e1.messageId AS messageId,
    e1.spellCheckLatency AS spellCheckLatency,
    e1.timestamp AS timestamp,
    e2.userId AS userId,
    e2.orgId AS orgId,
    e2.botId AS botId,
    e2.s2tInput AS s2tInput,
    e2.conversationId AS conversationId,
    e2.query AS query,
    e12.translatedQuery AS translatedQuery,
    e1.s2tOutput AS s2tOutput,
    (CASE WHEN e2.query IS NOT NULL AND e1.s2tOutput IS NOT NULL AND e2.query != e1.s2tOutput THEN true ELSE false END) AS isQueryEdited,
    e2.spellCorrectedText AS spellCorrectedText,
    e2.responseAt AS responseAt,
    e2.translatedResponse AS translatedResponse,
    e2.coreferencedText AS coreferencedText,
    e2.queryClass AS queryClass,
    e2.NER AS NER,
    e2.response AS response,
    e2.error AS error,
    e2.reactionType AS reactionType,
    e2.reactionText AS reactionText,
    e2.timesAudioUsed AS timesAudioUsed,
    e2.phoneNumber AS phoneNumber,
    e2.district AS district,
    e2.block AS block,
    e3.getUserHistoryLatency AS getUserHistoryLatency,
    e4.getNeuralCoreferenceLatency AS getNeuralCoreferenceLatency,
    e5.classifyQuestionLatency AS classifyQuestionLatency,
    e6.getSimilarDocsLatency AS getSimilarDocsLatency,
    e7.getResponseLatency AS getResponseLatency,
    e8.NERLatency AS NERLatency,
    e9.T2SLatency AS T2SLatency,
    e10.S2TLatency AS S2TLatency,
    e11.detectedLanguage AS detectedLanguage,
    e11.detectedLatency AS detectedLatency,
    e12.translateInputLatency AS translateInputLatency,
    COALESCE(spellCheckLatency, 0) +
    COALESCE(getUserHistoryLatency, 0) +
    COALESCE(getNeuralCoreferenceLatency, 0) +
    COALESCE(classifyQuestionLatency, 0) +
    COALESCE(getSimilarDocsLatency, 0) +
    COALESCE(getResponseLatency, 0) +
    COALESCE(NERLatency, 0) +
    COALESCE(T2SLatency, 0) +
    COALESCE(S2TLatency, 0) +
    COALESCE(detectedLatency, 0) +
    COALESCE(translateInputLatency, 0) AS totalLatency,
    e10.similarChunks AS similarChunks,
    e2.prompt AS prompt
FROM
    (
        SELECT
            messageId,
            maxIf(timeTaken, event = 'E002') AS spellCheckLatency,
            maxIf(timestamp, eventId = 'E032') AS timestamp,
            maxIf(text, eventId = 'E002') AS s2tOutput
        FROM
            event
        GROUP BY
            messageId
    ) AS e1
    JOIN (
        SELECT
            messageId,
            maxIf(userId, eventId = 'E032') AS userId,
            maxIf(orgId, eventId = 'E032') AS orgId,
            maxIf(botId, eventId = 'E032') AS botId,
            maxIf(audioFileName, eventId = 'E002') as s2tInput,
            maxIf(conversationId, eventId = 'E032') AS conversationId,
            maxIf(spellCorrectedText, eventId = 'E002') AS spellCorrectedText,
            maxIf(text, eventId = 'E032') AS query,
            maxIf(timestamp, eventId = 'E017') AS responseAt,
            maxIf(
                prompt, 
                eventId = 'E012'
                AND timeTaken > 0
            ) AS prompt,
            maxIf(
                translatedResponse, 
                eventId = 'E012'
                AND timeTaken > 0
            ) AS translatedResponse,
            maxIf(
                text,
                eventId = 'E008'
                AND timeTaken > 0
            ) AS coreferencedText,
            maxIf(
                queryClass,
                eventId = 'E009'
                AND timeTaken > 0
            ) AS queryClass,
            maxIf(
                NER,
                eventId = 'E011'
                AND timeTaken > 0
            ) AS NER,
            maxIf(
                text,
                eventId = 'E012'
                AND timeTaken > 0
            ) AS response,
            groupArray(tuple(eventId, subEvent, error)) AS error,
            maxIf(reactionType, eventId = 'E023') AS reactionType,
            maxIf(reactionText, eventId = 'E023') AS reactionText,
            maxIf(timesAudioUsed, eventId = 'E015') AS timesAudioUsed,
            maxIf(phoneNumber, eventId = 'E032') AS phoneNumber,
            maxIf(district, eventId = 'E006') AS district,
            maxIf(block, eventId = 'E006') AS block
        FROM
            event
        GROUP BY
            messageId
    ) AS e2 ON e1.messageId = e2.messageId
    JOIN (
        SELECT
            messageId,
            maxIf(
                timeTaken,
                eventId = 'E005'
                AND timeTaken > 0
            ) AS getUserHistoryLatency,
            maxIf(
                text,
                eventId = 'E023'
            ) AS reactionText
        FROM
            event
        GROUP BY
            messageId
    ) AS e3 ON e1.messageId = e3.messageId
    JOIN (
        SELECT
            messageId,
            maxIf(
                timeTaken,
                eventId = 'E008'
                AND timeTaken > 0
            ) AS getNeuralCoreferenceLatency
        FROM
            event
        GROUP BY
            messageId
    ) AS e4 ON e1.messageId = e4.messageId
    JOIN (
        SELECT
            messageId,
            maxIf(
                timeTaken,
                eventId = 'E009'
                AND timeTaken > 0
            ) AS classifyQuestionLatency
        FROM
            event
        GROUP BY
            messageId
    ) AS e5 ON e1.messageId = e5.messageId
    JOIN (
        SELECT
            messageId,
            maxIf(
                timeTaken,
                eventId = 'E010'
                AND timeTaken > 0
            ) AS getSimilarDocsLatency
        FROM
            event
        GROUP BY
            messageId
    ) AS e6 ON e1.messageId = e6.messageId
    JOIN (
        SELECT
            messageId,
            maxIf(
                timeTaken,
                eventId = 'E012'
                AND timeTaken > 0
            ) AS getResponseLatency
        FROM
            event
        GROUP BY
            messageId
    ) AS e7 ON e1.messageId = e7.messageId
    JOIN (
        SELECT
            messageId,
            maxIf(
                timeTaken,
                eventId = 'E011'
                AND timeTaken > 0
            ) AS NERLatency
        FROM
            event
        GROUP BY
            messageId
    ) AS e8 ON e1.messageId = e8.messageId
    JOIN (
        SELECT
            messageId,
            maxIf(
                timeTaken,
                eventId = 'E014'
                AND timeTaken > 0
            ) AS T2SLatency
        FROM
            event
        GROUP BY
            messageId
    ) AS e9 ON e1.messageId = e9.messageId
    JOIN (
        SELECT
            messageId,
            maxIf(
                timeTaken,
                eventId = 'E002'
            ) AS S2TLatency,
            maxIf(similarChunks, eventId = 'E010') AS similarChunks
        FROM
            event
        GROUP BY
            messageId
    ) AS e10 ON e1.messageId = e10.messageId
    JOIN (
        SELECT
            messageId,
            maxIf(
                timeTaken,
                eventId = 'E047'
            ) AS detectedLatency,
            maxIf(language, eventId = 'E047') AS detectedLanguage
        FROM
            event
        GROUP BY
            messageId
    ) AS e11 ON e1.messageId = e11.messageId
    JOIN (
        SELECT
            messageId,
            maxIf(
                text,
                eventId = 'E007'
                AND timeTaken > 0
            ) AS translatedQuery,
            maxIf(
                timeTaken,
                eventId = 'E007'
                AND timeTaken > 0
            ) AS translateInputLatency,
            maxIf(similarChunks, eventId = 'E010') AS similarChunks
        FROM
            event
        GROUP BY
            messageId
    ) AS e12 ON e1.messageId = e12.messageId;

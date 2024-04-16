CREATE MATERIALIZED VIEW IF NOT EXISTS combined_data 
REFRESH EVERY 10 SECONDS 
ENGINE = MergeTree
ORDER BY timestamp 
SETTINGS allow_nullable_key = 1 AS
SELECT
    e1.messageId AS messageId,
    e1.timestamp AS timestamp,
    e1.spellCheckLatency AS spellCheckLatency,
    e2.userId AS userId,
    e2.orgId AS orgId,
    e2.botId AS botId,
    e2.conversationId AS conversationId,
    e2.s2tInput AS s2tInput,
    e2.spellCorrectedText AS spellCorrectedText,
    e2.finalQuery AS finalQuery,
    e2.queryInEnglish AS queryInEnglish,
    e2.coreferencedText AS coreferencedText,
    e2.queryClass AS queryClass,
    e2.NER AS NER,
    e2.response AS response,
    e2.responseInEnglish AS responseInEnglish,
    e2.error AS error,
    e2.reaction AS reaction,
    e2.timesAudioUsed AS timesAudioUsed,
    e2.phoneNumber AS phoneNumber,
    e2.district AS district,
    e2.block AS block,
    e3.getUserHistoryLatency AS getUserHistoryLatency,
    e4.getNeuralCoreferenceLatency AS getNeuralCoreferenceLatency,
    e5.classifiedQuestionLatency AS classifiedQuestionLatency,
    e6.getSimilarDocsLatency AS getSimilarDocsLatency,
    e7.getResponseLatency AS getResponseLatency,
    e8.NERLatency AS NERLatency,
    e9.T2SLatency AS T2SLatency,
    e10.S2TLatency AS S2TLatency,
    e10.similarChunks AS similarChunks,
    e11.detectedLanguage AS detectedLanguage,
    e11.detectedLatency AS detectedLatency,
    e12.translateInputLatency AS translateInputLatency,
    COALESCE(spellCheckLatency, 0) +
    COALESCE(getUserHistoryLatency, 0) +
    COALESCE(getNeuralCoreferenceLatency, 0) +
    COALESCE(classifiedQuestionLatency, 0) +
    COALESCE(getSimilarDocsLatency, 0) +
    COALESCE(getResponseLatency, 0) +
    COALESCE(NERLatency, 0) +
    COALESCE(T2SLatency, 0) +
    COALESCE(S2TLatency, 0) +
    COALESCE(detectedLatency, 0) +
    COALESCE(translateInputLatency, 0) AS totalLatency
FROM
    (
        SELECT
            messageId,
            maxIf(timeTaken, event = 'E047') AS spellCheckLatency,
            maxIf(timestamp, eventId = 'E032') AS timestamp
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
            maxIf(audioFileName, eventId = 'E002') as audioFileName,
            maxIf(conversationId, eventId = 'E032') AS conversationId,
            maxIf(audioUrl, eventId = 'E002') AS s2tInput,
            maxIf(spellCorrectedText, eventId = 'E047') AS spellCorrectedText,
            maxIf(text, eventId = 'E032') AS query,
            maxIf(
                text,
                eventId = 'E007'
                AND timeTaken > 0
            ) AS finalQuery,
            maxIf(
                text,
                eventId = 'E007'
                AND timeTaken > 0
            ) AS queryInEnglish,
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
                response,
                eventId = 'E012'
                AND timeTaken > 0
            ) AS response,
            maxIf(
                textInEnglish, 
                eventId = 'E012'
                AND timeTaken > 0
            ) AS responseInEnglish,
            groupArray(tuple(eventId, subEvent, error)) AS error,
            maxIf(reaction, eventId = 'E023') AS reaction,
            maxIf(timesAudioUsed, eventId = 'E015') AS timesAudioUsed,
            maxIf(phoneNumber, eventId = 'E004') AS phoneNumber,
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
            ) AS getUserHistoryLatency
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
            ) AS classifiedQuestionLatency
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
                eventId = 'E045'
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
                eventId = 'E046'
                AND timeTaken > 0
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
            maxIf(language, eventId = 'E010') AS detectedLanguage
        FROM
            event
        GROUP BY
            messageId
    ) AS e11 ON e1.messageId = e11.messageId
    JOIN (
        SELECT
            messageId,
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
 
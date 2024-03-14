const fs = require('fs');
const csv = require('csv-parser');

const ajvTypeObjectMapping = {
    string: {
        type: 'string'
    },
    uuid: {
        type: 'string',
        format: 'uuid'
    },
    url: {
        type: 'string',
        format: 'url'
    },
    date: {
        type: 'string',
        format: 'iso-date-time'
    },
    json: {
        type: 'object'
    },
    array: {
        type: 'array'
    },
    number: {
        type: 'number'
    }
}

const ajvClickhouseTypeMapping = {
    number: 'UInt32',
    string: 'String',
    url: 'String',
    uuid: 'UUID',
    date: 'DateTime',
    json: 'String',
    array: 'String'
}

const schemaDraft = "http://json-schema.org/draft-07/schema#";

let header = null;
const schemaList = [];
let lastEventName;
let lastEventId;

fs.createReadStream('events.csv')
  .pipe(csv())
  .on('data', (row) => {
    if (!header) header = Object.keys(row);
    if (row['eventId'] === '') {
        row['eventId'] = lastEventId;
    }
    if (row['eventName'] === '') {
        row['eventName'] = lastEventName;
    }
    const eventId = row['eventId']
    const eventName = row['eventName'];
    lastEventId = eventId;
    lastEventName = eventName;
    const subEventName = row['subEventName'];
    const eventDesc = row['When is it generated'];
    // const eventDescJson = row['Event Desc (JSON)'];

    const schema = {
        '$schema': schemaDraft,
        type: 'object',
        properties: {},
        required: [],
        description: eventDesc
    };

    const keys = Object.keys(row)
    for (let i = 6; i < keys.length; i++) {
        if (row[keys[i]] === '') continue;
        let key = keys[i].split(' | ')[0];
        let dataType = keys[i].split(' | ')[1];
        let value = row[keys[i]];
        if (value.trim().toLowerCase() === 'required') {
            schema.required.push(key);
        }
        schema.properties[key] = ajvTypeObjectMapping[dataType.trim().toLowerCase()];
    }
    schemaList.push({
        eventProperties: {
            eventId: eventId,
            eventName: eventName,
            subEventName: subEventName
        },
        eventSchema: schema
    })
  })
  .on('end', () => {
    generateDocs(schemaList);
    generateMigrationSql(header, '1');
  });

function h1(text) {
    return `# ${text}\n`;
}

function h2(text) {
    return `## ${text}\n`;
}

function h3(text) {
    return `### ${text}\n`;
}

function plainText(text) {
    return `${text}\n`;
}

function codeChunk(text, type) {
    return `\`\`\`${type}\n${convertToIndentedJson(text)}\n\`\`\`\n`;
}

function convertToIndentedJson(jsonObject) {
    const indentedJsonText = JSON.stringify(jsonObject, null, 4);
    return indentedJsonText;
}

function generateDocs(schemaList) {
    let docs = '';
    docs = docs + h1('Event Data')
    docs = docs + plainText('These are auto-generated schema specification through CSV')
    const eventMap = {};
    for (let i = 0; i < schemaList.length; i++) {
        if (!eventMap[schemaList[i].eventProperties.eventName]) {
            eventMap[schemaList[i].eventProperties.eventName] = []
        }
        eventMap[schemaList[i].eventProperties.eventName].push(schemaList[i])
    }
    const eventNames = Object.keys(eventMap);
    for (const event of eventNames) {
        docs = docs + h2(event);
        for (const schema of eventMap[event]) {
            // console.log(schema);
            docs = docs + h3(schema.eventProperties.subEventName);
            docs = docs + plainText(`When is it generated: ${schema.eventSchema.description}`);
            docs = docs + codeChunk(schema.eventSchema, 'json')
        }
    }
    fs.writeFileSync('event-schema-docs.md', docs);
}

function generateMigrationSql(headers, version) {
    let sql = '';
    sql = sql + `CREATE TABLE IF NOT EXISTS events_v${version}\n`;
    sql = sql + `(\n`
    sql = sql + `\tgenerator String,\n`
    sql = sql + `\ttimestamp DateTime,\n`
    sql = sql + `\tname String,\n`
    sql = sql + `\tactorId String,\n`
    sql = sql + `\tactorType String,\n`
    sql = sql + `\tenv String,\n`
    sql = sql + `\teventId String,\n`
    sql = sql + `\tevent String,\n`
    sql = sql + `\tsubEvent String,\n`
    sql = sql + `\ttimeTaken UInt32`    
    for (let i = 6; i < headers.length; i++) {
        sql = sql + `,\n`
        const field = headers[i].split(' | ')[0].trim();
        const type = headers[i].split(' | ')[1].trim();
        sql = sql + `\t${field} ${ajvClickhouseTypeMapping[type]}`
    }
    sql = sql + `\n)\n`
    sql = sql + `ENGINE = MergeTree\n`
    sql = sql + `ORDER BY timestamp;\n`
    fs.writeFileSync('clickhouse.migration.sql', sql);
}
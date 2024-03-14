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
    generateDocs(schemaList)
    // console.log(header, header.length)
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
    // Use JSON.stringify with a space parameter to convert JSON object to indented JSON text
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
    console.log(docs);
    fs.writeFileSync('event-schema-docs.md', docs);
}
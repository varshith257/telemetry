const fs = require('fs');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const schemaList = JSON.parse(fs.readFileSync('schema.json'));
  for (const schema of schemaList) {
    await prisma.eventSchemaV1.upsert({
      where: {
        event_id: schema.eventProperties.eventId
      },
      create: {
        event_id: schema.eventProperties.eventId,
        event: schema.eventProperties.eventName,
        subEvent: schema.eventProperties.subEventName,
        schema: schema.eventSchema
      },
      update: {
        event: schema.eventProperties.eventName,
        subEvent: schema.eventProperties.subEventName,
        schema: schema.eventSchema
      }
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
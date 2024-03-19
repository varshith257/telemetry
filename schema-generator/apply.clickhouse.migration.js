const clickhouse = require('clickhouse');
const fs = require('fs');

function readSQLFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function executeQueries(queries, client) {
  for (const query of queries) {
    try {
      const result = await client.query(query).toPromise();
      console.log('Query executed successfully:', result);
    } catch (error) {
      console.error('Error executing query:', error);
    }
  }
}

async function runSQLFile(filePath, client) {
  try {
    const sql = await readSQLFile(filePath);
    const queries = sql.split(';').filter(q => q.trim() !== '');
    await executeQueries(queries, client);
  } catch (error) {
    console.error('Error reading SQL file:', error);
  }
}

async function main() {
  const client = new clickhouse.ClickHouse({
    host: process.env.CLICKHOUSE_HOST,
    port: process.env.CLICKHOUSE_PORT,
    database: process.env.CLICKHOUSE_DB,
    basicAuth: {
      username: process.env.CLICKHOUSE_USER,
      password: process.env.CLICKHOUSE_PASSWORD,
    },
    format: 'json'
  });
  runSQLFile('clickhouse.migration.sql', client);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    console.info('Table created in clickhouse');
  });
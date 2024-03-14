const ClickHouse = require('clickhouse');

const clickhouse = new ClickHouse({
  url: 'http://localhost',
  port: 19000,
});

async function applyMigrations() {
  // Get current database version
  const { data: currentVersionRows } = await clickhouse.query('SELECT MAX(version) AS version FROM migrations');
  const currentVersion = currentVersionRows.length > 0 ? currentVersionRows[0].version : 0;

  // Load migration files
  const fs = require('fs');
  const migrationFiles = fs.readdirSync('./migrations').sort();

  for (const migrationFile of migrationFiles) {
    const version = parseInt(migrationFile.split('_')[0], 10);

    if (version > currentVersion) {
      console.log(`Applying migration: ${migrationFile}`);

      const migrationQuery = fs.readFileSync(`./migrations/${migrationFile}`, 'utf8');
      await clickhouse.query(migrationQuery);

      // Update migrations table with applied version
      await clickhouse.query(`INSERT INTO migrations (version) VALUES (${version})`);

      console.log(`Migration ${version} applied successfully.`);
    }
  }
}

applyMigrations().catch(console.error);

#!/bin/sh

cd schema-generator
export CLICKHOUSE_HOST=$CLICKHOUSE_HOST
export CLICKHOUSE_DB=$CLICKHOUSE_DB
export CLICKHOUSE_USER=$CLICKHOUSE_USER
export CLICKHOUSE_PASSWORD=$CLICKHOUSE_PASSWORD
node parse.event.csv.js
if [ $? -eq 9 ]; then
    echo "Exiting script. Unavailable Mappings"
    exit 1
fi
node update.event.schema.js
node apply.clickhouse.migration.js
#!/bin/sh

cd schema-generator
node parse.event.csv.js
node update.event.schema.js
export CLICKHOUSE_HOST=$CLICKHOUSE_HOST
export CLICKHOUSE_DB=$CLICKHOUSE_DB
export CLICKHOUSE_USER=$CLICKHOUSE_USER
export CLICKHOUSE_PASSWORD=$CLICKHOUSE_PASSWORD
node apply.clickhouse.migration.js
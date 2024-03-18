#!/bin/sh

cd schema-generator
node parse.event.csv.js
node update.event.schema.js
source ../.env
node apply.clickhouse.migration.js
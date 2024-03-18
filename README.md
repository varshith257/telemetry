# About
This services let's you create 

## Project Setup
Follow these instructions to setup the project.

Install node modules
```
npm i
```

Copy event `CSV` to schema-generator as `events.csv`, which is in [this format](https://docs.google.com/spreadsheets/d/1B1_Z5RxG-mpv0pJ78BPH0Qqzh_Y-9YkQrCb3WlYnYpI/edit#gid=1082552687).

Change directory to root of the project, and run `./setup.sh`. This will generate schema and migrations from provided `CSV` and update Postgres DB with the generated schema of events.

Update .env according to your service
```
DATABASE_URL="postgresql://johndoe:randompassword@localhost:7654/mydb?schema=public"
DATABASE_USERNAME="johndoe"
DATABASE_PASSWORD="randompassword"
DATABASE_NAME="mydb"
DATABASE_PORT="7654"

CLICKHOUSE_HOST="http://localhost:18123"
CLICKHOUSE_DB="my_database"
CLICKHOUSE_USER="username"
CLICKHOUSE_PASSWORD="password"
```

Start the server using
```
npm run start:prod
```
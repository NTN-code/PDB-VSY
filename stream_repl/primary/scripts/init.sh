#!/bin/bash
set -e

# chown postgres:postgres /var/lib/postgresql/.pgpass
# chmod 0600 ~/.pgpass

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER repluser WITH REPLICATION ENCRYPTED PASSWORD '$REPL_USER_PASS' LOGIN;
    SELECT pg_reload_conf();
EOSQL

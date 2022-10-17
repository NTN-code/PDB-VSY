#!/bin/bash
set -e

chown postgres:postgres ~/.pgpass
chmod 0600 ~/.pgpass

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT pg_reload_conf();
EOSQL

pg_basebackup --host=172.28.0.2 --username=repluser --pgdata=/var/lib/postgresql/repl --wal-method=stream --write-recovery-conf 

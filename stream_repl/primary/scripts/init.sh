#!/bin/bash
set -e

chmod 0600 /var/lib/postgresql/.pgpass

export PGPASSFILE='/var/lib/postgresql/.pgpass'

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE $EXAMPLE_DB;

    CREATE USER repluser WITH REPLICATION ENCRYPTED PASSWORD '$REPL_USER_PASS' LOGIN;

    CREATE USER staff WITH NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT LOGIN REPLICATION ENCRYPTED PASSWORD 'staff';
    GRANT CONNECT, TEMPORARY ON DATABASE vsy TO staff; 
    GRANT pg_read_all_data TO staff;

    SELECT pg_reload_conf();
EOSQL

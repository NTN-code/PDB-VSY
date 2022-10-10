#!/bin/bash
set -e

chown postgres:postgres /var/lib/postgresql/.pgpass
chmod 0600 /var/lib/postgresql/.pgpass

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT pg_reload_conf();
EOSQL

pg_basebackup --host=172.28.0.2 --username=repluser --pgdata=/var/lib/postgresql/repl --wal-method=stream --write-recovery-conf 


# rm -rf /var/lib/postgresql/data/*

# su postgres -c "pg_basebackup -h 192.168.0.14 -D /var/lib/postgresql/data -P -U repluser --xlog-method=stream"
# su postgres -c "pg_basebackup -P -R -X stream -c fast -h 192.168.0.14 -U repluser -D /var/lib/postgresql/data"
# su - postgres
# cp -R /var/lib/postgresql/data /var/lib/postgresql/data_orig
# pg_basebackup -h 192.168.0.11 -D /var/lib/postgresql/data -U repluser -P -v  -R -X stream -C -S standby1

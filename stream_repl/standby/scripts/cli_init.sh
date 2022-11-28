#!/bin/bash
set -e

# chown postgres:postgres ~/.pgpass
# chmod 0600 ~/.pgpass

pg_basebackup --host=172.28.0.2 --username=repluser --pgdata=/var/lib/postgresql/repl --wal-method=stream --write-recovery-conf 

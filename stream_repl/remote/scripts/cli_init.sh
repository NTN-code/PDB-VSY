#!/bin/bash

chown postgres:postgres /var/lib/postgresql/.pgpass
chmod 0600 /var/lib/postgresql/.pgpass


# postgres -c "pg_basebackup -h 192.168.0.14 -D /var/lib/postgresql/data -P -U repluser --xlog-method=stream"

# pg_basebackup --host=172.28.0.2 --username=repluser --pgdata=/var/lib/postgresql/repl --wal-method=stream --write-recovery-conf 

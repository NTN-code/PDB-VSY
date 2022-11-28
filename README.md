# TODO
- [x] Set good behavior volume
- [x] make pg_hba.conf file for replication
- [x] test replication 

# Primary

`su -l postgres`
`createuser -l --replication repluser -P`
`table pg_hba_file_rules ;`
`SHOW ALL ;`
`TABLE pg_settings ;`
`TABLE pg_file_settings ;`
`docker restart db-primary-1`

`docker network inspect stream_repl_default`

`pg_dump`
`pg_dumpall`
`pg_basebackup`
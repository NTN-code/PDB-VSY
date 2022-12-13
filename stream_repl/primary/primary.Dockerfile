FROM postgres:14.5

RUN apt-get update && \
    apt-get install -y nano && \
    apt-get install -y jq && \
    apt-get install -y cron && \
    apt-get install -y curl && \
    apt-get install -y openssh-server && \
    apt-get install -y openssl

RUN crontab -l | { cat; echo "* * * * * /etc/postgresql/scripts/dump_json_db.sh"; } | crontab -

RUN openssl req -nodes -new -x509 -keyout /var/lib/postgresql/server.key -out /var/lib/postgresql/server.crt -subj '/C=US/L=NYC/O=Percona/CN=postgres'

RUN chmod 400 /var/lib/postgresql/server.crt && chown postgres:postgres /var/lib/postgresql/server.crt && \
    chmod 400 /var/lib/postgresql/server.key && chown postgres:postgres /var/lib/postgresql/server.key

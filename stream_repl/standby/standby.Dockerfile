FROM postgres:14.5

RUN apt-get update && \
    apt-get install -y nano


COPY ./standby/scripts/cli_init.sh ./etc/postgresql/cli_init.sh


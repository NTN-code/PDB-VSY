FROM postgres:14.5

RUN apt-get update && \
    apt-get install -y nano


COPY ./pgpass ~/.pgpass
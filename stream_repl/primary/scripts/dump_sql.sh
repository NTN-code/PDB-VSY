#!/bin/bash

set -e 

dump_name=$(date +%Y_%m_%d_%H_%M)

mkdir -p /etc/postgresql/scripts/dumps/
touch /etc/postgresql/scripts/dumps/$dump_name.sql
chown postgres:postgres /etc/postgresql/scripts/dumps/$dump_name.sql

chown postgres:postgres /etc/postgresql/scripts/dumps/
chmod 0777 /etc/postgresql/scripts/dumps/

su -c "pg_dump --host=172.28.0.2 --username=postgres --dbname=$EXAMPLE_DB -w --file=/etc/postgresql/scripts/dumps/$dump_name.sql --format=p --if-exists --create --clean --verbose --column-inserts" postgres


# pg_dump — это программа для создания резервных копий базы данных PostgreSQL. Она создаёт целостные копии, даже если база параллельно используется. Программа pg_dump не препятствует доступу других пользователей к базе данных (ни для чтения, ни для записи).
# Программа pg_dump выгружает только одну базу данных. Чтобы сохранить глобальные объекты, относящиеся ко всем базам в кластере, например, роли и табличные пространства, воспользуйтесь программой pg_dumpall.
# Для восстановления из архивных форматов файлов используется утилита pg_restore. Эти форматы позволяют указывать pg_restore какие объекты базы данных восстановить, а также позволяют изменить порядок следования восстанавливаемых объектов. Архивные форматы файлов спроектированы так, чтобы их можно были переносить на другие платформы с другой архитектурой.
# https://postgrespro.ru/docs/postgresql/9.6/app-pgdump


# --column-inserts !!!!
# --attribute-inserts
# Выгружать данные в виде команд INSERT с явно задаваемыми именами столбцов (INSERT INTO таблица (столбец, ...)
# VALUES ...). При этом восстановление будет очень медленным; в основном это применяется для выгрузки данных,
#  которые затем будут загружаться не в PostgreSQL.

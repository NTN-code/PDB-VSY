#!/bin/bash
set -e

dump_name=$(date +%Y_%m_%d_%H_%M)

myArray=("categories" "comments" "orderdetails" "orders" "products" "users")

mkdir -p /etc/postgresql/scripts/dumps/

for str in ${myArray[@]}; do
    echo $str
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$EXAMPLE_DB" <<-EOSQL
    \t
    \a
    \o /etc/postgresql/scripts/dumps/${str}_${dump_name}.json
    SELECT array_to_json(array_agg(row_to_json(t))) FROM $str t;
EOSQL
done

#!/bin/bash
set -e

myArray=("categories" "comments" "orderdetails" "orders" "products" "subcategories" "users")

mkdir /var/lib/postgresql/data/json_data/

for str in ${myArray[@]}; do
    echo $str
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$EXAMPLE_DB" <<-EOSQL
    \t
    \a
    \o /var/lib/postgresql/data/json_data/$str.json
    SELECT array_to_json(array_agg(row_to_json(t))) FROM $str t;
EOSQL
done

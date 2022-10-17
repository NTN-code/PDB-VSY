#!/bin/bash

set -e 

myArray=("categories" "comments" "orderdetails" "orders" "products" "subcategories" "users")



for str in ${myArray[@]}; do
    echo $str
    jq -c '.[]' /etc/postgresql/scripts/json_data/$str.json > /etc/postgresql/scripts/json_data/${str}_valid.json

    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$EXAMPLE_DB" <<-EOSQL
        CREATE TABLE temp (data jsonb);
        \COPY temp (data) FROM '${str}_valid.json';
        SELECT data->>'id', data->>'first_name' FROM temp;
        CREATE TABLE users (id SERIAL, first_name TEXT);

        INSERT INTO users SELECT (data->>'id')::integer, data->>'first_name' FROM temp;
        DROP TABLE temp;

EOSQL
done
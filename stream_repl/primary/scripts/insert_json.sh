#!/bin/bash

set -e 
myArray=( "users" "categories" "products" "orders" "orderdetails" "comments" )

for str in ${myArray[@]}; do
    echo $str
    jq -c '.[]' /etc/postgresql/scripts/json_data/$str.json > /etc/postgresql/scripts/json_data/${str}_valid.json

    # psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$EXAMPLE_DB" <<-EOSQL
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "vsy" <<-EOSQL
        DROP TABLE IF EXISTS temp;

        CREATE TABLE temp (data jsonb);
        \COPY temp (data) FROM 'json_data/${str}_valid.json';    
EOSQL

    if [ "$str" == "users" ]; then 
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "vsy" <<-EOSQL
        INSERT INTO users(email, password, name, surname, country, city, address, phone, role, created_at, updated_at) 
        SELECT data->>'email', data->>'password', data->>'name', data->>'surname', data->>'country', data->>'city', data->>'address',
        data->>'phone', (data->>'role')::integer, (data->>'created_at')::timestamp, (data->>'updated_at')::timestamp FROM temp;
EOSQL

    elif [ "$str" == "categories" ]; then
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "vsy" <<-EOSQL
        INSERT INTO categories (name, image) SELECT data->>'name', (decode(data->>'image', 'hex'))::bytea FROM temp;
EOSQL

    elif [ "$str" == "products" ]; then
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "vsy" <<-EOSQL
        INSERT INTO products (name, weight, description, image, stock, price, category_id) 
        SELECT data->>'name', (data->>'weight')::double precision, data->>'description', (decode(data->>'image', 'hex'))::bytea, (data->>'stock')::integer, 
        (data->>'price')::double precision, (data->>'category_id')::integer FROM temp;
EOSQL

    elif [ "$str" == "comments" ]; then
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "vsy" <<-EOSQL
        INSERT INTO comments (text, user_id, product_id) 
        SELECT data->>'text', (data->>'user_id')::integer, (data->>'product_id')::integer 
        FROM temp;
EOSQL

    elif [ "$str" == "orders" ]; then
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "vsy" <<-EOSQL
        INSERT INTO orders (status, amount, created_at, user_id) 
        SELECT data->>'status', (data->>'amount')::integer, (data->>'created_at')::timestamp, (data->>'user_id')::integer 
        FROM temp;
EOSQL

    elif [ "$str" == "orderdetails" ]; then
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "vsy" <<-EOSQL
        INSERT INTO orderdetails (order_id, product_id) 
        SELECT (data->>'order_id')::integer, (data->>'product_id')::integer 
        FROM temp;
EOSQL
    fi

    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "vsy" <<-EOSQL
        DROP TABLE temp;
EOSQL
done
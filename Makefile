
master_docker := master.Dockerfile
master_image_tag := master_psql
master_container_name := master_db

slave_docker := slave.Dockerfile
slave_image_tag := slave_psql
slave_container_name := slave_db

create_master_image_psql:
	docker build --tag $(master_image_tag) -f $(master_docker) .

create_slave_psql_image_psql:
	docker build --tag $(slave_image_tag) -f $(slave_docker) .

create_container_master_psql:
	docker create --name $(master_container_name) -t -i $(master_image_tag) 
# --env-file
# --health-cmd
# --health-interval
# --health-retries
# --ip
# --net
# --volume

create_container_slave_psql:
	docker create --name $(slave_container_name) -t -i $(slave_image_tag) 
# --env-file
# --health-cmd
# --health-interval
# --health-retries
# --ip
# --net
# --volume

run_master:
	docker run -d  -p 15432:5432



# get the default config
get_sample_config:
	docker run -i --rm postgres cat /usr/share/postgresql/postgresql.conf.sample > my-postgres.conf


# run postgres with custom config
run_postgres_custom_config:
	docker run -d --name some-postgres -v "$PWD/my-postgres.conf":/etc/postgresql/postgresql.conf -e POSTGRES_PASSWORD=mysecretpassword postgres -c 'config_file=/etc/postgresql/postgresql.conf'



primary_up:
	docker-compose -f ./local.yml up db-primary -d

primary_bash:
	docker exec -it stream_repl_primary-1 bash

standby_up:
	docker-compose -f ./local.yml up db-standby -d
	docker network inspect db-network && \
	echo "Change CIDR in standby.pg_hba.conf!" && \
	echo "Change .pgpass in standby!" && \
	docker-compose stop db-standby



primary_up:
	docker-compose -f ./local.yml up db-primary -d && \
	timeout 20


primary_bash:
	docker exec -it primary-main bash

standby_up:
	echo "Get subnet from ipconfig" && \
	echo "Change CIDR in standby.pg_hba.conf!" && \
	echo "Change .pgpass in standby!" && \
	docker-compose -f ./local.yml up db-standby -d && \
	echo "pg_basebackup --host=172.28.0.2 --username=repluser --pgdata=/var/lib/postgresql/repl --wal-method=stream --write-recovery-conf \n chown postgres:postgres /var/lib/postgresql/.pgpass \n chmod 0600 /var/lib/postgresql/.pgpass" && \
	timeout 15
	- docker exec -it db-standby bash  && \
	docker stop db-standby  && \
	timeout 15 && \
	sudo rm -r ./standby/standby-db-data/* && \
	timeout 5 
	sudo move ./standby/standby-db-repl/* ./standby/standby-db-data/ && \
	timeout 2 && \
	docker start db-standby

standby_bash:
	docker exec -it stream_repl_standby-1 bash

start:
	make primary_up && \
	make standby_up
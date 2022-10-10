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
	timeout 15
	- docker exec -it db-standby bash  && \
	docker stop db-standby  && \
	timeout 15 && \
	sudo rm -r ./standby/standby-db-data/* && \
	timeout 2 && \
	move ./standby/standby-db-repl/* ./standby/standby-db-data/ && \
	docker start db-standby

standby_bash:
	docker exec -it stream_repl_standby-1 bash

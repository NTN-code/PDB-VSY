remote_up:
	echo "Get subnet from ipconfig" && \
	echo "Change CIDR in standby.pg_hba.conf!" && \
	echo "Change .pgpass in standby!" && \
	docker-compose -f ./local.yml up db-remote -d && \
	echo "pg_basebackup --host=ipv4 --username=repluser --pgdata=/var/lib/postgresql/repl --wal-method=stream --write-recovery-conf" && \
	timeout 15
	- docker exec -it db-remote bash  && \
	docker stop db-remote  && \
	timeout 15 && \
	sudo rm -r ./remote-db-data/* && \
	timeout 2 
	sudo move ./remote-db-repl/* ./remote-db-data/ && \
	timeout 2 && \
	docker start db-remote
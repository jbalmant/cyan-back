SHELL=/bin/bash

help:
	@echo 'Makefile'
	@echo ''
	@echo 'Usage:'
	@echo '		make docker-start			Start all dockers'
	@echo '		make docker-stop			Stop all dockers'


docker-start:
	docker-compose up -d


docker-stop:
	docker-compose down
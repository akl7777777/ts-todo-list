SHELL := /bin/bash
export PATH := $(PATH):/usr/local/bin:/usr/bin

.PHONY: up down build logs

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose up --build -d

logs:
	docker compose logs -f

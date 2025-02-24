#!/bin/bash

docker compose up -d --build

## Spring Boot 컨테이너가 정상적으로 실행될 때까지 대기
#./wait-for-it.sh localhost:8080 -t 90 --strict -- echo "Spring Boot is up!"

## Gatling 부하 테스트 실행
#./stress-loader/mvnw gatling:test

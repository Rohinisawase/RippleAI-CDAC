#!/bin/bash

echo "Starting all microservices..."

services=(
  "Notifications"
  "PostService"
  "FeedService"
  "UserService"
)

for service in "${services[@]}"
do
  echo "Starting $service..."
  (
    cd "$service" || exit
    export $(cat .env | xargs)
    mvn spring-boot:run
  ) &
done

wait

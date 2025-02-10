#!/bin/bash

DELAY=10


# Stop containers

docker compose -f docker-compose-dev.yml down || {
    echo "Error: Failed to stop app container"
    exit 1
}


docker compose -f docker-compose-mongo-auth.yml down || {
    echo "Error: Failed to start mongo-auth containers"
    exit 1
}


# Check if smart-cart-network exists if not create one
docker network inspect smart-cart-network > /dev/null 2>&1
if [ $? -ne 0 ]; then
  docker network create smart-cart-network || {
    echo "Error: Failed to create smart-cart-network"
    exit 1
  }
fi



# Start Mongodb replication containers
docker compose -f docker-compose-mongo.yml up --build -d || {
    echo "Error: Failed to start mongo containers"
    exit 1
}


echo "****** Waiting for ${DELAY} seconds for Mongo containers to go up ******"
sleep $DELAY


# Initialize the Mongodb replica set
docker exec mongo1 bash -c "/scripts/rs-init.sh" || {
    echo "Error: Failed to initialize mongo replica set"
    exit 1
}


docker compose -f docker-compose-mongo.yml down || {
    echo "Error: Failed to stop mongo containers"
    exit 1
}
echo "****** Waiting for ${DELAY} seconds for Mongo containers down ******"
sleep $DELAY

docker compose -f docker-compose-mongo-auth.yml --env-file ./.env.mongo-variables up  --build -d || {
    echo "Error: Failed to start mongo-auth containers"
    exit 1
}


echo "****** Waiting for ${DELAY} seconds for mongo-auth containers to go up ******"
sleep $DELAY

# Start the application containers
docker compose -f docker-compose-dev.yml up --build -d || {
    echo "Error: Failed to start application containers"
    exit 1
}

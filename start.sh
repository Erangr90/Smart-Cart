#!/bin/bash

DELAY=10


# Stop and remove containers

docker compose -f docker-compose-dev.yml down || {
    echo "Error: Failed to stop app container"
    exit 1
}

docker compose -f docker-compose-redis.yml --env-file redis.env down || {
    echo "Error: Failed to stop app container"
    exit 1
}

docker compose -f docker-compose-mongo-auth.yml --env-file mongo-variables.env down || {
    echo "Error: Failed to start mongo-auth containers"
    exit 1
}

# Remove volumes
if [ -n "$(docker volume ls -q)" ]; then
    docker volume rm $(docker volume ls -q) || {
        echo "Error: Failed to remove volumes"
        exit 1
    }
fi

# Check if api-network exists if not create one
docker network inspect api-network > /dev/null 2>&1
if [ $? -ne 0 ]; then
  docker network create api-network || {
    echo "Error: Failed to create api-network"
    exit 1
  }
fi



# Start Mongodb repliction containers
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

docker compose -f docker-compose-mongo-auth.yml --env-file mongo-variables.env up  --build -d || {
    echo "Error: Failed to start mongo-auth containers"
    exit 1
}



# Start Redis replication containers
docker compose -f docker-compose-redis.yml up --build -d || {
    echo "Error: Failed to start redis containers"
    exit 1
}

echo "****** Waiting for ${DELAY} seconds for Redis containers to go up ******"
sleep $DELAY

# Start the application containers
docker compose -f docker-compose-dev.yml up --build -d || {
    echo "Error: Failed to start application containers"
    exit 1
}

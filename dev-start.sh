#!/bin/bash

DELAY=20


# Stop containers
docker compose -f docker-compose-dev.yml down || {
    echo "Error: Failed to stop app container"
    exit 1
}

echo "****** Waiting for ${DELAY} seconds for the containers go down ******"
sleep $DELAY



# Check if smart-cart-network exists if not create one
docker network inspect smart-cart-network > /dev/null 2>&1
if [ $? -ne 0 ]; then
  docker network create smart-cart-network || {
    echo "Error: Failed to create smart-cart-network"
    exit 1
  }
fi

echo "****** Waiting for ${DELAY} seconds for build network ******"
sleep $DELAY


# Start the application containers
docker compose -f docker-compose-dev.yml up --build -d || {
    echo "Error: Failed to start application containers"
    exit 1
}

echo "****** Waiting for ${DELAY} seconds for containers to go up ******"
sleep $DELAY

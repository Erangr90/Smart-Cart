FROM mongo:latest

# Set the working directory
WORKDIR /scripts

# Copy the init script into the container
COPY rs-init.sh .

# Make the script executable
RUN chmod +x rs-init.sh

# Health check to verify if MongoDB is up
HEALTHCHECK --interval=5s --timeout=3s --retries=3 \
    CMD mongosh --eval "db.runCommand({ ping: 1 })" > /dev/null 2>&1 || exit 1

# Start MongoDB and run the init script
CMD ["bash", "-c", "mongod --bind_ip_all --replSet dbrs & \
    until mongosh --eval 'print(\"waited for connection\")'; do \
        sleep 1; \
    done; \
    ./rs-init.sh"]
FROM mongo:latest

# Set the working directory
WORKDIR /scripts

# Copy the init script into the container
COPY rs-init.sh .

# Make the script executable
RUN chmod +x rs-init.sh

# Start MongoDB and run the init script
CMD ["bash", "-c", "mongod --bind_ip_all --replSet dbrs & sleep 20 && ./rs-init.sh"]
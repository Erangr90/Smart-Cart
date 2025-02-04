# Smart Cart

Web application with a Node.js REST API includes tokens authentication and refreshing, requests logger for analysis, MongoDB replica set with caching database using Redis Master-Slave Replication, and Nginx for load balancer.
Frontend developed using React, Redux, reduxjs/toolkit and Bootstrap.

### Env Variables

Rename the `.env` files to `.env` and add the following

```
NODE_ENV= development
DB_NAME= RESTapiDb
MONGO_URI= mongodb://mongo1:27017,mongo2:27017,mongo3:27017/?replicaSet=dbrs
PORT= 7743
JWT_SECRET= webTokenSecret
ENCRYP_KEY= API Encryption key
LOG_FILE_ROTATION= 30d
LOG_FILE_SIZE= 50M
```

### Run

./Start.sh

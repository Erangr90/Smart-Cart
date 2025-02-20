# Smart Cart - Do The Price For You !

Giving you the cheapest groceries cart at the nearest location.

Multi services web application with a Node.js REST API includes JWT tokens authentication and refreshment, Requests logger for analysis, secured MongoDB replicas set and Nginx server for load balancer.
Include admin operations to control the data.
Frontend developed using React, Redux tool kit and Bootstrap.

Create `.env` file at the api directory and add the following:

```
NODE_ENV= development
MONGO_INITDB_ROOT_USERNAME= curdUser
MONGO_INITDB_ROOT_PASSWORD= adminPass
DB_NAME= SmartCartDb
MONGO_URI= mongodb://mongo1:27017,mongo2:27017,mongo3:27017/?replicaSet=dbrs
PORT= 7743
JWT_SECRET= GTU%&ggp@hgnk-!BK
ENCRYP_KEY= dcBN90^#hjPr66$7
LOG_FILE_ROTATION= 30d
LOG_FILE_SIZE= 50M
PAGINATION_LIMIT= 20

```

Create `.env` file at the root directory for mongoDb and add the following:

```
MONGO_INITDB_ROOT_USERNAME= admin
MONGO_INITDB_ROOT_PASSWORD= admin

```

### Run

./Start.sh

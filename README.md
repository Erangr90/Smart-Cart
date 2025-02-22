# Smart Cart - Do The Price For You !

Giving you the cheapest groceries cart at the nearest location.

Multi services web application with a Node.js REST API includes JWT tokens authentication and refreshment, Requests logger for analysis, secured MongoDB replicas set with user’s permissions management, and Nginx server for load balancer. Include admin operations to control the data.
Frontend developed using React, Redux tool kit and Bootstrap.

# Create `.env` file at the api directory and add the following:

```
NODE_ENV= development
MONGO_INITDB_ROOT_USERNAME= curdUser
MONGO_INITDB_ROOT_PASSWORD= adminPass
DB_NAME= SmartCartDb
MONGO_URI= mongodb://mongo1:27017,mongo2:27017,mongo3:27017/?replicaSet=dbrs
PORT= 5000
JWT_SECRET= 123abc
ENCRYP_KEY= 123abc
LOG_FILE_ROTATION= 30d
LOG_FILE_SIZE= 50M
PAGINATION_LIMIT= 20

```

# Modify the users-init script to your database and users permission:

```

admin = db.getSiblingDB("admin")
admin.createUser(
  {
    user: "adminUser",
    pwd: "adminPass",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
db.getSiblingDB("admin").auth("adminUser", "adminPass")


use SmartCartDb

db.getSiblingDB("admin").createUser(
  {
    "user" : "curdUser",
    "pwd" : "adminPass",
    roles: [ { "role" : "readWrite", "db" : "SmartCartDb" } ]
  }
)

```

# Create `.env` file at the mongo directory for and add the following:

```
MONGO_INITDB_ROOT_USERNAME= adminUser
MONGO_INITDB_ROOT_PASSWORD= adminPass

```

# Run

./Start.sh


#!/bin/bash

DELAY=20


# Create replica-set
mongosh <<EOF

var config = {
    "_id": "dbrs",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "mongo1:27017",
            "priority": 2
        },
        {
            "_id": 2,
            "host": "mongo2:27018",
            "priority": 0
        },
        {
            "_id": 3,
            "host": "mongo3:27019",
            "priority": 0
        }
    ]
};
rs.initiate(config, { force: true });

EOF

echo "****** Waiting for ${DELAY} seconds for Mongo replica-set configuration to be applied ******"

sleep $DELAY

mongosh <<EOF

rs.status()
admin = db.getSiblingDB("admin")
admin.createUser(
  {
    user: "adminUser",
    pwd: "adminPass",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
db.getSiblingDB("admin").auth("adminUser", "adminPass")

db.getSiblingDB("admin").createUser(
  {
    "user" : "replicaAdmin",
    "pwd" : "adminPass",
    roles: [ { "role" : "clusterAdmin", "db" : "admin" } ]
  }
)

use SmartCartDb

db.getSiblingDB("admin").createUser(
  {
    "user" : "curdUser",
    "pwd" : "adminPass",
    roles: [ { "role" : "readWrite", "db" : "SmartCartDb" } ]
  }
)

rs.status()

EOF






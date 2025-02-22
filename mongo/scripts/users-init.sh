
#!/bin/bash

# Create users permission for DB 
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






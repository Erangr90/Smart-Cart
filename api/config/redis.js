import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  // Authenticaion
  // username: process.env.REDIS_USER_NAME,
  // password: process.env.REDIS_PASSWORD,
  // db: 0, // Number of dbs, defaults to 0
  evictionPolicy: "allkeys-lru", // Keeps most recently used keys removes least recently used (LRU) keys
  // Connection Retries
  maxRetriesPerRequest: 3,
  retry_strategy: (options) => {
    if (options.error && options.error.code === "ECONNREFUSED") {
      // Try reconnecting after 5 seconds
      console.error(
        "The server refused the connection. Retrying connection...",
      );
      return 5000;
    }
  },
  //   tls: {
  //     cert: "/path/to/client.crt",
  //     key: "/path/to/client.key",
  //   },
});


// Redis Events
redisClient.on("error", (error) => {
  console.error("Redis Error:", error);
  throw new Error(error.message);
});

redisClient.on("ready", () => {
  console.log("Redis client connected and ready to use");
});

redisClient.on("end", () => {
  console.log("Redis client connection closed");
});

export default redisClient;

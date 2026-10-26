import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("connect", () => {
    console.log("✅ Redis Connected");
});

redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err.message);
});

// IIFE
(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error("❌ Failed to connect to Redis:", err);
    }
})();

export default redisClient;
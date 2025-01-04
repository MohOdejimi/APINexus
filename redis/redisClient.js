require('dotenv').config({ path: './configs/.env' });

const { createClient } = require('redis');

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD || undefined, 
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

(async () => {
    try {
        await redisClient.connect();
        console.log('Redis connection established');
    } catch (err) {
        console.error('Redis connection error:', err);
    }
})();

module.exports = redisClient;

const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis'); // Ensure correct import for RedisStore
const redisClient = require('../redis/redisClient');

const limiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        message: "Too many requests, please try again later.",
    },
});

module.exports = limiter;

// index route

const Route = require("koa-router");
const { logger } = require("../middlewares/logger");
const {mongo} = require("../utils/db");
const { randomString, rawToJSON, dataTransform } = require("../utils/utils");
const indexRoute = new Route();

indexRoute.get("/", async (ctx, next) => {
    
    const instruction = {
        "core-logger": {
            skip: false
        },
        
        execute: async (core) => {
            return core.DB.redisClient.db.get("idiom");
        }
    }
    
    // 给redis 注册一个插件
    const { redisClient: redis } = ctx.resourceManager.DB;
    
    redis.registryPlugin("add", async (redisC, key, value) => {
        return redisC.db.set(key, value);
    })
    redis.registryPlugin("get", async (redisC, key) => {
        return redisC.db.get(key);
    })

    ctx.body = `${await redis.get("tea")}`; // OK了
    await next();
})

module.exports = { indexRoute };

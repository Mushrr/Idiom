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
            // return core.DB.mongoClient.insert("mongotest", {
            //     name: randomString(10),
            //     age: Math.floor(Math.random() * 10)
            // }, { insertMany: false });
            // 查
            const ans = await core.DB.mongoClient.find("mongotest", {}, { iterator: false });
            // 删
            // const ans = await core.DB.mongoClient.del("mongotest", {name: "bbfink4lk8"});
            // 改
            // const ans = await core.DB.mongoClient.update("mongotest", {name: "mf1ctbs440"}, {"$set": { age: 1000 }});
            return ans;
        }
    }
    
    // 插件
    ctx.body = await ctx.resourceManager.DB.mongoClient.add();

    await next();
})

module.exports = { indexRoute };

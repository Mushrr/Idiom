// index route

const Route = require("koa-router");
const {mongo} = require("../utils/db");
const { randomString, rawToJSON } = require("../utils/utils");
const indexRoute = new Route();

indexRoute.get("/", async (ctx, next) => {
    
    // 编写一个指令
    // 执行这个指令
    // logger 会把一些结果自动记录返回
    const instruction = {
        "core-logger": {
            skip: true 
        },
        execute(core) {
            return core.DB.mysqlClient.query("show databases;");
        }
    }
    // let ans = await ctx.resourceManager.execInstruction(instruction);

    // ctx.resourceManager.DB.mysqlClient.registryPlugin("showdb",async function() {
    //     // console.log(this.query);
    //     return rawToJSON(await this.query("show databases;"));
    // })
    ctx.body = await ctx.resourceManager.DB.mysqlClient.showdb();
    await next();
})

module.exports = { indexRoute };

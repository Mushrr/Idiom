// story 路由管理故事信息
// 增加
// 修改
// 删除

const Route = require("koa-router");
const { logger } = require("../../middlewares/logger");


const storyRoute = new Route();

storyRoute.post("/", async (ctx, next) => {
    const token = ctx.cookies.get("token") || ctx.req.headers["authorization"];
    const { mysqlClient: mysql, mongoClient: mongo } = ctx.resourceManager.DB;
    const responseBody = {
        code: 0,
        message: "添加故事",
        data: null
    }
    if ((await mysql.tokenVarify(token)).status === "ok") {

        const data = ctx.request.body;
        const ans = await mongo.storyChange({
            operator: "add",
            storyCode: data.story_code,
            data
        });
        if (ans) {
            responseBody.data = data;
            ctx.status = 200;
            ctx.body = responseBody;
        } else {
            responseBody.code = -1;
            responseBody.message = "添加故事失败";
            responseBody.data = "请检查你填写的信息";
            ctx.status = 500;
            ctx.body = responseBody;
        }
    } else {
        responseBody.code = -1;
        responseBody.message = "你没有权限添加故事";
        responseBody.data = "请登录";
        ctx.body = responseBody;
        ctx.status = 401;
    }
    await next();

})


storyRoute.put("/", async (ctx, next) => {
    const token = ctx.cookies.get("token") || ctx.req.headers["authorization"];
    const { mysqlClient: mysql, mongoClient: mongo } = ctx.resourceManager.DB;
    const responseBody = {
        code: 0,
        message: "修改故事成功",
        data: null
    }
    if ((await mysql.tokenVarify(token)).status === "ok") {
        console.log(ctx.request.body);
        const data = ctx.request.body;
        const ans = await mongo.storyChange({
            operator: "update",

            
            storyCode: data.story_code,
            data
        });
        console.log(ans);
        if (ans) {
            responseBody.data = data;
            ctx.status = 200;
            ctx.body = responseBody;
        } else {
            responseBody.code = -1;
            responseBody.message = "修改故事失败";
            responseBody.data = "请检查你填写的信息";
            ctx.status = 500;
            ctx.body = responseBody;
        }
    } else {
        responseBody.code = -1;
        responseBody.message = "你没有权限添加故事";
        responseBody.data = "请登录";
        ctx.body = responseBody;
        ctx.status = 401;
    }
    await next();
})


storyRoute.delete("/", async (ctx, next) => {
    const token = ctx.cookies.get("token") || ctx.req.headers["authorization"];
    const { mysqlClient: mysql, mongoClient: mongo } = ctx.resourceManager.DB;

    const responseBody = {
        code: 0,
        message: "删除故事成功",
        data: null
    }
    if ((await mysql.tokenVarify(token)).status === "ok") {
        const data = ctx.request.body;
        const ans = await mongo.storyChange({
            operator: "delete",
            storyCode: data.story_code,
            data: data
        });

        if (ans) {
            responseBody.data = data.story_code;
            ctx.status = 200;
            ctx.body = responseBody;
        } else {
            responseBody.code = -1;
            responseBody.message = "删除故事失败";
            responseBody.data = "请检查你填写的信息";
            ctx.status = 500;
            ctx.body = responseBody;
        }
    } else {
        responseBody.code = -1;
        responseBody.message = "你没有权限添加故事";
        responseBody.data = "请登录";
        ctx.body = responseBody;
        ctx.status = 401;
    }
    await next();
})


module.exports = storyRoute;
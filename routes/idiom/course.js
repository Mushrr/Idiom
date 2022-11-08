// 课程路由

const Route = require("koa-router");

const courseRoute = new Route();

courseRoute.post("/", async (ctx, next) => {
    const responseBody = {
        code: 0,
        message: "添加课程",
        data: null
    }
    const { mysqlClient: mysql, mongoClient: mongo } = ctx.resourceManager.DB;
    const token = ctx.cookies.get("token") || ctx.req.headers["authorization"];
    if ((await mysql.tokenVarify(token)).status === "ok") {
        const data = ctx.request.body;
        const ans = await mongo.course({
            operator: "add",
            developer: data.developer,
            data
        });
        if (ans) {
            responseBody.data = data;
            ctx.status = 200;
            ctx.body = responseBody;
        } else {
            responseBody.code = -1;
            responseBody.message = "添加课程失败";
            responseBody.data = "请检查你填写的信息";
            ctx.status = 500;
            ctx.body = responseBody;
        }
    }
    await next();
})


courseRoute.put("/", async (ctx, next) => {
    const responseBody = {
        code: 0,
        message: "修改课程成功",
        data: null
    }
    const { mysqlClient: mysql, mongoClient: mongo } = ctx.resourceManager.DB;
    const token = ctx.cookies.get("token") || ctx.req.headers["authorization"];
    if ((await mysql.tokenVarify(token)).status === "ok") {
        const data = ctx.request.body;
        const ans = await mongo.course({
            operator: "update",
            developer: data.developer,
            data
        });
        if (ans) {
            responseBody.data = data;
            ctx.status = 200;
            ctx.body = responseBody;
        } else {
            responseBody.code = -1;
            responseBody.message = "修改课程失败";
            responseBody.data = "请检查你填写的信息";
            ctx.status = 500;
            ctx.body = responseBody;
        }
    }
    await next();
})


courseRoute.delete("/", async (ctx, next) => {
    const responseBody = {
        code: 0,
        message: "删除课程成功",
        data: null
    }
    const { mysqlClient: mysql, mongoClient: mongo } = ctx.resourceManager.DB;
    const token = ctx.cookies.get("token") || ctx.req.headers["authorization"];
    if ((await mysql.tokenVarify(token)).status === "ok") {
        const data = ctx.request.body;
        const ans = await mongo.course({
            operator: "delete",
            developer: data.developer,
            data
        });
        if (ans) {
            responseBody.data = data;
            ctx.status = 200;
            ctx.body = responseBody;
        } else {
            responseBody.code = -1;
            responseBody.message = "删除课程失败";
            responseBody.data = "请检查你填写的信息";
            ctx.status = 500;
            ctx.body = responseBody;
        }
    }
    await next();
})


module.exports = courseRoute;
// 修改用法，添加，修改，删除等等


const Route = require("koa-router");

const usageRoute = new Route();

usageRoute.post("/", async (ctx, next) => {
    // 添加用法
    const token = ctx.cookies.get("token") || ctx.req.headers["authorization"];
    const { mysqlClient: mysql } = ctx.resourceManager.DB;
    if ((await mysql.tokenVarify(token)).status === "ok") {
        const { usage_code, text } = ctx.request.body;

        const responseBody = await mysql.usageChange({
            operator: "add",
            usageCode: usage_code,
            data: {
                text
            }
        })

        if (responseBody) {
            ctx.status = 200;
            ctx.body = responseBody;
        } else {
            ctx.status = 500;
            ctx.body = {
                code: -1,
                message: "添加用法失败",
                data: "请检查你填写的信息"
            }
        }
    } else {
        ctx.status = 401;
        ctx.body = {
            code: -2,
            message: "你没有权限添加用法",
            data: "请登录"
        }
    }

    await next();
})


usageRoute.put("/", async (ctx, next) => {
    // 修改用法
    const token = ctx.cookies.get("token") || ctx.req.headers["authorization"];

    const { mysqlClient: mysql } = ctx.resourceManager.DB;

    if ((await mysql.tokenVarify(token)).status === "ok") {

        const { usage_code, usage_id, text } = ctx.request.body;
        const responseBody = await mysql.usageChange({
            operator: "update",
            usageCode: usage_code,
            data: {
                usage_id,
                text
            }
        })

        if (responseBody) {
            ctx.status = 200;
            ctx.body = responseBody;
        } else {
            ctx.status = 500;
            ctx.body = {
                code: -1,
                message: "修改用法失败",
                data: "请检查你填写的信息"
            }
        }
    } else {
        ctx.status = 401;
        ctx.body = {
            code: -2,
            message: "你没有权限添加用法",
            data: "请登录"
        }
    }

    await next();
})

usageRoute.delete("/", async (ctx, next) => {
    // 删除用法
    const token = ctx.cookies.get("token") || ctx.req.headers["authorization"];
    const { mysqlClient: mysql } = ctx.resourceManager.DB;

    if ((await mysql.tokenVarify(token)).status === "ok") {
        const { usage_code, usage_id } = ctx.request.body;
        const responseBody = await mysql.usageChange({
            operator: "delete",
            usageCode: usage_code,
            data: {
                usage_id,
            }
        })
        if (responseBody) {
            ctx.status = 200;
            ctx.body = responseBody;
        } else {
            ctx.status = 500;
            ctx.body = {
                code: -1,
                message: "用法删除失败",
                data: "请检查你填写的信息"
            }
        }
    } else {
        ctx.status = 401;
        ctx.body = {
            code: -2,
            message: "你没有权限删除用法",
            data: "请登录"
        }
    }
    await next();
})


module.exports = usageRoute;
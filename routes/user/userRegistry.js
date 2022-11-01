const Route = require("koa-router");


const userRegistryRoute = new Route();

userRegistryRoute.post("/", async (ctx, next) => {
    const { mysqlClient: mysql } = ctx.resourceManager.DB;

    if (await mysql.isUserExist(ctx.request.body.username)) {
        ctx.body = {
            code: 1,
            message: "用户名已存在"
        };
    } else {
        await mysql.addUser(ctx.request.body);
        ctx.body = {
            code: 0,
            message: "注册成功"
        };
    }

    await next();
})

module.exports = userRegistryRoute;
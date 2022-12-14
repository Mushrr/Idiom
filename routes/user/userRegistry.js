const Route = require("koa-router");
const { logger } = require("../../middlewares/logger");


const userRegistryRoute = new Route();

userRegistryRoute.post("/", async (ctx, next) => {
    const { mysqlClient: mysql } = ctx.resourceManager.DB;
    const responseBody = {
        code: 0,
        message: "success",
        data: null,
    }


    try {
        if (await mysql.isUserExist(ctx.request.body.username)) {
            responseBody.code = 1;
            responseBody.message = "user already exist";
            responseBody.data = `${ctx.request.body.username} already exist, you can login with it`;
            ctx.body = responseBody;
            ctx.status = 202;
        } else {
            const res = await mysql.addUser(ctx.request.body);
            console.log(res);
            responseBody.data = `${ctx.request.body.username} register success`;
            ctx.body = responseBody;
            ctx.status = 200;

            // 在user_info_detail 中占个位置

            mysql.insert("user_info_detail", {
                user_id: res.user_id,
                avator: "image/default.jpeg",
            })
        }
    } catch (err) {
        responseBody.code = -1;
        responseBody.message = "register failed";
        responseBody.data = err;
        ctx.body = responseBody;
        ctx.status = 500;
        logger.error(err);
    }

    await next();
})

module.exports = userRegistryRoute;
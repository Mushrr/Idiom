// 只允许改基础信息
// 自我描述，头像，生日，性别


const Route = require("koa-router");

const userInfoUpdateRoute = new Route();


userInfoUpdateRoute.post("/", async (ctx, next) => {
    const { mysqlClient: mysql } = ctx.resourceManager.DB;
    const responseBody = {
        code: 0,
        message: "success",
        data: null,
    }
    const token_id = ctx.cookies.get("token") || ctx.req.headers["authorization"];
    if (token_id) {
        const tokenVarify = await mysql.tokenVarify(token_id);
        if (tokenVarify.status === "ok") {
            if (ctx.request.body.user_id) {
                if (await mysql.isUserExist(ctx.request.body.user_id)) {
                    if (ctx.request.body) {
                        const updateInfo = {};
                        for (let key in ctx.request.body) {
                            if (key !== "user_id" && ctx.request.body[key]) {
                                updateInfo[key] = ctx.request.body[key];
                            }
                        }
                        const updateAns = await mysql.userInfoUpdate(ctx.request.body.user_id, updateInfo);

                        if (updateAns.status === "ok") {
                            responseBody.data = updateInfo; // 返回修改后的信息
                            ctx.body = responseBody;
                            ctx.status = 200;
                        } else {
                            responseBody.code = -2;
                            responseBody.message = "update failed";
                            responseBody.data = "update failed, please check your input";
                            ctx.body = responseBody;
                            ctx.status = 500;
                        }
                    } else {
                        responseBody.code = 1;
                        responseBody.message = "nothing to update";
                        responseBody.data = "nothing to update";
                        ctx.body = responseBody;
                        ctx.status = 202;
                    }
                }
            } else {
                responseBody.code = -1;
                responseBody.message = "user_id not found";
                responseBody.data = "user_id not found in request body";
                ctx.body = responseBody;
                ctx.status = 401;
            }
        } else {
            responseBody.code = -3;
            responseBody.message = "token error";
            responseBody.data = "token error, please login again";
            ctx.body = responseBody;
            ctx.status = 400;
        }
    } else {
        responseBody.code = -4;
        responseBody.message = "token not found";
        responseBody.data = "token not found, please login first";
        ctx.body = responseBody;
        ctx.status = 500;
    }

    await next();
})


module.exports = userInfoUpdateRoute;
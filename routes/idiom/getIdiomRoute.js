// 获取成语信息的路由

const Route = require("koa-router");
const { logger } = require("../../middlewares/logger");


const getIdiomRoute = new Route();


getIdiomRoute.get("/", async (ctx, next) => {
    const { mysqlClient: mysql } = ctx.resourceManager.DB;
    const responseBody = {
        code: 0,
        message: "success",
        data: null
    }
    try {
        const token = ctx.cookies.get("token") || ctx.req.headers["authorization"];
        if ((await mysql.tokenVarify(token)).status === "ok") {
            const { idiom } = ctx.request.query;
            logger.info(ctx.request.query.idiom);
            const needAll = ctx.request.query.needAll === "1";
            const idiomInfo = await mysql.getIdiom(idiom, needAll);
            responseBody.data = idiomInfo;
            ctx.status = 200;
        } else {
            responseBody.code = -1;
            responseBody.message = "you dou't have access to fetch idiom info";
            ctx.status = 401;
        }
    } catch (err) {
        responseBody.code = -2;
        responseBody.message = err;
        logger.error(err);
        ctx.status = 500;
    }

    ctx.body = responseBody;

    await next();
})


module.exports = getIdiomRoute;
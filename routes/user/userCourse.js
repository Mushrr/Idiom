const Route = require("koa-router");

const userCourseRoute = new Route();


userCourseRoute.post("/", async (ctx, next) => {

    const responseBody = {
        code: 0,
        message: "获取课程成功",
        data: null
    }
    const { mysqlClient: mysql, mongoClient: mongo } = ctx.resourceManager.DB;
    const token = ctx.cookies.get("token") || ctx.req.headers["authorization"];
    if ((await mysql.tokenVarify(token)).status === "ok") {
        const data = ctx.request.body;
        const allCourses = await mongo.getAllCourses(data.developer);
        if (allCourses) {
            responseBody.data = allCourses;
            ctx.status = 200;
            ctx.body = responseBody;
        } else {
            responseBody.code = -1;
            responseBody.message = "获取课程失败";
            responseBody.data = "请检查你填写的信息";
            ctx.status = 500;
            ctx.body = responseBody;
        }
    }
    await next();
})

module.exports = userCourseRoute;
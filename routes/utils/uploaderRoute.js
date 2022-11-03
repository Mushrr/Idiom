// 上传文件的接口，尝试一下!


const Route = require("koa-router");


const uploaderRoute = new Route();


uploaderRoute.post("/", async (ctx, next) => {
    const fileDir = ctx.request.body.dir;
    const rename = ctx.request.body.rename === "1" ? true : false;
    const raw = ctx.resourceManager.DB.raw;
    const responseBody = {
        code: 0,
        message: "success",
        data: [

        ],
    }
    try {

        if (ctx.request.files) {
            for (let file of Object.values(ctx.request.files)) {
                responseBody.data.push(await raw.fileUploader(file, fileDir, rename));
            }
        }
        ctx.body = responseBody;
        ctx.status = 200;
    } catch (err) {
        responseBody.code = -1;
        responseBody.message = "upload failed";
        responseBody.data = err;
        ctx.body = responseBody;
        ctx.status = 500;
    }
    await next();
});

module.exports = uploaderRoute;
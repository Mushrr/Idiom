// 头像上传接口

const Route = require("koa-router");
const fs = require("fs");
const path = require("path");
const { logger } = require("../../middlewares/logger");
const { renameFile } = require("../../utils/utils");


const avatorUpRoute = new Route();

avatorUpRoute.post("/", async (ctx, next) => {
    const { mysqlClient: mysql } = ctx.resourceManager.DB;
    const responseBody = {
        code: 0,
        message: "success",
        data: null,
    }
    // 解析当前请求中是否带有TOKEN，以及TOKEN是否合理
    const token = ctx.cookies.get("token") || ctx.req.headers["authorization"];
    if (token) {
        const varifyToken = await mysql.tokenVarify(token);
        if (varifyToken.status === "ok") {
            // TOKEN 合法
            // 上传头像
            const file = ctx.request.files.avator;
            if (file) {
                logger.info(`[文件上传] ${file.originalFilename} ${file.mimetype} ${file.size} ${file.filepath}`);
                const filename = renameFile(file);
                if (filename) {
                    const reader = fs.createReadStream(file.filepath);
                    const stream = fs.createWriteStream(path.join(__dirname, `../../assets/image/${filename}`));
                    reader.pipe(stream);
                    responseBody.data = `image/${filename}`;
                    ctx.body = responseBody;
                    ctx.status = 200;


                    // 更新数据库中的头像信息

                    mysql.getUserFromToken(ctx.cookies.get("token")).then(res => {
                        mysql.userInfoUpdate(res.user_id, { avator: responseBody.data }).then(res => {
                            logger.info(`[头像更新] ${res}`);
                        }).catch(err => {
                            logger.error(`[头像更新] ${err}`);
                        });
                    }).catch(err => {
                        logger.error(err);
                    })

                } else {
                    // 无法获取文件名，以及文件格式，上传失败
                    responseBody.code = -4;
                    responseBody.message = "upload failed";
                    responseBody.data = "file name or file type error";
                    ctx.body = responseBody;
                    ctx.status = 500;
                }
            } else {
                // 无法获取文件名，以及文件格式，上传失败
                responseBody.code = -5;
                responseBody.message = "upload failed";
                responseBody.data = "file is not exists!";
                ctx.body = responseBody;
                ctx.status = 500;
            }

        } else if (varifyToken.status === "expired") {
            responseBody.code = -3;
            responseBody.message = "token expired";
            responseBody.data = varifyToken.message;
            ctx.body = responseBody;
            ctx.status = 401;
            return;
        } else if (varifyToken.status === "unknown") {
            responseBody.code = -2;
            responseBody.message = "unknown token";
            responseBody.data = varifyToken.message;
            ctx.body = responseBody;
            ctx.status = 401;
            return;
        }
    } else {
        responseBody.code = -1;
        responseBody.message = "token is missing!!";
        responseBody.data = "please check whether you have login";
        ctx.body = responseBody;
        ctx.status = 401;
        return;
    }

    await next();
});



module.exports = avatorUpRoute;
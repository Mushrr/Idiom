// 用户登录

// token 验证
// token 过期
// token 不存在
// token 有效

// 用户不存在
// 密码错误
// 登录成功 200


const Route = require("koa-router");
const sha256 = require("sha256");


const userLoginRoute = new Route();

/**
 * 登录函数
 * @param {ctx} ctx 上下文
 */
async function login(ctx) {
    const { mysqlClient: mysql } = ctx.resourceManager.DB;
    const responseBody = {
        code: -1,
        message: "error",
        data: null
    }
    try {
        if (await mysql.isUserExist(ctx.request.body.username)) {
            // 验证密码是否通过
            let user_id = null;
            const loginCheck = new Promise((resolve, reject) => {
                mysql.query(`select * from userinfo where username = '${ctx.request.body.username}'`)
                    .then(result => {
                        if (result[0].password === sha256(ctx.request.body.password)) {
                            user_id = result[0].user_id;
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
    
            if (await loginCheck) {
                // token bind
                const token = await mysql.tokenBind(ctx.ip, user_id);
                ctx.cookies.set("token", token);
                responseBody.code = 0;
                responseBody.message = "login success";
                responseBody.data = {
                    token: token,
                    userinfo: await mysql.getUserFromToken(token)
                };
                
                console.log(token);
                mysql.update("userinfo", {
                    user_id: user_id,
                }, {
                    token_id: token
                })

                ctx.body = responseBody;
                ctx.status = 200;
                // 修改用户所绑定的token
                
            } else {
                responseBody.code = -1;
                responseBody.message = "password error";
                responseBody.data = "password error, please check your password";
                ctx.body = responseBody;
                ctx.status = 401;
            }
    
        } else {
            responseBody.code = 1;
            responseBody.message = "user not exist";
            responseBody.data = `${ctx.request.body.username} not exist, you can registry with it`;
            ctx.body = responseBody;
            ctx.status = 400; // 登录错误，用户不存在
        }
    } catch (e) {
        responseBody.code = -1;
        responseBody.message = "login failed";
        ctx.body = responseBody;
        ctx.status = 500;
        throw e;
    }
}


userLoginRoute.post("/", async (ctx, next) => {
    // 验证当前 用户是否以前登录过了
    // 如果登录过了直接返回允许
    const { mysqlClient: mysql } = ctx.resourceManager.DB;
    if (ctx.request.body.login === "1") {
        // 用户登录
        await login(ctx);
    } else {
        const token = ctx.cookies.get("token") || ctx.req.headers["authorization"];
        console.log(ctx.req.headers)
        if (token) {
            const varifyAns = await mysql.tokenVarify(token);
        
            if (varifyAns.status === "ok") {
                
                ctx.body = {
                    code: 0,
                    message: "you have login successfully",
                    data: {
                        userinfo: await mysql.getUserFromToken(token)
                    }
                }
                ctx.status = 200;
            } else if (varifyAns.status === "expired") {
                ctx.body = {
                    code: 2,
                    message: "token expired",
                    data: "token expired, please login again"
                }
                ctx.status = 406;
                ctx.cookies.set("token", "");
            } else if (varifyAns.status === "error") {
                ctx.body = {
                    code: -2,
                    message: "token error",
                    data: "token error, please login again"
                }
                ctx.status = 500;
                ctx.cookies.set("token", "");
            } else {
                ctx.body = {
                    code: -2,
                    message: "token error",
                    data: "token error, please login again"
                }
                ctx.status = 500;
                ctx.cookies.set("token", "");
            }
        } else {
            await login(ctx);
        }
    }


    await next(); // 等待下一个路由
});


module.exports = userLoginRoute;
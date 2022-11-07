// entry
const Koa = require("koa");
const { loggerMiddleware } = require("./middlewares/logger");
const { staticMiddleware } = require("./middlewares/static");
const { koaSwagger } = require("koa2-swagger-ui");
const { swaggerMiddleware } = require("./middlewares/swagger");
const { koaBody } = require("koa-body");
// config
const { port, projectName, idiomRMConfig } = require("./config");

// router
const { router } = require("./router");
const { networkInterfaces } = require("os");

// resourcemanager 挂载
const IdiomResourceManager = require("./modules/resourcemanager/core/core");

const app = new Koa();

async function cros(ctx, next) {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    ctx.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
    await next();
}

// log
app.use(cros);
app.use(loggerMiddleware);
app.use(staticMiddleware);
app.use(koaBody({
    multipart: true,
    parsedMethods: [
        "POST",
        "PUT",
        "DELETE"       
    ]
}));
// 获取resourceManagerCore的Middleware, 插件导入;
app.use(IdiomResourceManager.getResourceManagerCoreMiddleware(
    idiomRMConfig // idiom resource manager 的插件
));
app.use(router.routes()).use(router.allowedMethods());

// swagger
app.use(swaggerMiddleware.routes()).use(swaggerMiddleware.allowedMethods());
app.use(koaSwagger({
    routePrefix: "/swagger",
    swaggerOptions: {
        url: "/swagger.json"
    }
}))

app.listen(port, () => {
    console.log(`🧊 ${projectName}服务器启动 ~`);
    console.log("🌵 可以通过以下地址访问: ");
    const currentNetWork = networkInterfaces();
    for (let network of Object.values(currentNetWork)) {
        for (let ipinfo of network) {
            if (ipinfo.family === "IPv4") {
                console.log(`✨ http://${ipinfo.address}:${port}`);
            }
        }
    }
})




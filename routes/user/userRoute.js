const Route = require("koa-router");

const userRoute = new Route();

const userRegistryRoute = require("./userRegistry");

// 关于user 实体的方法

userRoute.use("/registry", userRegistryRoute.routes(), userRegistryRoute.allowedMethods());

module.exports = userRoute;
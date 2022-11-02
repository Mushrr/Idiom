const Route = require("koa-router");

const userRoute = new Route();

const userRegistryRoute = require("./userRegistry");
const userLoginRoute = require("./userLogin");

// 关于user 实体的方法

userRoute.use("/registry", userRegistryRoute.routes(), userRegistryRoute.allowedMethods());
userRoute.use("/login", userLoginRoute.routes(), userLoginRoute.allowedMethods());

module.exports = userRoute;
const Route = require("koa-router");

const userRoute = new Route();

const userRegistryRoute = require("./userRegistry");
const userLoginRoute = require("./userLogin");
const userInfoUpdateRoute = require("./userInfoUpdate");
const userCourseRoute = require("./userCourse");

// 关于user 实体的方法

userRoute.use("/registry", userRegistryRoute.routes(), userRegistryRoute.allowedMethods());
userRoute.use("/login", userLoginRoute.routes(), userLoginRoute.allowedMethods());
userRoute.use("/infoupdate", userInfoUpdateRoute.routes(), userInfoUpdateRoute.allowedMethods());
userRoute.use("/course", userCourseRoute.routes(), userCourseRoute.allowedMethods());

module.exports = userRoute;
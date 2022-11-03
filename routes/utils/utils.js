// 其他接口


const Route = require("koa-router");

const avatorUpRoute = require("./avatorupRoute");
const uploaderRoute = require("./uploaderRoute");

const utilsRoute = new Route();


utilsRoute.use("/avatorup", avatorUpRoute.routes(), avatorUpRoute.allowedMethods());
utilsRoute.use("/uploader", uploaderRoute.routes(), uploaderRoute.allowedMethods());

module.exports = utilsRoute;




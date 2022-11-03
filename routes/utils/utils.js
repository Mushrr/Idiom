// 其他接口


const Route = require("koa-router");

const avatorUpRoute = require("./avatorupRoute");

const utilsRoute = new Route();


utilsRoute.use("/avatorup", avatorUpRoute.routes(), avatorUpRoute.allowedMethods());

module.exports = utilsRoute;




// 成语路由 


const Route = require( "koa-router");

const IdiomRoute = new Route();
const getIdiomRoute = require( "./getIdiomRoute");
const usageRoute = require( "./usage");


IdiomRoute.use("/get", getIdiomRoute.routes(), getIdiomRoute.allowedMethods());
IdiomRoute.use("/usage", usageRoute.routes(), usageRoute.allowedMethods());


module.exports = IdiomRoute;
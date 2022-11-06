// 成语路由 


const Route = require( "koa-router");

const IdiomRoute = new Route();
const getIdiomRoute = require( "./getIdiomRoute");


IdiomRoute.use("/get", getIdiomRoute.routes(), getIdiomRoute.allowedMethods());


module.exports = IdiomRoute;
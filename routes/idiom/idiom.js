// 成语路由 


const Route = require( "koa-router");

const IdiomRoute = new Route();
const getIdiomRoute = require( "./getIdiomRoute");
const usageRoute = require( "./usage");
const storyRoute = require( "./story");


IdiomRoute.use("/get", getIdiomRoute.routes(), getIdiomRoute.allowedMethods());
IdiomRoute.use("/usage", usageRoute.routes(), usageRoute.allowedMethods());
IdiomRoute.use("/story", storyRoute.routes(), storyRoute.allowedMethods());


module.exports = IdiomRoute;
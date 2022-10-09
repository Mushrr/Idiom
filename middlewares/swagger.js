// swagger middleware
const Router = require("koa-router");
const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");
const {host, port, swaggerSpecPath} = require("../config");

const swaggerMiddleware = new Router();

const swaggerDefinition = {
    info: {
        title: "Mushr koa template",
        version: "0.0.1",
        description: "API"
    },
    host: host + ":" + port,
    basePath: "/"
}

const options = {
    swaggerDefinition,
    apis: [path.join(__dirname, "../routes/*.js")]
}

const swaggerSpec = swaggerJSDoc(options);

swaggerMiddleware.get(swaggerSpecPath, async function (ctx) {
    ctx.set("Content-Type", "application/json");
    ctx.body = swaggerSpec;
})

module.exports = {
    swaggerMiddleware
}

// swaggerRoute

const {swaggerMiddleware} = require('../middlewares/swagger');

const {koaSwagger} = require('koa2-swagger-ui');

const {swaggerPath, swaggerSpecPath} = require('../config');

const Router = require('koa-router');

const swaggerRoute = new Router();

swaggerRoute.use(swaggerMiddleware.routes(), swaggerMiddleware.allowedMethods());
swaggerRoute.use(koaSwagger({
    routePrefix: swaggerPath,
    swaggerOptions: {
        url: swaggerSpecPath
    }
}))

module.exports = {
    swaggerRoute
}

// router
const Router = require('koa-router');

const {indexRoute} = require('./routes/indexRoute');
const {swaggerRoute} = require('./routes/swaggerRoute');

const router = new Router();

router.use('/', indexRoute.routes(), indexRoute.allowedMethods());
router.use('/doc', swaggerRoute.routes(), swaggerRoute.allowedMethods());

module.exports = {
    router
}

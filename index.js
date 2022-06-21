// entry
const Koa = require('koa');
const {loggerMiddleware, logger} = require('./middlewares/logger');
const {staticMiddleware} = require('./middlewares/static');
// const {koaSwagger} = require('koa2-swagger-ui');
// const {swaggerMiddleware} = require('./middlewares/swagger');
// config
const {port} = require('./config');

// router
const {router} = require('./router');


const app = new Koa();

// log
app.use(loggerMiddleware);
app.use(staticMiddleware);
app.use(router.routes(), router.allowedMethods());

// app.use(swaggerMiddleware.routes(), swaggerMiddleware.allowedMethods());
// app.use(koaSwagger({
//     routePrefix: '/swagger',
//     swaggerOptions: {
//         url: '/swagger.json'
//     }
// }))

app.listen(port, () => {
    logger.info('Server start');
})




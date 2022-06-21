// logger

const Log4js = require('log4js');
const { logLevel } = require('../config');


const logger = Log4js.getLogger(); // logger
logger.level = logLevel;

async function loggerMiddleware(ctx, next) {
    // logger info
    let startTime = new Date();

    await next(); // waiting middlewares
    let endTime = new Date();

    let info = `[${ctx.method}] - [${ctx.url}] - [${ctx.status}] - [${endTime - startTime}ms]`;
    logger.info(info); // you can config the loglevel
}

module.exports = {
    logger,
    loggerMiddleware
}



// index route

const Route = require('koa-router');
const {sql, mongo} = require('../utils/db');
const indexRoute = new Route();

indexRoute.get('/', async (ctx, next) => {


    ctx.body = `
        ${JSON.stringify(await mongo.listDataset())}
    `;
    await next();
})

module.exports = { indexRoute };

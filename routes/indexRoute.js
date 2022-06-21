// index route

const Route = require('koa-router');

const indexRoute = new Route();

indexRoute.get('/', async (ctx, next) => {
    ctx.body = `
    <h6 align="center">✨Mushr koa template✨</h6>
    <link rel="stylesheet" href="/css/init.css"/>
    <img src='/image/John.png'/>
    <p>If you see a animate avator above,</p>
    <p>you have successfully installed mushr koa template.</p>
    `;
    await next();
})

module.exports = { indexRoute };

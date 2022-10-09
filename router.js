// router
const Router = require("koa-router");

const {indexRoute} = require("./routes/indexRoute");

const router = new Router();

router.use("/", indexRoute.routes(), indexRoute.allowedMethods());

module.exports = {
    router
}

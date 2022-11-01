// router
const Router = require("koa-router");

const {indexRoute} = require("./routes/indexRoute");
const userRoute = require("./routes/user/userRoute");

const router = new Router();

router.use("/", indexRoute.routes(), indexRoute.allowedMethods());
router.use("/user", userRoute.routes(), userRoute.allowedMethods());

module.exports = {
    router
}

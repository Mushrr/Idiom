// router
const Router = require("koa-router");

const {indexRoute} = require("./routes/indexRoute");
const userRoute = require("./routes/user/userRoute");
const utilsRoute = require("./routes/utils/utils");
const idiomRoute = require("./routes/idiom/idiom");
const router = new Router();

router.use("/", indexRoute.routes(), indexRoute.allowedMethods());
router.use("/user", userRoute.routes(), userRoute.allowedMethods());
router.use("/utils", utilsRoute.routes(), utilsRoute.allowedMethods());
router.use("/idiom", idiomRoute.routes(), idiomRoute.allowedMethods());


module.exports = {
    router
}

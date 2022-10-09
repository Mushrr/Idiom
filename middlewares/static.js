// static middleware

const static = require("koa-static");
const {assetsPath} = require("../config");

const staticMiddleware = static(assetsPath, {
    // opt
    /**
     * maxage 
     * hidden
     * index
     * defer: allow any downstream middlewares to response first
     * gzip
     * br
     * setHeaders: function to set headers
     * extensions: 
     */
})


module.exports = {
    staticMiddleware
}

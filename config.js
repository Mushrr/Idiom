const coreLogger = require("./modules/sourcemanager/core/plugins/core-logger")

// config
const projectName = "Idiom";

const path = require("path");

const host = "localhost";

const port = 3000;

const logLevel = "debug";

const assetsPath = path.join(__dirname, "./assets");

const swaggerPath = "/swagger";

const swaggerSpecPath = "/swagger.json";

// mysql config

const mysqlConfig = {
    host: "localhost",
    user: "idiom",
    password: "idiom",
    port: 3306,
    database: "idiom"
}

// mongodb config

const mongodbUrl = "mongodb://127.0.0.1:27017"

const redisConfig = {
    port: 6379,
    host: "127.0.0.1",
}

// idiom resource manager config 
const idiomRMConfig = {
    resourceManagerPlugin: [
        coreLogger,
    ]
}

module.exports = {
    projectName,
    logLevel,
    host,
    port,
    assetsPath,
    swaggerPath,
    swaggerSpecPath,
    mysqlConfig,
    mongodbUrl,
    redisConfig,
    idiomRMConfig
}

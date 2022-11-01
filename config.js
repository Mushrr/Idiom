const coreLogger = require("./modules/resourcemanager/core/plugins/core-logger")


// 生产环境与开发环境隔离

let redis = "localhost",
    mysql = "localhost",
    mongodb = "localhost";

if (process.env.NODE_ENV === "production") {
    redis = "redis";
    mysql = "mysql";
    mongodb = "mongodb";
}


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
    host: mysql,
    user: "idiom",
    password: "idiom",
    database: "idiom",
    port: 3306
}

// mongodb config

const mongodbUrl = `mongodb://${mongodb}:27017`

const redisConfig = {
    port: 6379,
    host: redis,
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

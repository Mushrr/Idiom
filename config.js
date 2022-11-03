const coreLogger = require("./modules/resourcemanager/core/plugins/core-logger")
const isUserExist = require("./modules/resourcemanager/db/mysql-plugins/isUserExist.js")

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
const addUser = require("./modules/resourcemanager/db/mysql-plugins/addUser");
const useTokenBind = require("./modules/resourcemanager/db/mysql-plugins/tokenBind");
const tokenVarify = require("./modules/resourcemanager/db/mysql-plugins/tokenVarify");
const getUserFromToken = require("./modules/resourcemanager/db/mysql-plugins/getUserFromToken");
const userInfoUpdate = require("./modules/resourcemanager/db/mysql-plugins/userInfoUpdate");

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
    ],
    mysqlPlugin: [
        isUserExist,
        addUser,
        useTokenBind,
        tokenVarify,
        getUserFromToken,
        userInfoUpdate
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

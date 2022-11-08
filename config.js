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
const fileUploader = require("./modules/resourcemanager/db/raw-plugins/file-uploader");
const idiomInsert = require("./modules/resourcemanager/db/mysql-plugins/idiomInsert");
const getIdiom = require("./modules/resourcemanager/db/mysql-plugins/getIdiom");
const getIdiomUsages = require("./modules/resourcemanager/db/mysql-plugins/getIdiomUsages");
const getStoryByStoryCode = require("./modules/resourcemanager/db/mongo-plugins/getStoryByStoryCode");
const increaseIdiom = require("./modules/resourcemanager/db/mysql-plugins/increaseIdiom");
const usageChange = require("./modules/resourcemanager/db/mysql-plugins/usage");
const idiomCodeVarify = require("./modules/resourcemanager/db/mysql-plugins/idiomCodeVarify");
const storyChange = require("./modules/resourcemanager/db/mongo-plugins/story");
const course = require("./modules/resourcemanager/db/mongo-plugins/course");
const getAllCourses = require("./modules/resourcemanager/db/mongo-plugins/getAllCourses");

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
        userInfoUpdate,
        idiomInsert,
        getIdiom,
        getIdiomUsages,
        increaseIdiom,
        usageChange,
        idiomCodeVarify
    ],

    mongoPlugin: [
        getStoryByStoryCode,
        storyChange,
        course,
        getAllCourses
    ],

    rawPlugin: [
        fileUploader
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



const MysqlClient = require("./mysql");
const MongoClient = require("./mongodb");
const RedisClient = require("./redis");
const RawFileManager = require("./raw");

class DB {
    constructor(mySqlPlugins = [], mongoPlugins = [], redisPlugins = [], rawPlugins = []) {
        this.mysqlClient = new MysqlClient(mySqlPlugins);
        this.mongoClient = new MongoClient(mongoPlugins);
        this.redisClient = new RedisClient(redisPlugins);
        this.raw = new RawFileManager(rawPlugins);
    }
}


module.exports = DB;
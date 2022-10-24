// 将所有数据库虚拟化，加载到core中
// 可以通过core直接调用

const MysqlClient = require("./mysql");
const MongoClient = require("./mongodb");
const RedisClient = require("./redis");

class DB {
    constructor(mySqlPlugins = [], mongoPlugins = [], redisPlugins = []) {
        this.mysqlClient = new MysqlClient(mySqlPlugins);
        this.mongoClient = new MongoClient(mongoPlugins);
        this.redisClient = new RedisClient(redisPlugins);
    }
}


module.exports = DB;
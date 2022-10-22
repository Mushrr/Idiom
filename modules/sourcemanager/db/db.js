// 将所有数据库虚拟化，加载到core中
// 可以通过core直接调用

const MysqlClient = require("./mysql");
const MongoClient = require("./mongodb");

class DB {
    constructor(mySqlPlugins = [], mongoPlugins = []) {
        this.mysqlClient = new MysqlClient(mySqlPlugins);
        this.mongoClient = new MongoClient(mongoPlugins);
    }
}


module.exports = DB;
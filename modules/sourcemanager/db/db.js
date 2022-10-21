// 将所有数据库虚拟化，加载到core中
// 可以通过core直接调用

const MysqlClient = require("./mysql");

class DB {
    constructor() {
        this.mysqlClient = new MysqlClient();
    }
}


module.exports = DB;
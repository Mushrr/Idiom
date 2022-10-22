// 将所有数据库虚拟化，加载到core中
// 可以通过core直接调用

const MysqlClient = require("./mysql");

class DB {
    /**
     * 
     * @param {Array<func> | object} plugins 
     */
    static _mysqlPluginLoad(instance, plugins) {
        for (const plugin in plugins) {
            instance.registryPlugin(plugin.name, plugin.action);
        }
    }
    constructor(mySqlPlugins = []) {
        this.mysqlClient = new MysqlClient();
        DB._mysqlPluginLoad(this.mysqlClient, mySqlPlugins);
    }
}


module.exports = DB;
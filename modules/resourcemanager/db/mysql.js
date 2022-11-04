// 虚拟化mysql
const mysql = require("mysql");
const { mysqlConfig } = require("../../../config");
const { getObjectKeys, getObjectValues, getObjectPair } = require("../../../utils/utils");
const { logger } = require("../../../middlewares/logger");
const { isFunction, isObject } = require("mushr");

class MysqlClient {

    static _mysqlPluginLoad(instance, plugins) {
        for (const plugin of plugins) {
            if (isFunction(plugin)) {
                const pluginEntity = plugin();
                instance.registryPlugin(pluginEntity.name, pluginEntity.execute);
            } else if (isObject(plugin)) {
                instance.registryPlugin(plugin.name, plugin.execute);
            }
            instance.pluginNums += 1;
        }
    }

    constructor(plugins = []) {
        this.config = mysqlConfig;
        this.connectionPool = mysql.createPool(mysqlConfig);
        this.pluginNums = 0;
        MysqlClient._mysqlPluginLoad(this, plugins);
        logger.info(`✨共装载了${this.pluginNums}个Mysql插件`);
    }

    /**
     *
     * @param sql sql语句
     * @returns {Promise<unknown>}
     */
    query(sql, callback) {
        return new Promise((resolve, reject) => {
            this.connectionPool.getConnection((err, connect) => {
                if (err) {
                    logger.error(err);
                    reject(err); // 直接拒绝
                } else {
                    connect.query(sql, (error, result, fields) => {
                        if (error) {
                            reject(error);
                        }
                        if (callback) {
                            callback(result, fields);
                        }
                        connect.release();
                        resolve(result); // 返回期约
                    });
                }
            })
        })
    }

    /**
     * 
     * @param {string} table 
     * @param {*} columns 
     * @param {*} values
     * @return {boolean} 
     */
    insert(table, values) {
        const insertSql = `insert into ${table} `;

        let allPromises = [];

        if (!(values instanceof Array)) {
            values = [values]
        }
        for (let value of values) {
            let keyAndValues = `${insertSql} (${getObjectKeys(value, { withTail: false, separater: "," })}) 
            values(${getObjectValues(value, { withTail: false, separater: ",", strictTransform: true })})`;
            console.log(keyAndValues);
            allPromises.push(this.query(keyAndValues));
        }

        return Promise.all(allPromises);
    }

    /**
     * 更新表中数据
     * @param {string} table,
     * @param {object} uniquekey,
     * @param {object} values
     */
    update(table, uniquekey, values) {
        const uniqueQuery = getObjectPair(uniquekey, { separater: " and " });
        const updateValues = getObjectPair(values, { separater: "," });
        const updateSql = `update ${table} 
            ${Object.keys(values).length !== 0 ? "set" : ""} 
            ${updateValues} 
            ${Object.keys(uniquekey).length !== 0 ? "where" : ""} 
            ${uniqueQuery}`;
        if (process.env.NODE_ENV === "development") {
            logger.log("[mysql.update]:" + updateSql);
        }
        return this.query(updateSql);
    }

    /**
     * 删除表中的数据
     * @param {string} table 
     * @param {object} uniquekey 
     * @returns values
     */
    del(table, uniquekey) {
        const uniqueQuery = getObjectPair(uniquekey, { separater: " and " });
        const deleteSQL = `delete from ${table} where ${uniqueQuery}`;
        return this.query(deleteSQL);
    }

    /**
     * 注册一个插件，可以直接通过db调用
     * @param {string} name 
     * @param {(..args: any[] => any) => } func 
     */
    registryPlugin(name, func, force = false) {
        if (!this[name] || force) {
            // 建议使用function() 否则无法使用this
            this[name] = (...args) => { return func(this, ...args) };
        } else {
            logger.warn(`当前 插件名${name} 下已经有一个函数了, 如果一定需要添加, 请添加force=true 以强制添加`);
        }
    }
}

// 测试


// db.insert("student", [{name: "Cookie", age: 12, config: {left: 1, right: 12, align: "center"}}]);


// console.log(getObjectPair({name: "Mushr", age: 123}, {separater: " "}))


module.exports = MysqlClient; // 导出类
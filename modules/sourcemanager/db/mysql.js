// 虚拟化mysql
const mysql = require("mysql");
const { mysqlConfig } = require("../../../config");
const { getObjectKeys, getObjectValues, getObjectPair } = require("../../../utils/utils");
const { logger } = require("../../../middlewares/logger");

class MysqlClient {
    constructor() {
        this.config = mysqlConfig;
        this.connectionPool = mysql.createPool(mysqlConfig);
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
        const updateSql = `update ${table} set ${updateValues} where ${uniqueQuery}`;
        return this.query(updateSql);
    }

    del(table, uniquekey) {
        const uniqueQuery = getObjectPair(uniquekey, { separater: " and " });
        const deleteSQL = `delete from ${table} where ${uniqueQuery}`;
        return this.query(deleteSQL);
    }
}

// 测试


// db.insert("student", [{name: "Cookie", age: 12, config: {left: 1, right: 12, align: "center"}}]);


// console.log(getObjectPair({name: "Mushr", age: 123}, {separater: " "}))


module.exports = MysqlClient; // 导出类
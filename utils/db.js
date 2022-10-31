// This file has been depratched!
/*
  _____          _   _       _     _    _            _______ _     _       ______ _ _      _ _ _ _ 
 |  __ \        | \ | |     | |   | |  | |          |__   __| |   (_)     |  ____(_) |    | | | | |
 | |  | | ___   |  \| | ___ | |_  | |  | |___  ___     | |  | |__  _ ___  | |__   _| | ___| | | | |
 | |  | |/ _ \  | . ` |/ _ \| __| | |  | / __|/ _ \    | |  | '_ \| / __| |  __| | | |/ _ \ | | | |
 | |__| | (_) | | |\  | (_) | |_  | |__| \__ \  __/    | |  | | | | \__ \ | |    | | |  __/_|_|_|_|
 |_____/ \___/  |_| \_|\___/ \__|  \____/|___/\___|    |_|  |_| |_|_|___/ |_|    |_|_|\___(_|_|_|_)
*/

const mysql = require("mysql");
const mongodb = require("mongodb");
const {mysqlConfig, mongodbUrl} = require("../config");
const {logger} = require("../middlewares/logger");

class mysqlClient {
    constructor() {
        this.config = mysqlConfig;
        this.connectionPool = mysql.createPool(mysqlConfig);
    }

    /**
     *
     * @param sql sql语句
     * @returns {Promise<unknown>}
     */
    query(sql,callback) {
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
}

class mongoClient {
    constructor() {
        this.mongodbUrl = mysqlConfig;
        this.mongodbClient = new mongodb.MongoClient(mongodbUrl);
    }
    // 列举数据库
    async listDataset() {
        await this.mongodbClient.connect();
        return await this.mongodbClient.db().admin().listDatabases(); // 列出当前的数据
    }
}

const sql = new mysqlClient();
const mongo = new mongoClient();

module.exports = {
    sql,
    mongo
}

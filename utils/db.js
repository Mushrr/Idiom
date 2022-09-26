const mysql = require('mysql');
const mongodb = require('mongodb');
const {mysqlConfig, mongodbUrl} = require('../config');
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
    query(sql) {
        return new Promise((resolve, reject) => {
            this.connectionPool.getConnection((err, connect) => {
                if (err) {
                    logger.error(err);
                    reject(err); // 直接拒绝
                } else {
                    resolve(connect.query({
                        sql: sql,
                    })); // 提交查询期约
                }
            })
        })
    }
}

class mongoClient {
    constructor() {
        this.mongodbUrl = mysqlConfig;
        this.mongodbClient = new mongodb.MongoClient(mongodbUrl);
    };
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
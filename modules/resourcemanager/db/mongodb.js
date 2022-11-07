// 虚拟化mongodb
const { logger } = require("../../../middlewares/logger");
const { MongoClient: Mongo } = require("mongodb");
const { mongodbUrl } = require("../../../config");
const { initOptionsIfNotExists } = require("../../../utils/utils");
const { isFunction, isObject } = require("mushr");
// mongo 插件实例
// function mongoPluginTest() {
//     return {
//         name: "add",
//         execute: async (mongoClient) => {
//             return mongoClient.insert("mongotest", {name: randomString(10), age: Math.floor(Math.random() * 10)});
//         }
//     }
// }

class MongoClient {

    static _mongoPluginLoad(instance, plugins) {
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

    async _findNestData(filter, collectionCurr) {
        try {
            const documents = [];
            const allDocumentCursor = collectionCurr.find(filter);
            if (await allDocumentCursor.count() !== 0) {
                await allDocumentCursor.forEach(doc => {
                    documents.push(doc);
                })
            }
            return documents;
        } catch (e) {
            logger.error("在执行mongodb find的时候出现错误!", e);
            throw e;
        }
        
    }

    constructor(plugins = []) {
        try {
            this.client = new Mongo(mongodbUrl); // 初始化连接
            this.db = this.client.db("idiom"); // 数据库
            this.pluginNums = 0;
            MongoClient._mongoPluginLoad(this, plugins); // 初始化
            logger.info(`✨共装载了${this.pluginNums}个Mongo个插件`);
        } catch (e) {
            logger.error(e);
            throw e;
        }
    }

    /**
     * 查询mongo数据库
     * @param {string} collection mongo的表
     * @param {object} filter 筛选函数
     * @param {object} options 选项
     */
    find(collection, filter, options = { findMany: true, iterator: true }) {
        try {
            options = initOptionsIfNotExists(options, { findMany: true, iterator: true }); // 初始化参数
            const collectionCurr = this.db.collection(collection);
            if (options.findMany) {
                if (options.iterator) {
                    return collectionCurr.find(filter);
                } else {
                    return this._findNestData(filter, collectionCurr);
                }
            } else {
                return collectionCurr.findOne(filter);
            }
        } catch (e) {
            logger.error("Mongo 在执行查询的时候出现错误!", e); // 输出错误
            throw e;
        }
    }

    /**
     * 
     * @param {string} collection 文档名
     * @param {object} filter 筛选函数
     * @param {object} update 更新函数
     * @param {objec} options 其他选项
     */
    update(collection, filter, update, options = { updateMany: true }) {
        try {
            options = initOptionsIfNotExists(options, { updateMany: true });
            const collectionCurr = this.db.collection(collection);
            if (options.updateAll) {
                return collectionCurr.updateMany(filter, update);
            } else {
                return collectionCurr.updateOne(filter, update);
            }
        } catch (e) {
            logger.error("Mongo 在执行更新的时候出现错误!", e); // 输出错误
            throw e;
        }
    }

    /**
     * 插入一个数据， 默认插入一个对象
     * @param {string} collection 文档名
     * @param {object | Array} data 数据 
     * @param {object} options 其他选项
     * @returns Promise()
     */
    insert(collection, data, options = { insertMany: false }) {
        try {
            options = initOptionsIfNotExists(options, { insertMany: false });
            const collectionCurr = this.db.collection(collection);
            if (options.insertMany) {
                if (data instanceof Array) {
                    return collectionCurr.insertMany(data);
                } else {
                    logger.error(`数据插入到mongo失败，data${data}格式不对,并非一个数组`);
                    throw Error("数据插入错误!!!");
                }
            } else {
                return collectionCurr.insertOne(data); // 插入数据
            }
        } catch (e) {
            logger.error(e);
            throw e;
        }
    }

    /**
     * 从文档中删除一个。。。
     * @param {string} collection 文档名
     * @param {object} filter 筛选函数
     * @param {object} options 选项
     */
    del(collection, filter, options = { deleteMany: false }) {
        try {
            options = initOptionsIfNotExists(options, { deleteMany: false });
            const collectionCurr = this.db.collection(collection);
            if (options.deleteMany) {
                return collectionCurr.deleteMany(filter);
            } else {
                return collectionCurr.deleteOne(filter);
            }
        } catch (e) {
            logger.error(e);
            throw e;
        }
    }

    /**
     * 定义一个插件
     * @param {string} name 插件名
     * @param {function} func 函数
     * @param {{
     *  force: boolean
     * }} 是否强制修改?
     */
    registryPlugin(name, func, options = { force: false }) {
        if (!this[name] || options.force) {
            this[name] = (...args) => { return func(this, ...args) };
        } else {
            logger.warn(`您定义的mongodb插件有误,名为${name}的插件有重复！, 如果需要重新定义请加上force: true`);
            throw "定义插件出现重复！！";
        }
    }
}


module.exports = MongoClient;

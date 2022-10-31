// 虚拟化redis
const Redis = require("ioredis");
const { iterable, isFunction, isString } = require("mushr");
const { redisConfig } = require("../../../config");
const { logger } = require("../../../middlewares/logger");

class RedisClient {
    static _redisPluginLoad(instance, plugins) {
        const pluginIterator = iterable(plugins);
        if (pluginIterator) {
            for (const plugin of plugins) {
                if (isString(plugin.name) && isFunction(plugin.execute)) {
                    instance.registryRedisPlugin(plugin.name, plugin.execute);
                    this.plugin.pluginNums += 1;
                }
            }
        } else {
            logger.error("发现 redis的plugins 不可迭代!!!")
        }
    }
    
    constructor(plugins = []) {
        try {
            this.db = new Redis(redisConfig);
            this.pluginNums = 0;
            RedisClient._redisPluginLoad(this, plugins);
            logger.info(`👻共装载了${this.pluginNums}个Redis个插件`);
        } catch (e) {
            logger.error("❌ Redis client 构建失败！");
            throw e;
        }
    }
    /**
     * 注册一个redis插件
     * @param {string} name 插件的名称
     * @param {function} func 函数
     * @param {boolean} force 是否强制更新
     */
    registryPlugin(name, func, force = false) {
        if (!this[name] || force) {
            this[name] = (...args) => { return func(this, ...args); };
        } else {
            logger.warn(`redis client 已经有名为 ${name} 的插件了！如果想强制添加请使 force = true`);
        }
    }
}

module.exports = RedisClient;
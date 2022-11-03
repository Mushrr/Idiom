// file system

const { logger } = require("../../../middlewares/logger");
const { isFunction, isObject } = require("mushr");


class RawFileManager {

    static _rawPluginLoad(instance, plugins) {
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
        this.plugins = plugins;
        this.pluginNums = 0;
        RawFileManager._rawPluginLoad(this, plugins);
        logger.info(`✨共装载了${this.pluginNums}个Raw插件`);
    }

    registryPlugin(name, func, force = false) {
        if (!this[name] || force) {
            // 建议使用function() 否则无法使用this
            this[name] = (...args) => { return func(this, ...args) };
        } else {
            logger.warn(`当前 插件名${name} 下已经有一个函数了, 如果一定需要添加, 请添加force=true 以强制添加`);
        }
    }
}


module.exports = RawFileManager;
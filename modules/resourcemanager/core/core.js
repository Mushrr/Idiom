// 生成一个资源管理核心


// 初始化
// 数据库虚拟化实例挂载
// 插件挂载
// 返回资管原理核心
// 挂载到整个koa上
const { logger } = require("../../../middlewares/logger");
const { isFunction, isObject, initOptionsIfNotExists } = require("../../../utils/utils");
const DB = require("../db/db");


class IdiomResourceManager {
    static core = null;
    static getInstance() {
        if (!IdiomResourceManager.core) {
            IdiomResourceManager.core = new IdiomResourceManager(); // 初始化单例
        }

        return IdiomResourceManager.core;
    }

    static _pluginInitialize(plugins) {
        // 未初始化的时候初始化
        IdiomResourceManager.core.plugins = []; // 当前core的plugins是一个数组
        // 初始化所有plugins
        for (let plugin of plugins) {
            if (isFunction(plugin)) {
                const pluginInstance = plugin(IdiomResourceManager.core); // 返回的插件实例, 并且注入core
                // 如此，每次插入的时候
                if (isObject(pluginInstance)) {
                    IdiomResourceManager.core.plugins.push(pluginInstance);
                    // 加载当前插件，并且如果有onload函数，就执行
                    if (pluginInstance.onload) {
                        pluginInstance.onload();
                    }
                }
            }
        }
    }

    static _dbInitialize() {
        // 未初始化的时候初始化
        // 初始化当前db
        IdiomResourceManager.core.DB = new DB();
    }

    // plugins 插件们
    static getResourceManagerCoreMiddleware(plugins) {
        if (process.env.NODE_ENV === "development") {
            console.log("resource manager 挂载上了");
        }

        return async (ctx, next) => {
            ctx.resourceManager = IdiomResourceManager.getInstance(plugins);
            await next(); // 挂载
        }
    }

    constructor(config = { resourceManagerPlugin: [], mysqlPlugin: [], mongoPlugin: [], redisPlugin: [] }) {
        // 如果某些参数未定义，则附上初始值
        initOptionsIfNotExists(config, { 
            resourceManagerPlugin: [], 
            mysqlPlugin: [], 
            mongoPlugin: [], 
            redisPlugin: [] 
        });
        if (!IdiomResourceManager.core) {
            IdiomResourceManager.core = this; // 绑定
            // 开始初始化
            logger.info("开始插件初始化");
            IdiomResourceManager._dbInitialize(
                config.mysqlPlugin, 
                config.mongoPlugin, 
                config.redisPlugin
            ); // 初始化数据库
            logger.info("数据库初始化完毕");
            logger.info("开始插件初始化");
            IdiomResourceManager._pluginInitialize(config.resourceManagerPlugin);
            logger.info("插件初始化完毕");
        } else {
            // throw "当前core对象已经存在，请调用IdiomResourceManager.core 获取或者使用 IdiomResourceManager.getInstance()";
        }
    }



    /**
     * 
     * @param {{
     *   beforeExecute: function | undefined,
     *   execute: function,
     *   onreturn: function  | undefined,
     *   onfailed: function  | undefined
     * } | (..args: any[]) => any} hookInstruction 
     */
    execInstruction(hookInstruction) {
        try {
            if (isFunction(hookInstruction)) {
                // 函数切换到对象
                hookInstruction = {
                    execute: hookInstruction
                }
            }

            for (let plugin of this.plugins) {
                if (plugin.beforeExecute) {
                    // 可以对hookInsruction 做一些修改
                    plugin.beforeExecute(hookInstruction);
                }
            }

            // 如果有beforeExecute
            if (isFunction(hookInstruction.beforeExecute)) {
                hookInstruction.beforeExecute();
            } else {
                if (hookInstruction.beforeExecute) {
                    throw "hookInstruction 中的 beforeExecute 必须是一个函数!!"
                }
            }

            let outPut; // 定义返回值
            if (isFunction(hookInstruction.execute)) {
                outPut = hookInstruction.execute(this); // 注入
                // 插件监听到返回
                for (let plugin of this.plugins) {
                    if (plugin.onreturn) {
                        plugin.onreturn(outPut, hookInstruction);
                    }
                }

                if (isFunction(hookInstruction.onreturn)) {
                    hookInstruction.onreturn(outPut); // 把输出传入
                } else {
                    if (hookInstruction.onreturn) {
                        throw "hookInstruction 中的 onreturn 必须是一个函数"
                    }
                }

            } else {
                if (hookInstruction.execute) {
                    throw "hookInstruction 中的 execute 必须是一个函数"
                }
            }

            return outPut; // 返回执行的返回值
        } catch (e) {
            for (let plugin of this.plugins) {
                if (plugin.onerror) {
                    plugin.onerror(e);
                }
            }

            if (isFunction(hookInstruction.onerror)) {
                hookInstruction.onerror(e);
            }
        }
    }
}

// // Example
// function useLogger(core) {
//     return {
//         name: "logger",
//         core: core,

//         onload() {
//             console.log("插件logger打印了", this.core.plugins[0].name); //
//         },
//         onreturn(data) {
//             logger.info(data);
//         }
//     }
// }

// const showError = {
//     beforeExecute() {
//         console.log("在我执行之前");
//     },
//     execute: () => {
//         throw "我是个错误";
//     },
//     onreturn(data) {
//         console.log(data); // 这是我的数据
//     },
//     onerror(errr) {
//         logger.error(errr);
//     }
// }

// const showDb = {
//     beforeExecute() {
//         console.log("在我执行之前");
//     },
//     execute: ({db: {name}}) => {
//         // 解包拿到对应的数据
//         // 嵌套解包
//         return name;
//     },
//     onreturn(data) {
//         console.log(`instruction 发现 ${data.toString()}`); // 这是我的数据
//     },
//     onerror(errr) {
//         logger.error(errr);
//     }
// }

// const core = new IdiomResourceManager([useLogger]);
// const newCore = IdiomResourceManager.getInstance();
// newCore.execInstruction(showError);
// core.execInstruction(showDb);


// 数据库资源使用

// function useDBAnsLogger(core) {
//     return {
//         name: "dblogger",
//         core: core,

//         onreturn(data) {
//             if (data instanceof Promise) {
//                 data.then(ans => {
//                     writeFileSync("cur.log", Buffer.from(JSON.stringify(rawToJSON(ans))));
//                 })
//             }
//         }
//     }
// }

// const core = new IdiomResourceManager([useDBAnsLogger])
// core.execInstruction({
//     execute: () => {
//         return core.DB.mysqlClient.query("show tables;");
//     }
// })




module.exports = IdiomResourceManager; // 导出IdiomResourceManager类
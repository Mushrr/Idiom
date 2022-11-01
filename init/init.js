const fs = require("fs");
const path = require("path");
const { tree, } = require("../utils/utils");
const { logger } = require("../middlewares/logger");
const IdiomResourceManager = require("../modules/sourcemanager/core/core");
const { mysqlClient, mongoClient, redisClient } = IdiomResourceManager.getInstance().DB;

/**
 * 
 * @param {{
 *      type: 'sql',
 *      path: '路径',
 *      filename: '文件名' 
 * }} sql 
 */
function handleSQL(sql) {
    let ans = fs.readFileSync(path.join(__dirname, sql.path), {
        encoding: "utf-8"
    }).toString();
    
    let sqls = ans.split(";").map(el => el.trim());
    for (let sqlData of sqls) {
        if (sqlData !== "") {
            return mysqlClient.query(sqlData).catch(err => {
                logger.error(err);
            })
        }
    }
    // 执行处理工作
}

/**
 * 
 * @param {{
 *      type: 'mongo',
 *      path: '路径',
 *      filename: '文件名' 
 * }} mongoVal 
 */
function handleMongo(mongoVal) {
    mongoClient.insert(mongoVal); // 处理
}

function handleRedis() {
    // redisClient 处理
}

function handle(configTree) {
    for (let value of Object.values(configTree)) {
        if (value.type === "dir") {
            handle(value.children);
        } else {
            logger.info(`🧊 loading ${value.filename}`)
            if (value.type === "sql") {
                allPromise.push(handleSQL(value));
            } else if (value.type === "mongo") {
                // handleMongo(value);
            } else if (value.type === "redis") {
                handleRedis(value);
            }
            logger.info(`✨ finish loading ${value.filename}`)
        }
    }
}

const allPromise = [];

tree({
    dirpath: "../init",
    skip: ["md"]
}).then(ans => {
    handle(ans);
    Promise.all(allPromise).then(() => {
        logger.info("✨ finish loading all init files");
        process.exit();
    })
})


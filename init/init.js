const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');
const path = require('path');
const { tree, ls, getSuffixName } = require('../utils/utils');
const { logger } = require('../middlewares/logger');
const { sql: sqlClient } = require('../utils/db')

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
        encoding: 'utf-8'
    }).toString();
    
    let sqls = ans.split(';').map(el => el.trim());
    
    for (let sqlData of sqls) {
        console.log(sqlData);
        if (sqlData !== '') {
            sqlClient.query(sqlData).then(ans => {
            }); // 执行
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
    exec(`mongosh --file ${path.join(__dirname, mongoVal.path)}`, (err, out) => {
        if (err) {
            throw err;
        } else {
            console.log(out);
        }
    })
}

function handleRedis() {

}

function handle(configTree) {
    for (let [key, value] of Object.entries(configTree)) {
        if (value.type === 'dir') {
            handle(value.children);
        } else {
            logger.info(`🧊 loading ${value.filename}`)
            if (value.type === 'sql') {
                handleSQL(value);
            } else if (value.type === 'mongo') {
                handleMongo(value);
            } else if (value.type === 'redis') {
                handleRedis(value);
            }
            logger.info(`✨ finish loading ${value.filename}`)
        }
    }
}

tree({
    dirpath: "../init",
    skip: ['md']
}).then(ans => {
    handle(ans);
})



const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');
const path = require('path');
const { tree, ls, getSuffixName } = require('../utils/utils');
const { logger } = require('../middlewares/logger');



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
    // console.log(ans.split(';').map(el => el.trim()));
    // 执行处理工作
}

/**
 * 
 * @param {{
 *      type: 'sql',
 *      path: '路径',
 *      filename: '文件名' 
 * }} mongoVal 
 */
function handleMongo(mongoVal) {
    exec(`mongosh --file ${path.join(__dirname, mongoVal.path)}`, (err, out) => {
        if (err) {
            throw err;
        } else {
            // console.log(out);
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



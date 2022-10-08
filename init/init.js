const fs = require('fs');
const path = require('path');
const { tree, ls, getSuffixName } = require('../utils/utils');



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
    console.log(ans.split(';'));
}

function handleMongo() {

}

function handleRedis() {

}

function handle(configTree) {
    for (let [key, value] of Object.entries(configTree)) {
        if (value.type === 'dir') {
            handle(value.children);
        } else {
            if (value.type === 'sql') {
                handleSQL(value);
            } else if (value.type === 'mongo') {
                handleMongo(value);
            } else if (value.type === 'redis') {
                handleRedis(value);
            }
        }
    }
}

tree({
    dirpath: "../init",
    skip: ['md']
}).then(ans => {
    handle(ans);
})



const { tree, ls, getSuffixName } = require('../utils/utils');




function handleSQL(sql) {
    console.log(sql);
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



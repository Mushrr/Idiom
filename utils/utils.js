// 常用函数
const fs = require("fs/promises");
const path = require("path");
const { logger } = require("../middlewares/logger");

/**
 * 
 * @param {string} filename 文件名
 * @returns 当前文件的后缀
 */
function getSuffixName(filename) {
    if (filename.indexOf(".") !== -1) {
        let filenameSperated = filename.split(".");
        return filenameSperated[filenameSperated.length - 1]; // 返回后缀名
    } else {
        return "unknown";
    }
}

/**
 * 
 * @param {string} dirpath 路径
 * @param {Array<string>} skip 数组，内部包含需要跳过的类型
 * @returns 返回一个期约
 */
async function ls({ dirpath, skip = [], withType = false }) {
    return new Promise((resolve, reject) => {
        fs.readdir(
            path.resolve(__dirname, dirpath),
            {
                withFileTypes: withType
            },
        ).then((value) => {
            let currentPathFiles = [];
            for (let file of value) {
                if (skip.indexOf(getSuffixName(file.name ? file.name : file)) === -1) {
                    currentPathFiles.push(file);
                }
            }
            resolve(currentPathFiles);

        }).catch(err => {
            reject(err);
        })
    })
}

/** 
 * 遍历一颗树
 * @param {treeObject: {
 *  dirpath: string,
 *  skip: Array<string>
 * }} 
 * @returns {{
 *  filename[]: {
 *      type: fileType,
 *      path: string,
 *      filename: string
 *  }
 * }}
 */
async function tree({ dirpath, skip = [] }) {
    // 返回一颗文件树
    let dirTree = {};
    return new Promise((resolve, reject) => {
        ls({
            dirpath: dirpath,
            skip: skip,
            withType: true
        })
            .then(async (files) => {
                for (let file of files) {
                    if (skip.indexOf(getSuffixName(file.name)) === -1) {
                        // console.log(file, file.isDirectory());
                        if (file.isDirectory()) {
                            dirTree[file.name] = {
                                children: await tree(
                                    {
                                        dirpath: path.join(dirpath, file.name),
                                        skip
                                    }
                                ),
                                type: "dir",
                            }
                        } else {
                            dirTree[file.name] = {
                                type: getSuffixName(file.name),
                                filename: file.name,
                                path: path.join(dirpath, file.name)
                            };
                        }
                    }
                }
                resolve(dirTree);
            }).catch(err => {
                logger.warn(`utils.js - ${dirpath}`, "错误");
                reject(err);
            })
    })
}

function isFunction(param) {
    return param instanceof Function;
}

function isObject(param) {
    return param instanceof Object;
}
// console.log(tree({
//     dirpath: '../init',
//     skip: [],
// }).then(ans => {console.log(JSON.parse(JSON.stringify(ans)))}));

function isNumber(data) {
    return !isNaN(Number(data));
}


/**
 * @param {string | boolean | object | array} data
 */
function dataTransform(data) {
    let ans = {
        data: "",
        type: ""
    };
    const changeAns = (data, type) => {
        ans.data = data;
        ans.type = type;
    }

    if (data instanceof Array) {
        changeAns(JSON.stringify(data), "array");
    } else if (data instanceof Object) {
        changeAns(JSON.stringify(data), "object");
    } else if (isNumber(data)) {
        changeAns(Number(data), "number");
    } else if (data instanceof Boolean) {
        changeAns(data.toString(), "boolean");
    } else {
        changeAns(data.toString(), "string");
    }

    return ans;
}

function initOptionsIfNotExists(obj, initParamters) {
    for (let [key, val] of Object.entries(initParamters)) {
        if (obj[key] === undefined) {
            obj[key] = val;
        }
    }
    return obj;
}

function randomString(length) {
    const head = Math.floor(length / 8);
    const rest = length % 8;
    let basic = "";
    for (let i = 0; i < head; i ++) {
        basic += Math.random().toString(32).slice(2, 10);
    }
    basic += Math.random().toString(32).slice(2,2+rest);
    return basic;
}


/**
 * 获取对象的keys
 * @param {object} obj 
 * @param {{
 *  withTail: boolean,
 *  separater: string
 * }} options
 * @return {string}
 */
function getObjectKeys(obj, options = { withTail: false, separater: "," }) {
    let keys = "";
    initOptionsIfNotExists(options, { withTail: false, separater: "," });
    for (let key of Object.keys(obj)) {
        keys += `${key}${options.separater}`;
    }

    if (!options.withTail) {
        keys = keys.slice(0, -options.separater.length);
    }
    return keys;
}

/**
 * 获取对象的keys
 * @param {object} obj;
 * @param {{
 *  withTail: boolean,
 *  separater: string,
 *  strictTransform: boolean, // 是否强制转换类型
 * }} options
 * @return {string}
 */
function getObjectValues(obj, options = { withTail: false, separater: ",", strictTransform: true }) {
    let values = "";
    initOptionsIfNotExists(options, { withTail: false, separater: ",", strictTransform: true });
    for (let value of Object.values(obj)) {
        if (options.strictTransform) {
            let data = dataTransform(value);
            if (data.type === "number") {
                values += `${data.data}${options.separater}`
            } else {
                values += `'${data.data}'${options.separater}`
            }
        } else {
            values += `'${value}'${options.separater}`;
        }
    }
    if (!options.withTail) {
        values = values.slice(0, -options.separater.length);
    }
    return values;
}


/**
 * 解析字符串对
 * @param {object} obj 
 * @param {{
 *  withTail: boolean,
 *  connectFlag: string 
 *  separater: string
 * }} options 
 */

function getObjectPair(obj, options = {withTail: false, connectFlag: "=", separater: ",", strictTransform: true}) {
    let ans = "";
    initOptionsIfNotExists(options, { withTail: false, connectFlag: "=", separater: ",", strictTransform: true });
    for (let [key, value] of Object.entries(obj)) {
        ans += key + options.connectFlag;
        if (options.strictTransform) {
            let data = dataTransform(value);
            if (data.type === "number") {
                ans += `${data.data}${options.separater}`;
            } else {
                ans += `'${data.data}'${options.separater}`;
            }
        } else {
            ans += `'${value}'${options.separater}`;
        }
    }

    if (!options.withTail) {
        ans = ans.slice(0, -options.separater.length);
    }

    return ans;
}


/**
 * 
 * @param {any} rawData 
 */
function rawToJSON(rawData) {
    return JSON.parse(JSON.stringify(rawData));
}

/**
 * 重新命名文件名
 * @param {file} file koa-body file 对象
 * @returns 文件名
 */
function renameFile(file) {
    try {
        const filename = randomString(32) + "." + file.mimetype.split("/")[1];
        return filename;
    } catch (err) {
        return false;
    }
}

module.exports = {
    getSuffixName,
    ls,
    tree,
    isFunction,
    isObject,
    getObjectKeys,
    getObjectValues,
    getObjectPair,
    rawToJSON,
    dataTransform,
    randomString,
    initOptionsIfNotExists,
    renameFile
}
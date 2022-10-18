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

// console.log(tree({
//     dirpath: '../init',
//     skip: [],
// }).then(ans => {console.log(JSON.parse(JSON.stringify(ans)))}));
module.exports = {
    getSuffixName,
    ls,
    tree
}
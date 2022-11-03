// 文件上传的统一接口

// 指定文件file, 以及对应的存储路径, 是否置换名字, 等等
const fs = require("fs");
const { renameFile } = require("../../../../utils/utils");
const path = require("path");

function fileUploader() {
    return {
        name: "fileUploader",
        execute: (raw, file, filePath, replaceName = false) => {
            return new Promise((resolve, reject) => {

                let filename = file.originalFilename;
                if (replaceName) {
                    filename = renameFile(file);
                }
                let filePrefix = path.resolve(__dirname, "../../../../assets");

                for (const dir of filePath.split("/")) {
                    if (!fs.existsSync(filePrefix + "/" + dir)) {
                        fs.mkdirSync(filePrefix + "/" + dir);
                    }
                    filePrefix += "/" + dir;
                }

                let writeStream = fs.createWriteStream(path.resolve(`${filePrefix}/${filename}`));
                let readStream = fs.createReadStream(file.filepath);
                readStream.pipe(writeStream);
                readStream.on("end", () => {
                    resolve({
                        message: "文件上传成功",
                        url: `${filePath}/${filename}`
                    });
                })
                readStream.on("error", err => {
                    reject({
                        message: "文件上传失败",
                        err
                    });
                })

            })
        }
    }
}

module.exports = fileUploader;
// 导入所有的成语数据
// IDIOM 主表
// IDIOM_CODE STORY_CODE USEAGE_CODE RECOMMAND_CODE
// V1数据中各个成语只存在一个IDIOM_CODE, 各个成语也只存在一个基础的释义，一个基础故事
// 先给各个成语生成一个唯一的编号，随后根据编号生产一个用法编号，故事编号，推荐编号
// 用法表中填入文字，发音，以及引用的次数
// 以及添加一个故事表，创建故事的ID，在mongodb中插入此故事！！注意格式
// 用法表可以暂时停一停，等待用户来填充

const { idiomRMConfig } = require("../../config")
const { mysqlClient: mysql } = require("../../modules/resourcemanager/core/core").getInstance(idiomRMConfig).DB;
const { logger } = require("../../middlewares/logger");



function loadV1(idiomData) {
    // 检查结果，只是缺失了故事这倒是没事！
    

    let v1Data = idiomData.split("\n");
    for (let line of v1Data) {
        const [code, idiom, pinyin, usage, story] = line.split(",");
        
        const data = {

        }

        if (idiom !== "") {
            data.idiom = idiom.slice(1, -1);
        }
        if (pinyin !== "") {
            data.pronounce = pinyin.slice(1, -1);
        }

        if (usage !== "") {
            data.usages = [
                {
                    idiom_text: usage.slice(1, -1),
                }
            ];
        }

        if (story !== "") {
            data.stories = [
                {
                    story_type: "history",
                    story_text: story.slice(1, -1),
                }
            ]
        }
        mysql.idiomInsert(data, true).then((res) => {
            logger.info(res);
        }).catch(err => {
            logger.error(err)
        });
    }
}

module.exports = {
    loadV1
};
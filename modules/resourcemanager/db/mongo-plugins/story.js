// 故事实体
// update
// deleta
// add

const { randomStr } = require("mushr");
const { logger } = require("../../../../middlewares/logger");

function storyChange() {

    return {
        name: "storyChange",
        /**
         * 
         * @param {db} db MongoDB数据库实例
         * @param {{
         *  operator: "add" | "update" | "delete", // 操作类型
         *  storyCode: string, // 成语的编码
         *  data: string | object, // 成语用法数据
         * }}  
         */
        execute: async ({ db }, { operator, storyCode, data }) => {
            const mysql = require("../../core/core").getInstance().DB.mysqlClient;
            const storyCollection = db.collection("story");
            const responseBody = {
                code: 0,
                message: "success",
                data: null
            }
            switch (operator) {
            case "add":
                if ((await mysql.idiomCodeVarify("story", storyCode)) && data.story_type) {
                    // 验证storyCode是否合法
                    data.story_id = randomStr(32); // 随机一个string
                    data.story_code = storyCode;
                    responseBody.data = await storyCollection.insertOne(data);
                    mysql.insert("idiom_story", {
                        story_id: data.story_id,
                        story_code: storyCode,
                        story_type: data.story_type
                    }).catch(err => {
                        logger.error("idiom_story 插入失败", err);
                    })
                    

                } else {
                    throw new Error(`插入信息错误${storyCode}, ${data}, 需要 text 表示用法`);
                }
                break;
            case "update":
                if ((await mysql.idiomCodeVarify("story", storyCode)) && (await mysql.idiomCodeVarify("story_id", data.story_id))) {
                    // 验证storyCode是否合法
                    responseBody.data = await storyCollection.updateOne({
                        story_id: data.story_id
                    }, {
                        $set: data
                    });
                    mysql.update("idiom_story", {
                        story_code: storyCode,
                        story_id: data.story_id
                    }, {
                        story_type: data.story_type
                    }).catch(err => {
                        logger.error("idiom_story 更新失败", err);
                    })
                } else {
                    throw new Error(`更新信息错误${storyCode}, ${data}, 需要 text 表示用法`);
                }
                break;
            case "delete":
                if ((await mysql.idiomCodeVarify("story", storyCode))  && (await mysql.idiomCodeVarify("story_id", data.story_id))) {
                    // 验证storyCode是否合法
                    responseBody.data = await storyCollection.deleteOne({
                        story_id: data.story_id
                    });
                }

                mysql.del("idiom_story", {
                    story_code: storyCode,
                    story_id: data.story_id
                }).catch(err => {
                    logger.error("idiom_story 删除失败", err);
                })
                break;
            default:
                throw new Error("操作类型错误");
            }
            return responseBody;
        }
    }
}


module.exports = storyChange;
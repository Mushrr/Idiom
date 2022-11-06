// 从Mysql中获取Idiom

const { isString } = require("mushr")


function getIdiom() {

    return {
        name: "getIdiom",
        execute: async (db, idiom, needFullInfo = false) => {
            // 获取成语信息
            // 如果needFullInfo为true，那么返回完整的成语信息
            // 如果needFullInfo为false，那么只返回成语的基础信息
            const mongo = require("../../core/core").getInstance().DB.mongoClient;

            if (isString(idiom)) {
                const query = `select * from v_idiom_info where idiom_text = '${idiom}'`;
                const result = await db.query(query);
                console.log(query);
                if (result.length > 0) {
                    const idiomInfo = result[0];
                    db.increaseIdiom(idiomInfo.idiom_code); // 访问次数自增1
                    if (needFullInfo) {
                        // 1. 获取所有用法
                        const stories = await mongo.getStoryByStoryCode(idiomInfo.story_code);
                        const usages = await db.getIdiomUsages(idiomInfo.usage_code);
                        idiomInfo.stories = stories;
                        idiomInfo.usages = usages;
                        return idiomInfo;
                    }
                    return idiomInfo;
                } else {
                    return null;
                }
            } else {
                throw "idiom is not a string";
            }
        }
    }
}

module.exports = getIdiom
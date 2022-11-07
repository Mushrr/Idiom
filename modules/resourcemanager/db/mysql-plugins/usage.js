// 成语用法

const { randomStr } = require("mushr");

function usageChange() {

    const operators = ["add", "update", "delete"];

    return {
        name: "usageChange",
        /**
         * 
         * @param {db} db Mysql数据库实例
         * @param {{
         *  operator: "add" | "update" | "delete", // 操作类型
         *  usageCode: string, // 成语的编码
         *  data: string, // 成语用法数据
         * }}  
         */
        execute: async (db, { operator, usageCode, data }) => {
            const responseBody = {
                code: 0,
                message: "success",
                data: null
            }

            if (!operators.includes(operator)) {
                throw new Error("操作类型错误");
            } else {
                if (operator === "add") {
                    if (await db.idiomCodeVarify("usage", usageCode)) {
                        // 此usageCode合法，可以添加
                        data.usage_id = randomStr(32);

                        await db.insert("usage_detail", {
                            usage_code: usageCode,
                            usage_id: data.usage_id,
                            idiom_text: data.text,
                            last_change: new Date().toLocaleString()
                        })

                        responseBody.data = data;

                    } else {
                        throw new Error(`插入信息错误${usageCode}, ${data}, 需要 text 表示用法`);
                    }
                } else if (operator === "update") {
                    if (await db.idiomCodeVarify("usage_id", data.usage_id) && await db.idiomCodeVarify("usage", usageCode)) {
                        // 此usageCode合法，可以更新
                        await db.update("usage_detail", {
                            usage_code: usageCode,
                            usage_id: data.usage_id
                        }, {
                            idiom_text: data.text,
                            last_change: new Date().toLocaleString()
                        })
                        responseBody.data = data;
                    } else {
                        throw new Error(`更新信息错误${usageCode}, ${data}, 需要 text 表示用法`);
                    }
                } else if (operator === "delete") {
                    if (await db.idiomCodeVarify("usage_id", data.usage_id) && await db.idiomCodeVarify("usage", usageCode)) {
                        // 此usageCode合法，可以删除
                        await db.del("usage_detail", {
                            usage_code: usageCode,
                            usage_id: data.usage_id
                        })
                        responseBody.data = data;
                    } else {
                        throw new Error(`删除信息错误${usageCode}, ${data}, 需要 text 表示用法`);
                    }
                } else {
                    throw new Error(`操作类型错误, 只允许${operators.join(",")}`);
                }
            }
            return responseBody;
        }
    }
}

module.exports = usageChange;
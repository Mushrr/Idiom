// 插入一个成语

const { randomStr } = require("mushr");

function idiomInsert() {

    return {
        name: "idiomInsert",
        /**
         * 
         * @param {*} db 数据库实例，方便使用插件
         * @param {{
         *    idiom_code: string, // 可选，如果存在则动态添加，如果不存在则表明需要动态的去查找一下
         *    idiom: string,    // 成语
         *    pronouce: string, // 发音
         *    storys: [
         *      {
         *        story_type: string, 故事类型
         *        story_id: string, 故事的id
         *        participant: [  // 参与人
         *        
         *        ],
         *        story: [
         *        ], 故事的内容，可以是一个数组，用于形成多页成语
         *        img: [
         *        ], 用于前端展示的图片,
         *        audio: [], 用于前端展示的音频，音效，类似于galgame的形式
         *        video: [
         *        
         *        ], 视频信息，用于前端展示，视频以url的形式嵌套，可以是bilibili，当然也可以是服务器上的视频
         *        activate_condition: [], // 触发条件，用于约束前端展示
         *       }
         *    ],
         *    usages: [
         *        {
         *            usage_id,
         *            text: string, 解释说明
         *            last_change: Date
         *        }
         *    ]
         *    
         * }} idiom 成语信息，内部可以认为包含成语的全部信息
         * @param {*} checkExists 是否强制检查成语是否存在，如果强制检查，如果发现是重复的则会进行释义补充
         */
        execute: async (db, idiom, checkExists) => {
            // 获取mongo
            const mongo = require("../../core/core").getInstance().DB.mongoClient;
            // 如果checkExists为true，则需要检查成语是否存在，如果存在则将返回的值作为idiom的code，否则创建一个新的
            let idiom_code = idiom.idiom_code;
            const allPromise = [];
            let needToCreate = false;
            if (checkExists) {
                const queryAns = await db.query(`select * from idiom_detail where idiom_text = '${idiom.idiom}'`);
                if (queryAns.length === 0) {
                    needToCreate = true;
                } else if (queryAns.length === 1) {
                    idiom_code = queryAns[0].idiom_code;
                    // console.log("idiom_code", idiom_code);
                } else {
                    throw new Error("成语重复");
                }
            }
            // 初始化其余参数，如果发现有idiom_code 被使用了，那么就直接获取已有的
            // 如果没有那么就重新创建
            let story_code, usage_code, recommend_code;
            if (!idiom_code) {
                idiom_code = randomStr(32); // 随机生成一个idiom_code
                needToCreate = true;
            } else {
                // 获取story_code, usage_code, recommend_code
                const ans = await db.query(`
                    select story_code, usage_code, recommend_code 
                    from idiom 
                    where idiom_code = '${idiom_code}'; 
                `);
                if (ans.length === 0) {
                    needToCreate = true;
                } else if (ans.length === 1) {
                    story_code = ans[0].story_code;
                    usage_code = ans[0].usage_code;
                    recommend_code = ans[0].recommend_code;
                } else {
                    throw new Error("成语重复");
                }
            }




            if (needToCreate) {
                // idiom -> idiom_detail -> idiom_story -> mongodb -> idiom_usage
                [story_code, usage_code, recommend_code] = [randomStr(32), randomStr(32), randomStr(32)];

                // 向idiom中插入数据
                allPromise.push(db.insert("idiom", {
                    idiom_code,
                    story_code,
                    usage_code,
                    recommend_code,
                }));

                // 向idiom_detail中插入数据

                if (idiom.idiom) {
                    const idiom_detail_data = {
                        idiom_code,
                        idiom_text: idiom.idiom,
                        times: 0 // 查阅次数初始化为0
                    }
                    if (idiom.pronounce) {
                        idiom_detail_data.pronounce = idiom.pronounce;
                    }

                    allPromise.push(db.insert("idiom_detail", idiom_detail_data));
                }


            }


            // 向idiom_story中插入数据
            if (Array.isArray(idiom.stories) && idiom.stories.length !== 0) {
                for (const story of idiom.stories) {
                    // 遍历每一个添加的story
                    const story_data = {
                        story_code,
                        story_pattern: story.story_type,
                        story_id: randomStr(32),
                    }
                    story.story_id = story_data.story_id; // mongo 与 mysql中的story_id 绑定
                    allPromise.push(db.insert("idiom_story", story_data));

                    // 向mongodb 中添加数据

                    allPromise.push(mongo.insert(story.story_type, story));
                }
            } else {
                console.log(`${idiom.idiom}没有故事`);
            }

            // 向idiom_usage中插入数据

            if (Array.isArray(idiom.usages) && idiom.usages.length !== 0) {
                for (const usage of idiom.usages) {
                    const usage_data = {
                        usage_code,
                        usage_id: randomStr(32),
                        idiom_text: usage.idiom_text,
                        last_change: usage.last_change ? usage.last_change : new Date().toLocaleString(),
                    }
                    allPromise.push(db.insert("usage_detail", usage_data));
                }
            } else {
                console.log(`${idiom.idiom}没有用法`);
            }

            return Promise.all(allPromise).then(() => {
                return {
                    message: `🐼成功插入${idiom.idiom}成语`
                };
            }).catch(err => {
                return {
                    message: `😶‍🌫️插入成语${idiom.idiom}失败`,
                    err
                }
            })
        }
    }
}


module.exports = idiomInsert;
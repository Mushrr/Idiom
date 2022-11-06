// 查询成语



function searchIdiom() {
    
    
    return {
        name: "searchIdiom",
        execute: async (db, { idiom, token, needFullInfo = false }) => {
            // 查询成语, 可以只返回基础的idiom信息，
            // 当needFullInfo为true的时候，表示把所有信息全部查出来

            const { redisClient: redis } = require("../../code/core").getInstances().DB;
            // 1. 判断用户是否有权限查询
            // 2. 从Redis缓存中检索 命中返回
            // 3. 从Mysql中查询 命中返回 并缓存

            if ((await db.tokenVarify(token)).status === "ok") {
                // 查询redis

                const idiomInfo = await redis.getIdiom(idiom);
                if (idiomInfo) {
                    return idiomInfo;
                } else {
                    // 查询mysql
                    const idiomInfo = await db.getIdiom(idiom, needFullInfo);
                    if (idiomInfo) {
                        // 缓存到redis
                        redis.setIdiom(idiomInfo);
                        return idiomInfo;
                    } else {
                        return null;
                    }
                }

            } else {
                return {
                    status: "error",
                    message: "token is invalid"
                }
            }
        }
    }
}


module.exports = searchIdiom
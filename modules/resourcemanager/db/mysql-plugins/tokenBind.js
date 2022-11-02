const { randomStr } = require("mushr");

function useTokenBind() {

    return {
        "name": "tokenBind",
        "execute": (db, ip, userid) => {
            return new Promise((resolve, reject) => {
                db.isUserExist(userid).then((ans) => {
                    if (!ans) {
                        reject("user not exist");
                    } else {
                        const token = randomStr(64);
                        const expiredTime = `${new Date().getTime() + 1000 * 60 * 60 * 24 * 7}`.slice(0, -3);
                        db.query(`
                            REPLACE INTO idiom_token(
                                token_id,
                                user_id,
                                expired,
                                ip,
                                is_expired
                            ) values(
                                '${token}',
                                '${userid}',
                                from_unixtime(${expiredTime}),
                                '${ip}',
                                0
                            )
                        `).then(() => {
                            resolve(token); 
                            // token 有效期为 7 天
                            // 成功之后返回 token
                        }).catch(err => {
                            reject(err);
                        })
                    }
                }).catch(err => {
                    reject(err);
                })
            })
        }
    }
}

module.exports = useTokenBind;
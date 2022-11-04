// 从Token中获取用户信息
// TODO
// 需要丰富用户展示信息

function getUserFromToken() {

    return {
        name: "getUserFromToken",
        execute: (db, token_id) => {
            return new Promise((resolve, reject) => {
                db.query(`select * from v_user_info where token_id = '${token_id}'`)
                    .then(result => {
                        if (result.length === 0) {
                            reject("token not exist");
                        } else {
                            resolve(result[0]);
                        }
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
        }
    }
}


module.exports = getUserFromToken;
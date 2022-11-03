// 用户信息更新插件


function userInfoUpdate() {


    return {
        name: "userInfoUpdate",
        execute: (db, user_id, user_info) => {
            return new Promise((resolve, reject) => {
                db.update("user_info_detail", {user_id}, user_info).then(() => {
                    resolve(Object.keys(user_info) + "信息已经修改");
                }).catch(err => {
                    reject(err);
                })
            })
        }
    }
}


module.exports = userInfoUpdate;
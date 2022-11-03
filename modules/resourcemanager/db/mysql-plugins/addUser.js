// 添加用户插件

const { randomStr } = require("mushr");
const sha256 = require("sha256");

function addUser() {

    return {
        name: "addUser",
        execute: (db, user) => {
            return new Promise((resolve, reject) => {
                const user_id = randomStr(64);
                db.query(`insert into userinfo (
                        user_id, 
                        username, 
                        password
                    ) 
                    values (
                        '${user_id}', 
                        '${user.username}', 
                        '${sha256(user.password)}'
                    )`)
                    .then(() => {
                        resolve({
                            user_id,
                            username: user.username
                        });
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
        }
    }
}

module.exports = addUser;
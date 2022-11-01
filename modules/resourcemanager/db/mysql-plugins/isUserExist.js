// Mysql 插件，用于判断用户是否存在


/**
 * 
 * @param {string} username 用户名
 */
function useUserExist() {

    return {
        name: "isUserExist",
        execute: (db, username) => {
            return new Promise((resolve, reject) => {
                db.query(`select * from userinfo where username = '${username}'`)
                    .then(result => {
                        if (result.length > 0) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
        }
    }
}


module.exports = useUserExist;
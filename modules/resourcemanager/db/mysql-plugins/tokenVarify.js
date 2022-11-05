// Token 验证


function tokenVarify() {

    return {
        name: "tokenVarify",
        execute: (db, token) => {
            const responseBody = {
                "status": "ok",
                "message": "token is valid",
            }
            return new Promise((resolve, reject) => {
                db.query(`select * from idiom_token where token_id = '${token}'`)
                    .then(result => {
                        if (result.length === 0) {
                            responseBody.status = "unknown",
                            responseBody.message = "token not exist";
                            resolve(responseBody);
                        } else {
                            if (new Date(result[0].expired).getTime() < new Date().getTime()) {
                                responseBody.status = "expired",
                                responseBody.message = "token expired";
                                resolve(responseBody);
                            } else {
                                resolve(responseBody);
                            }
                        }
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
        }
    }
}


module.exports = tokenVarify;
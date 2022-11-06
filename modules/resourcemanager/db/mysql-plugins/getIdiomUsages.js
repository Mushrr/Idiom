// 获取成语的所有用法


function getIdiomUsages() {


    return {
        name: "getIdiomUsages",
        execute: async (db, useageCode) => {
            const querySql = `select * from usage_detail where usage_code = '${useageCode}'`;
            const result = await db.query(querySql);
            return result;
        }
    }
}

module.exports = getIdiomUsages
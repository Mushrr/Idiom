
// 增加成语的访问次数一次


function increaseIdiom() {


    return {
        name: "increaseIdiom",
        execute: async (db, idiom_code) => {
            const querySql = `update idiom_detail set times = times + 1 where idiom_code = '${idiom_code}'`;
            return db.query(querySql);
        }

        
    }
}

module.exports = increaseIdiom
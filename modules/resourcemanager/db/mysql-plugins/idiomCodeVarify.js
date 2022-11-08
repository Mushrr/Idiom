// 验证 IDIOM CODE是否合法


function idiomCodeVarify() {



    return {
        name: "idiomCodeVarify",
        /**
         * 
         * @param {db} db 数据库
         * @param {"idiom" | "usage" | "story" | "usage_id" | "story_id"} codeType 
         * @param {string} code 
         * @returns 
         */
        execute: async (db, codeType, code) => {
            let queryAns;
            switch (codeType) {
            case "idiom":
                queryAns = await db.query(`select * from idiom where idiom_code = '${code}'`);
                if (queryAns.length === 0) {
                    return false;
                } else if (queryAns.length === 1) {
                    return true;
                } else {
                    throw new Error("成语重复");
                }
            case "usage":
                queryAns = await db.query(`select * from idiom where usage_code = '${code}'`);
                if (queryAns.length === 0) {
                    return false;
                } else if (queryAns.length === 1) {
                    return true;
                } else {
                    throw new Error("用法重复");
                }
            case "story":
                queryAns = await db.query(`select * from idiom where story_code = '${code}'`);
                if (queryAns.length === 0) {
                    return false;
                }
                else if (queryAns.length === 1) {
                    return true;
                }
                else {
                    throw new Error("故事重复");
                }
            case "usage_id":
                queryAns = await db.query(`select * from usage_detail where usage_id = '${code}'`);
                if (queryAns.length === 0) {

                    return false;
                }
                else if (queryAns.length === 1) {
                    return true;
                }
                else {
                    throw new Error("用法重复");
                }
            case "story_id":
                queryAns = await db.query(`select * from idiom_story where story_id = '${code}'`);
                if (queryAns.length === 0) {
                    return false;
                }
                else if (queryAns.length === 1) {
                    return true;
                }
                else {
                    throw new Error("故事重复");
                }
            case "user_id":
                queryAns = await db.query(`select * from userinfo where user_id = '${code}'`);
                if (queryAns.length === 0) {
                    return false;
                }
                else if (queryAns.length === 1) {
                    return true;
                }
                else {
                    throw new Error("用户重复");
                }
            case "course_id":
                queryAns = await db.query(`select * from course where course_id = '${code}'`);
                if (queryAns.length === 0) {
                    return false;
                }
                else if (queryAns.length === 1) {    
                    return true;
                }
                else {
                    throw new Error("课程重复");
                }
            default:
                throw new Error("未知的code类型");
            }
        }
    }
}

module.exports = idiomCodeVarify;
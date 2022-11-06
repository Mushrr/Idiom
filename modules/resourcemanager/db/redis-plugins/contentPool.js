// 定义一个数据缓存池，用于将用户最近搜索到的数据缓存起来

function getIdiom() {
    return {
        name: "getIdiom",
        execute: async (db, {idiom, }) => {
            
        }
    }
}

function getCourse() {
    return {
        name: "getCourse",
        execute: async (client) => {
            const collection = client.db.collection("course");
            const course = await collection.findOne();
            return course;
        }
    }
}

module.exports = {
    getIdiom,
    getCourse
}
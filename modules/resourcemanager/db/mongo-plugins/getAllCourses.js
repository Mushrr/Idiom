// 从某个开发者中获得所有的课程，方便自己管理

function getAllCourses() {

    return {
        name: "getAllCourses",
        execute: async ({ db }, developer) => {
            const collection = db.collection("course");
            const allCourses = await collection.find({ developer }).toArray();
            return allCourses;
        }
    }
}

module.exports = getAllCourses;
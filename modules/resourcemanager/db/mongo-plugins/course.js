// 课程实体
/**
 * 
 * course table
 * course_id: 课程的唯一编码
 * developer: 课程的开发者id
 * course_name: 课程的名称
 * couse_out_img: 课程的封面图片
 * course_times: 课程的时长
 * course_score: 课程的评分
 */

const { randomStr } = require("mushr");



function course() {

    return {
        name: "course",
        /**
         * 
         * @param {{db}} db MongoDB数据库实例
         * @param {{
         *  operator: "add" | "update" | "delete", // 操作类型
         *  courseCode: string, // 成语的编码
         *  data: string | object, // 成语用法数据
         * }}  
         */
        execute: async ({ db }, { operator, developer, data }) => {
            const mysql = require("../../core/core").getInstance().DB.mysqlClient;
            const responseBody = {
                code: 0,
                message: "success",
                data: null
            }
            let queryAnswer;
            switch(operator) {
            case "add":
                if (await mysql.idiomCodeVarify("user_id", developer)) {
                    data.course_id = randomStr(64);
                    queryAnswer = await db.collection("course").insertOne(data);

                    mysql.insert("course", {
                        course_id: data.course_id,
                        developer: developer,
                        course_name: data.course_name || "课程",
                        course_out_img: data.course_out_img || "/image/defaultCourse.jpg",
                        course_times: 0,
                        course_score: 0
                    }).catch(err => {
                        console.log("course 插入失败", err);
                    })

                    responseBody.data = queryAnswer;
                } else {
                    throw new Error("插入信息错误, 需要 developer 表示开发者, 或者当前developer是非法用户");
                }
                break;
            case "update":
                if (await mysql.idiomCodeVarify("user_id", developer)) {
                    const courseInfo = await mysql.query(`select * from course where course_id = '${data.course_id}'`);
                    if (courseInfo.length === 1) {
                        if (courseInfo[0].developer === developer) {
                            queryAnswer = await db.collection("course").updateOne({
                                course_id: data.course_id,
                                developer: developer 
                            },{
                                $set: data
                            });
                            const updateData = {};

                            if (data.course_name) {
                                updateData.course_name = data.course_name;
                            }

                            if (data.course_out_img) {
                                updateData.course_out_img = data.course_out_img;
                            }

                            mysql.update("course", {
                                course_id: data.course_id,
                                developer: developer
                            }, updateData).catch(err => {
                                console.log("course 更新失败", err);
                            })

                            responseBody.data = queryAnswer;
                        } else {
                            throw new Error("当前用户不是该课程的开发者, 无法删除");
                        }
                    } else {
                        throw new Error("当前课程不存在");
                    }
                    
                    responseBody.data = queryAnswer;
                } else {
                    throw new Error("更新信息错误, 需要 developer 表示开发者, 或者当前developer是非法用户");
                }
                break;
            case "delete":
                if (await mysql.idiomCodeVarify("user_id", developer)) {
                    const courseInfo = await mysql.query(`select * from course where course_id = '${data.course_id}'`);
                    if (courseInfo.length === 1) {
                        if (courseInfo[0].developer === developer) {
                            queryAnswer = await db.collection("course").deleteOne({
                                course_id: data.course_id,
                                developer: developer
                            });
                            responseBody.data = queryAnswer;

                            mysql.del("course", {
                                course_id: data.course_id,
                                developer: developer
                            }).catch(err => {
                                console.log("course 删除失败", err);
                            })
                        } else {
                            throw new Error("当前用户不是该课程的开发者, 无法删除");
                        }
                    } else {
                        throw new Error("当前课程不存在");
                    }
                    
                    responseBody.data = queryAnswer;
                }
                break;
            default:
                throw new Error("操作类型错误");
            }
            return queryAnswer;
        }
    }
}

module.exports = course;
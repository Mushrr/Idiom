// 通过故事Code查询所有故事


function getStoryByStoryCode() {


    return {
        "name": "getStoryByStoryCode",
        "execute": async ({db}, storyCode) => {
            const collection = db.collection("story");
            const allStories = await collection.find({ "story_code": storyCode }).toArray();

            const storyAns = {};

            console.log(allStories);
            for (let story of allStories) {
                if (!storyAns[story.story_type]) {
                    storyAns[story.story_type] = [];
                }
                storyAns[story.story_type].push(story);
            }
            return storyAns;
        }
    }
}

module.exports = getStoryByStoryCode
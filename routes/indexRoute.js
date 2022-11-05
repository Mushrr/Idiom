// index route

const Route = require("koa-router");
const { logger } = require("../middlewares/logger");
const indexRoute = new Route();

indexRoute.get("/", async (ctx, next) => {
    ctx.resourceManager.DB.mysqlClient.idiomInsert({
        idiom: "爱莫能助",
        pronounce: "ài mò néng zhù",
        storys: [
            {
                story_type: "history",
                participant: [
                    "广大劳苦人民"
                ],
                story: [
                    "《诗经·大雅·烝民》：“维仲山甫举之，爱莫助之。”"
                ],
                img: [
                    "http://127.0.0.1:3000/image/default.jpg"
                ],
                audio: [
                    "http://127.0.0.1:3000/audio/default.mp3"
                ],
                video: [
                    "http://127.0.0.1:3000/video/default.mp4"
                ],
                activate_condition: {
                    "onload": "xxxx"
                }
            },
            {
                story_type: "useage_story",
                participant: [
                    "广大劳苦人民"
                ],
                story: [
                    "《诗经·大雅·烝民》：“维仲山甫举之，爱莫助之。”"
                ],
                img: [
                    "http://127.0.0.1:3000/image/default.jpg"
                ],
                audio: [
                    "http://127.0.0.1:3000/audio/default.mp3"
                ],
                video: [
                    "http://127.0.0.1:3000/video/default.mp4"
                ],
                activate_condition: {
                    "onload": "xxxx"
                }
            }
        ],
        usages: [
            {
                idiom_text: "爱莫能助，形容爱情无法得到对方的帮助。"
            }
        ]
    }, true).then((res) => {
        logger.info(res);
    }).catch(err => {
        logger.error(err)
    });
    ctx.body = `
        <div align="center" style="word-break: break-word">
        <h1>欢迎使用idiom接口</h1>
        <p>已加载的Mysql插件</p>
        <p>${JSON.stringify(Object.keys(ctx.resourceManager.DB.mysqlClient))}</p>
        <p>已加载的MongoDB插件</p>
        <p>${JSON.stringify(Object.keys(ctx.resourceManager.DB.mongoClient))}</p>
        <p>已加载的Redis插件</p>
        <p>${JSON.stringify(Object.keys(ctx.resourceManager.DB.redisClient))}</p>
        <p>已加载的Raw插件</p>
        <p>${JSON.stringify(Object.keys(ctx.resourceManager.DB.raw))}</p>
        <p>请访问 <a href="https://www.apifox.cn/web/project/1679286">Apifox文档</a> 查看接口文档</p>
        <p>优美胜于丑陋</p>
        <p>明了胜于晦涩</p>
        <p>简洁胜于复杂</p>
        <p>复杂胜于凌乱</p>
        <p>扁平胜于嵌套</p>
        <p>间隔胜于紧凑</p>
        <p>可读性很重要</p>
        <p>即便假借特例的实用性之名，也不可违背这些规则</p>
        <p>不要包容所有错误，除非你确定需要这样做</p>
        <p>当存在多种可能，不要尝试去猜测</p>
        <p>而是尽量找一种，最好是唯一一种明显的解决方案</p>
        <p>虽然这并不容易，因为你不是 Python 之父</p>
        <p>做也许好过不做，但不假思索就动手还不如不做</p>
        <p>如果你无法向人描述你的方案，那肯定不是一个好方案；反之亦然</p>
        <p>命名空间是一种绝妙的理念，我们应当多加利用</p>
        </div>
    `;
    await next();
})

module.exports = { indexRoute };

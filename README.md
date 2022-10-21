### Idiom Server


```javascript
yarn install


// 数据库初始化
yarn  run init

yarn start
```

##### 组件图一览
![](https://pic1.imgdb.cn/item/634eacd916f2c2beb136310a.jpg)

##### 如何在接口中访问数据库，等等其他资源
```javascript
route.get("/", async (ctx, next) => {
    // 编写一个插件
    // 这里的core-logger 是一个控制元件，用以控制日志打印的
    const instruction = {
        "core-logger": {
            skip: true 
        },
        execute(core) {
            return core.DB.mysqlClient.query(`show tables;`);
        }
    }
    // 这里通过ctx直接获取resouceManager元素，执行instruction
    let ans = await ctx.resourceManager.execInstruction(instruction);
    ctx.body = ans;
    await next();
})


```
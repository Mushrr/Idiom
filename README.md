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

##### 如何在编写数据库插件
```javascript
// 有些时候，写数据库操作变的非常繁琐，我们这里采用插件的方式把各种操作隔离开
// 需要的时候直接调用即可
// 可以在一定程度上提升开发的体验

// 数据库的插件通过如下方式创建

const IdiomResourceManager = requrie('../core.js');

const core = IdiomResourceManager.getInstance();

core.DB.mysqlClient.registryPlugin('getStudentInfo', (db, ...args) {
    // db表示当前数据库实例，请注意，第一个一定要写数据库，否则会出现问题
    // 其余的为当前函数的参数，在下次调用的时候是不需要写db的只需要指出后面的参数即可
    let sql = `select * from student where uniqueid = '${uniqueid}'`;
    return this.query
})

```
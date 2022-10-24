### 资管管理器
![](https://pic1.imgdb.cn/item/634ea54916f2c2beb126725a.jpg)

##### Core
* Auth：负责验证权限
* Upload: 上传更新服务
* Fetch：获取服务
* Plugin: 为别的模块提供其他资源获取的能力（比如编写一个插件可以获取最近一个月的数据汇总，为gamesocket分配一块内存区域等）

##### DB
* 虚拟化底层的数据库，为上层提供更加方便的调用
* Redis: 缓存
* Mongodb: 文档数据（存放课程，游戏，成语信息等内容，也用来做数据仓库备份） 
* Mysql: 关系型数据

* Mysql 数据库插件编写
```javascript
// 在初始化的时候加载插件
function mysqlPlugin() {

    return {
        name: "add",
        execute: async (db) => {
            const randName = randomString(10);
            return db.query(`insert into student values('${randName}', 19)`);
        }
    }
}


// 如果你实在创建之后使用
// (db) => {} 
mysqlClient.registry('name', (db, ...args) => {
    //  注意第一个一定是db获取当前数据库实例
})

// 调用  
mysqlClient.name(paramters); // 即可调用

```

* Mongodb 数据库插件编写
```javascript
// 如果是在初始化阶段创建的话需要使用对象语法
function mongoPlugin() {
    // your clusive package
    return {
        name: "add",
        execute: async (mongoClient, ...args) => {
            return mongoClient.insert("mongotest", {name: randomString(10), age: Math.floor(Math.random() * 10)});
        }
    }
}
// 使用
core.DB.mongoClient.add(...args); // 直接在mongoClient 对象上调用


// 如果是在创建之后
core.DB.mongoClient.registryPlugin("add", async (db, ...args) => {
    // 插件相关内容;
})

// 使用
core.DB.mongoClient.add(...args); //直接使用

```

* redis 插件编写
```javascript
// 在创建的时候写插件，插件的格式与上面mysql，mongo格式一致
// 注意 redisClient.redis 为真实的redis对象，可以在这上面执行redis操作


// 编写使用redis的插件
const instruction = {
    "core-logger": {
        skip: false
    },
    
    execute: async (core) => {
        return core.DB.redisClient.db.get("idiom");
    }
}

// 手动注册一个插件
const { redisClient: redis } = ctx.resourceManager.DB;

redis.registryPlugin("add", async (redisC, key, value) => {
    return redisC.db.set(key, value);
})
redis.registryPlugin("get", async (redisC, key) => {
    return redisC.db.get(key);
})

// 通过redis.name()直接调用，其返回值都会顺便返回的。
ctx.body = `${await redis.get("tea")}`; // OK了
```

##### 分析

> 核心core是一个单例对象，如果没有创建，那么会挂载上一个各种数据库的虚拟化的对象，以方便core直接对数据库进行操作
> core暴露的功能为增删改查，

![](https://pic1.imgdb.cn/item/634ff6c616f2c2beb1be1710.jpg)
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
// 建议使用function () {} 函数，可以直接在函数内部使用this获得访问权限，否则需要手动加入
mysqlClient.registry('name', function () {
    //  
})

// 调用  
mysqlClient.name(paramters); // 即可调用

```

##### 分析

> 核心core是一个单例对象，如果没有创建，那么会挂载上一个各种数据库的虚拟化的对象，以方便core直接对数据库进行操作
> core暴露的功能为增删改查，

![](https://pic1.imgdb.cn/item/634ff6c616f2c2beb1be1710.jpg)
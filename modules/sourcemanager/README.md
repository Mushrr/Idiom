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
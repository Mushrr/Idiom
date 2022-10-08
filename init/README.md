###### 初始化脚本

| 在执行之前记得先用root用户创建一个idiom 用户，idiom数据库，并赋予权限

```sql
create user idiom identified with mysql_native_password by "idiom";

create database idiom;

grant all on idiom.* to idiom;

-- 创建用户，赋予权限
```
| 接下来执行`yarn run init`

```javascript
handleSQL(value);
handleMongo(value);
handleRedis(value);
// 去初始化当前数据库配置
```

| 可以在当前文件夹下编写sql，mongo，redis配置项，执行`yarn run init`的时候会自动解析文件，并且执行

![](../screenshots/db/mongo1.png)
![](../screenshots/db/mysql1.png)

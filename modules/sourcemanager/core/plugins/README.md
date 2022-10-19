* 插件编写
* 每一个插件都有4个生命函数
* 初次加载的时候
* 在执行之前，此时可以访问到指令对象
* 执行之后，可以访问到返回值
* 发送错误时
* 一旦插件被加载，就能够访问到core对象
* 可以在core内部封装一些指令，比方说过滤指令，对于那些特殊的指令，记录下来自动通过core来实现更新
* 或者对于指令进行再封装，使得他们的表达能力更进一步

```javascript
/**
 * @param core{核心}
 */
function idiomRMPlugin(core) {
    // your local code

    return {
        // 插件名称
        name: "plugin-name",
        core: core,

        onload() {
            // 挂载之时
            // 此时
        },
        beforeExecute(instruction) {
            // 执行之前可以获得指令实体
            // 数据发送之时, 可以略作包装
        },
        onreturn(data) {
            // 可以获得指令的返回值
            // 数据获取之时
            // 可以在此处编写代码直接提取数据流种的数据
        },
        onerror(err) {
            // 插件主动执行,
            // 此作用域可以访问core对象内部的属性与方法
            // 当失败的时候执行
        }
    }
}


```
* 插件编写


```javascript
/**
 * @param core{核心}
 */
function idiomRMPlugin(core) {
    // your local code

    return {
        // 插件名称
        name: "plugin-name",

        onCreated() {
            // 挂载之时
            // 此时
        },
        onSend(data) {
            // 数据发送之时, 可以略作包装
        },
        onFetch(data) {
            // 数据获取之时
            // 可以在此处编写代码直接提取数据流种的数据
        },
        exec(...args) {
            // 插件主动执行,
            // 此作用域可以访问core对象内部的属性与方法
        }
    }
}


```
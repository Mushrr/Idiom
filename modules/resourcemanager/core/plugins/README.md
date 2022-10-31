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
            // 执行
        },
        beforeExecute(instruction) {
            // 执行之前可以获得指令实体
            // 数据发送之时, 可以略作包装
        },
        onreturn(data) {
            // 可以获得指令的返回值
            // 数据获取之时
            // 可以在此处编写代码直接提取数据流种的数据约定
        },
        onerror(err) {
            // 插件主动执行,
            // 此作用域可以访问core对象内部的属性与方法
            // 当失败的时候执行
        }
    }
}
```

* 与插件对应的一个概念是指令
* 指令也有如上的生存周期，只是指令只会执行一次
* 并且其对象会完全注入到插件中


```javascript
// 一般来说指令就是对象
const instruction = {
    beforeExcute() {
        // 在执行之前
    }

    excute(core) {
        // 指令运行的时候
        // 此时解包可以拿到core内部的数据
    }

    onreturn() {
        // 指令返回的时候
    }

    onerror() {
        // 指令执行出错的时候
    }
}


// 也可以制作成一个函数，以实现动态指令
// 以及制作成一个SQL函数，传入数据，动态的修改SQL，然后生成instruction对象执行
function logger(level) {
    return {
        excute(core) {
            if (level === "info") {
                console.log(core);
            } else if (level === "warn") {
                console.warn(core);
            } else {
                console.error(core);
            }
        }
    }
}

```
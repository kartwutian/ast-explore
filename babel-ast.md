# babel-ast

<a name="BV4HB"></a>
## 什么是抽象语法树(`Abstract Syntax Tree ，AST`)？
百度百科是这么解释的：<br />在计算机科学中，抽象语法树（Abstract Syntax Tree，AST），或简称语法树（Syntax tree），是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。<br />听起来还是很绕，没关系，你可以简单理解为 **它就是你所写代码的的树状结构化表现形式**。<br />有了这棵树，我们就可以通过操纵这颗树，精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作。<br />AST在日常业务中也许很难涉及到，有可能你还没有听过，但其实很多时候你已经在使用它了，只是没有太多关注而已，现在流行的 `webpack`，`eslint` 等很多插件或者包都有涉及~
<a name="vyfqz"></a>
## 抽象语法树能做什么？
聊到`AST`的用途，其应用非常广泛，下面我简单罗列了一些：

- `IDE`的错误提示、代码格式化、代码高亮、代码自动补全等
- `JSLint`、`JSHint`对代码错误或风格的检查等
- `webpack`、`rollup`进行代码打包等
- `CoffeeScript`、`TypeScript`、`JSX`等转化为原生`Javascript`

其实它的用途，还不止这些，如果说你已经不满足于实现枯燥的业务功能，想写出类似`react`、`vue`这样的牛逼框架，或者想自己搞一套类似`webpack`、`rollup`这样的前端自动化打包工具，那你就必须弄懂`AST`。
<a name="S86La"></a>
## 如何生成AST？
在了解如何生成`AST`之前，有必要了解一下`Parser`（常见的`Parser`有`esprima`、`traceur`、`acorn`、`shift`等）<br />`JS Parser`其实是一个解析器，它是将`js`源码转化为抽象语法树（`AST`）的解析器。<br />整个解析过程主要分为以下两个步骤：

- 分词：将整个代码字符串分割成最小语法单元数组
- 语法分析：在分词基础上建立分析语法单元之间的关系

**什么是语法单元？**<br />语法单元是被解析语法当中具备实际意义的最小单元，简单的来理解就是自然语言中的词语。<br />举个例子来说，下面这段话：<br />**“2019年是祖国70周年”**<br />我们可以把这句话拆分成最小单元，即：2019年、是、祖国、70、周年。<br />这就是我们所说的分词，也是最小单元，因为如果我们把它再拆分出去的话，那就没有什么实际意义了。<br />`Javascript` 代码中的语法单元主要包括以下这么几种：

- 关键字：例如 `var`、`let`、`const`等
- 标识符：没有被引号括起来的连续字符，可能是一个变量，也可能是 `if`、`else` 这些关键字，又或者是 `true`、`false` 这些内置常量
- 运算符： `+`、`-`、 `*`、`/` 等
- 数字：像十六进制，十进制，八进制以及科学表达式等语法
- 字符串：因为对计算机而言，字符串的内容会参与计算或显示
- 空格：连续的空格，换行，缩进等
- 注释：行注释或块注释都是一个不可拆分的最小语法单元
- 其他：大括号、小括号、分号、冒号等

如果我们以最简单的复制语句为例的话，如下？
```
var a = 1;
```
通过分词，我们可以得到如下结果：
```
[
    {
        "type": "Keyword",
        "value": "var"
    },
    {
        "type": "Identifier",
        "value": "a"
    },
    {
        "type": "Punctuator",
        "value": "="
    },
    {
        "type": "Numeric",
        "value": "1"
    },
    {
        "type": "Punctuator",
        "value": ";"
    }
]
```
为了方便，我直接在 [esprima/parser](https://links.jianshu.com/go?to=https%3A%2F%2Fesprima.org%2Fdemo%2Fparse.html%23) 这个网站生成分词的~<br />**什么是语法分析？**<br />上面我们已经得到了我们分词的结果，需要将词汇进行一个立体的组合，确定词语之间的关系，确定词语最终的表达含义。<br />简单来说语法分析是对语句和表达式识别，确定之前的关系，这是个递归过程。<br />上面我们通过语法分析，可以得到如下结果：
```
{
    "type": "Program",
    "body": [
        {
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "a"
                    },
                    "init": {
                        "type": "Literal",
                        "value": 1,
                        "raw": "1"
                    }
                }
            ],
            "kind": "var"
        }
    ],
    "sourceType": "script"
}
```
这就是 `var a = 1` 所转换的 `AST`；<br />这里推荐一下`astexplorer AST`的可视化工具，[astexplorer](https://links.jianshu.com/go?to=https%3A%2F%2Fastexplorer.net%2F)，可以直接进行对代码进行`AST`转换~
<a name="ZyxQi"></a>
## AST 到底怎么用？
上面画了很大篇幅聊了聊`AST`是什么以及它是如何生成的，说到底，还是不知道`AST`这玩意有啥用，到底怎么使用。。<br />ok~ 接下来我们来一起见证奇迹。<br />我相信大部分同学对 `babel` 这个库不陌生，现在的做前端模块化开发过程中中一定少不了它，因为它可以帮你将 `ECMAScript 2015+` 版本的代码转换为向后兼容的 `JavaScript` 语法，以便能够运行在当前和旧版本的浏览器或其他环境中，你不用为新语法的兼容性考虑~<br />而实际上呢，`babel` 中的很多功能都是靠修改 `AST` 实现的。<br />首先，我们来看一个简单的例子，我们如何将 `es6` 中的 **`箭头函数`** 转换成 `es5` 中的 **普通函数**，即：
```
const sum=(a,b)=>a+b;
```
我们如何将上面简单的 `sum` 箭头函数转换成下面的形式：
```
const sum = function(a,b){
    return a+b;
}
```
想想看，有什么思路？<br />如果说你不了解 `AST` 的话，这无疑是一个很困难的问题，根本无从下手，如果你了解 `AST` 的话，这将是一个非常 `easy` 的例子。<br />接下来我们看看如何实现？
<a name="a0PBF"></a>
### 安装依赖
需要操作 `AST` 代码，这里，我们需要借助两个库，分别是 `@babel/core` 和 `babel-types`。<br />其中 `@babel/core` 是 `babel` 的核心库，用来实现核心转换引擎，`babel-types` 类型判断，用于生成`AST`零部件<br />`cd` 到一个你喜欢的目录，通过 `npm -y init` 初始化操作后，通过 `npm i @babel/core babel-types -D` 安装依赖
<a name="h1wap"></a>
### 目标分析
要进行转换之前，我们需要进行分析，首先我们先通过 [astexplorer](https://links.jianshu.com/go?to=https%3A%2F%2Fastexplorer.net%2F) 查看目标代码跟我们现在的代码有什么区别。<br />源代码的 `AST` 结构如下：
```
// 源代码的 AST
{
    "type": "Program",
    "start": 0,
    "end": 21,
    "body": [
        {
            "type": "VariableDeclaration",
            "start": 0,
            "end": 21,
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "start": 6,
                    "end": 20,
                    "id": {
                        "type": "Identifier",
                        "start": 6,
                        "end": 9,
                        "name": "sum"
                    },
                    "init": {
                        "type": "ArrowFunctionExpression",
                        "start": 10,
                        "end": 20,
                        "id": null,
                        "expression": true,
                        "generator": false,
                        "async": false,
                        "params": [
                            {
                                "type": "Identifier",
                                "start": 11,
                                "end": 12,
                                "name": "a"
                            },
                            {
                                "type": "Identifier",
                                "start": 13,
                                "end": 14,
                                "name": "b"
                            }
                        ],
                        "body": {
                            "type": "BinaryExpression",
                            "start": 17,
                            "end": 20,
                            "left": {
                                "type": "Identifier",
                                "start": 17,
                                "end": 18,
                                "name": "a"
                            },
                            "operator": "+",
                            "right": {
                                "type": "Identifier",
                                "start": 19,
                                "end": 20,
                                "name": "b"
                            }
                        }
                    }
                }
            ],
            "kind": "const"
        }
    ],
    "sourceType": "module"
}
```
目标代码的 `AST` 结构如下：
```
// 目标代码的 `AST`
{
    "type": "Program",
    "start": 0,
    "end": 48,
    "body": [
        {
            "type": "VariableDeclaration",
            "start": 0,
            "end": 48,
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "start": 6,
                    "end": 47,
                    "id": {
                        "type": "Identifier",
                        "start": 6,
                        "end": 9,
                        "name": "sum"
                    },
                    "init": {
                        "type": "FunctionExpression",
                        "start": 12,
                        "end": 47,
                        "id": null,
                        "expression": false,
                        "generator": false,
                        "async": false,
                        "params": [
                            {
                                "type": "Identifier",
                                "start": 22,
                                "end": 23,
                                "name": "a"
                            },
                            {
                                "type": "Identifier",
                                "start": 25,
                                "end": 26,
                                "name": "b"
                            }
                        ],
                        "body": {
                            "type": "BlockStatement",
                            "start": 28,
                            "end": 47,
                            "body": [
                                {
                                    "type": "ReturnStatement",
                                    "start": 32,
                                    "end": 45,
                                    "argument": {
                                        "type": "BinaryExpression",
                                        "start": 39,
                                        "end": 44,
                                        "left": {
                                            "type": "Identifier",
                                            "start": 39,
                                            "end": 40,
                                            "name": "a"
                                        },
                                        "operator": "+",
                                        "right": {
                                            "type": "Identifier",
                                            "start": 43,
                                            "end": 44,
                                            "name": "b"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            ],
            "kind": "const"
        }
    ],
    "sourceType": "module"
}
```
其中里面的 `start` 和 `end` 我们不用在意，其只是为了标记其所在代码的位置。<br />我们关心的是 `body` 里面的内容，通过对比，我们发现主要不同就在于 `init` 这一段，一个是 `ArrowFunctionExpression` , 另一个是 `FunctionExpression` ， 我们只需要将 `ArrowFunctionExpression` 下的内容改造成跟 `FunctionExpression` 即可。
<a name="ROxRj"></a>
### 小试牛刀
我们建一个 `arrow.js` 的文件，引入上面的两个库，即
```
//babel 核心库，用来实现核心转换引擎
const babel = require('@babel/core')
//类型判断，生成AST零部件
const types = require('babel-types')
//源代码
const code = `const sum=(a,b)=>a+b;` //目标代码 const sum = function(a,b){ return a + b }
```
这里我们需要用到 `babel` 中的 `transform` 方法，它可以将 `js` 代码转换成 `AST` ，过程中可以通过使用 `plugins` 对 `AST` 进行改造，最终生成新的 `AST` 和 `js` 代码，其整个过程用网上一个比较贴切的图就是：<br />![](//upload-images.jianshu.io/upload_images/6633377-61a94f771f7ffe37.png?imageMogr2/auto-orient/strip|imageView2/2/w/880/format/webp#align=left&display=inline&height=228&originHeight=228&originWidth=880&search=&status=done&width=880)<br />关于 `babel transform` 详细用法，这里不多做讨论，感兴趣的话可以去[官网](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.babeljs.cn%2Fdocs%2Fbabel-core)了解~<br />其主要用法如下：
```
//transform方法转换code
//babel先将代码转换成ast，然后进行遍历，最后输出code
let result = babel.transform(code,{
    plugins:[
        {
            visitor
        }
    ]
})
```
其核心在于插件 `visitor` 的实现。<br />它是一个插件对象，可以对特定类型的节点进行处理，这里我们需要处理的节点是`ArrowFunctionExpression`，它常见的配置方式有两种：<br />一种是单一处理，结构如下，其中 `path` 代表当前遍历的路径 `path.node` 代表当前变量的节点
```
let visitor = {
    ArrowFunctionExpression(path){
    
    }
}
```
另一种是用于输入和输出双向处理，结构如下，参数 `node` 表示当前遍历的节点
```
let visitor = {
     ArrowFunctionExpression : {
        enter(node){
            
        },
        leave(node){
            
        }
    }
}
```
这里我们只需要处理一次，所以采用第一种方式。<br />通过分析目标代码的 `AST`，我们发现，需要一个 `FunctionExpression` ， 这时候我们就需要用到 `babel-types` ，它的作用就是帮助我们生产这些节点<br />我们通过其 `npm` 包的[文档](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fbabel-types)查看，构建一个 `FunctionExpression` 需要的参数如下：<br />![](//upload-images.jianshu.io/upload_images/6633377-ee12c1b5feaf791e.png?imageMogr2/auto-orient/strip|imageView2/2/w/884/format/webp#align=left&display=inline&height=458&originHeight=458&originWidth=884&search=&status=done&width=884)<br />functionExpression<br />参照 `AST` 我们可以看到其 `id` 为 `null`，`params` 是原 `ArrowFunctionExpression` 中的 `params`，`body` 是一个`blockStatement`，我们也可以通过查看 `babel-types` 文档，用 `t.blockStatement(body, directives)` 来创建，依次类推，照猫画虎，最终得到的结果如下：
```
//原 params
    let params = path.node.params;
    //创建一个blockStatement
    let blockStatement = types.blockStatement([
        types.returnStatement(types.binaryExpression(
            '+',
            types.identifier('a'),
            types.identifier('b')
        ))
    ]);
    //创建一个函数
    let func = types.functionExpression(null, params, blockStatement, false, false);
```
最后通过 `path.replaceWith(func);` 将其替换即可；<br />完成代码如下：
```
//babel 核心库，用来实现核心转换引擎
const babel = require('@babel/core')
//类型判断，生成AST零部件
const types = require('babel-types')
//源代码
const code = `const sum=(a,b)=>a+b;` //目标代码 const sum = function(a,b){ return a + b }
//插件对象，可以对特定类型的节点进行处理
let visitor = {
    //代表处理 ArrowFunctionExpression 节点
    ArrowFunctionExpression(path){
        let params = path.node.params;
        //创建一个blockStatement
        let blockStatement = types.blockStatement([
            types.returnStatement(types.binaryExpression(
                '+',
                types.identifier('a'),
                types.identifier('b')
            ))
        ]);
        //创建一个函数
        let func = types.functionExpression(null, params, blockStatement, false, false);
        //替换
        path.replaceWith(func);
    }
}
//transform方法转换code
//babel先将代码转换成ast，然后进行遍历，最后输出code
let result = babel.transform(code,{
    plugins:[
        {
            visitor
        }
    ]
})
console.log(result.code);
```
执行代码，打印结果如下：<br />![](//upload-images.jianshu.io/upload_images/6633377-e01a7036c772d62d.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/396/format/webp#align=left&display=inline&height=83&originHeight=83&originWidth=396&search=&status=done&width=396)<br />result<br />至此，我们的函数转换完成，达到预期效果。<br />怎么样，有没有很神奇！！<br />其实也没那么复杂，主要是要分析其 `AST` 的结构，只要弄懂我们需要干什么，那么放手去做就是~<br />`pass`：细心的同学发现，上面的代码其实可以优化的，因为我们的 `returnStatement` 其实也是跟源代码的 `returnStatement` 是一致的，我们只需要拿来复用即可，因此上述的代码还可以改成下面这样：
```
let blockStatement = types.blockStatement([
        types.returnStatement(path.node.body)
    ]);
```
<a name="2IPT6"></a>
## 趁热打铁
上面刚刚认识了如何使用 `AST` 进行代码改造，不妨趁热打铁，再来试试下面这个问题。<br />如何将 `es6` 中的 `class` 改造成 `es5` 的 `function` 形式~<br />源代码
```
// 源代码
class Person {
  constructor(name) {
      this.name=name;
  }
  sayName() {
      return this.name;
  }
}
```
目标代码
```
// 目标代码
function Person(name) {
    this.name = name;
}
Person.prototype.getName = function () {
    return this.name;
};
```
有了上面的基础，照猫画虎即可，这里我将不在赘述，过程很重要，这里我仅粘贴核心的转换代码，以供参考。
```
ClassDeclaration (path) {
    let node = path.node; //当前节点
    let id = node.id;   //节点id
    let methods = node.body.body; // 方法数组
    let constructorFunction = null; // 构造方法
    let functions = []; // 目标方法
    
    methods.forEach(method => {
        //如果是构造方法
        if ( method.kind === 'constructor' ) {
            constructorFunction = types.functionDeclaration(id, method.params, method.body, false, false);
            functions.push(constructorFunction)
        } else {
            //普通方法
            let memberExpression = types.memberExpression(types.memberExpression(id, types.identifier('prototype'), false), method.key, false);
            let functionExpression = types.functionExpression(null, method.params, method.body, false, false);
            let assignmentExpression = types.assignmentExpression('=', memberExpression, functionExpression);
            functions.push(types.expressionStatement(assignmentExpression));
        }
    })
    //判断，replaceWithMultiple用于多重替换
    if(functions.length === 1){
        path.replaceWith(functions[0])
    }else{
        path.replaceWithMultiple(functions)
    }
}
```
<a name="mJxMZ"></a>
## 总结
日常工作中，我们大多数时候关注的只是 `js` 代码本身，而没有通过 `AST` 去重新认识和诠释自己的代码~<br />本文也只是通过对 `AST` 的一些介绍，起一个抛砖引玉的作用，让你对它 有一个初步的认识，对它不在感觉那么陌生。<br />对代码的追求和探索是无止境的~<br />如果你愿意，你可以通过它构建任何你想要的`js`代码~<br />加油！




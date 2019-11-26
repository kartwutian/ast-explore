//babel 核心库，用来实现核心转换引擎
const babel = require("@babel/core");
//类型判断，生成AST零部件
const t = require("@babel/types");
//源代码
const code = `const sum=(a,b)=>a+b;`; //目标代码 const sum = function(a,b){ return a + b }
//插件对象，可以对特定类型的节点进行处理
let visitor = {
  //代表处理 ArrowFunctionExpression 节点
  ArrowFunctionExpression(path) {
    let params = path.node.params;
    let body = path.node.body;
    //创建一个blockStatement
    let blockStatement = t.blockStatement([
      t.variableDeclaration(
        'const',
        [t.variableDeclarator({
          type: 'Identifier',
          name: 'c'
        }, body)]
      )
    ]);
    //创建一个函数
    let func = t.functionExpression(
      null,
      params,
      blockStatement,
      false,
      false
    );
    //替换
    path.replaceWith(func);
  }
};
//transform方法转换code
//babel先将代码转换成ast，然后进行遍历，最后输出code
babel.transform(
  code,
  {
    plugins: [
      {
        visitor
      }
    ]
  },
  (err, res) => {
    // console.log(res);
    console.log(res.code);
  }
);

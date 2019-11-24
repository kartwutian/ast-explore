const babylon = require('babylon')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

//源代码
const code = `const sum=(a,b)=>a+b;` //目标代码 const sum = function(a,b){ return a + b }

const ast = babylon.parse(code);

traverse(ast,{
  ArrowFunctionExpression(p){
      let node = p.node;
      node.body.operator = '-'
    }
  }
)

const res = generator(ast).code

console.log(res)


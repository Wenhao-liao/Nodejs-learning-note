



const program = require('commander')
const pkg = require('./package') // package 是保留字，不能作为变量名
const api = require('./index')
// const logger = require('./logger')

// -v 选项
program
  .version(pkg.version)

// 其他选项
program
  .option('-v, --verbose', 'output extra logs')

// 子命令
program
  .command('ls')
  .description('list all todo')
  .action(api.showAll)
program
  .command('add')
  .description('add a todo')
  .action((...args) => {
    const words = args.slice(0, args.length - 1) // 最后一个参数是一个 TJ 指定的对象
    const sentence = words.join(' ')
    console.log('add a todo',sentence)
    api.add(sentence)
  })
program
  .command('clear')
  .description('clear all todos')
  .action(api.clear)


if(process.argv.length < 3){
  // 如果直接 node ./cli.js，就 showAll
  api.showAll()
}else{
  // 解析命令行参数
  program.parse(process.argv)
}



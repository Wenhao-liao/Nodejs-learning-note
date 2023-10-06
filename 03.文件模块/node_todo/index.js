const inquirer = require('inquirer')
const logger = require('./logger')

const db = require('./db')
module.exports.add = async (taskName)=>{
    logger.debug('add')
    console.log('taskName',taskName)
    // 读取之前的任务
    let list = await db.read()
    // 往里面添加一个title任务
    list.push({taskName,done:false})
    // 存储任务到文件
    db.write({list})
}

module.exports.clear = ()=>{
    db.write({list:[]})
}

function doneMark(todo) {
    return todo.done ? '[x]' : '[_]'
}

module.exports.showAll = async ()=>{
    // 展示任务列表
    let list = await db.read()
    const choices = [
        {name: '退出', value: '-1'},
        ...(list.map((item, index) => {
            return {name: `${doneMark(item)} ${index + 1} ${item.taskName}`, value: index.toString()} // 这个傻库看到 0 会认为是不存在，要改成 '0'
        })), 
        {name: '+ 创建任务', value: '-2'}
    ]
    inquirer.prompt({
        type: 'list', name: 'index', message: '选择要操作的任务', choices
    }).then(answer1 => {
        const index = parseInt(answer1.index)
        if (index >= 0) {
          inquirer.prompt({
            type: 'list', name: 'action', message: '选择操作', choices: [
              {value: 'quit', name: '退出'},
              {value: 'markAsDone', name: '已完成'},
              {value: 'markAsUndone', name: '未完成'},
              {value: 'updateTitle', name: '改标题'},
              {value: 'remove', name: '删除'},
            ]
          }).then(answer2 => {
            switch (answer2.action) {
              case 'quit':
                process.exit(0)
                break
              case 'markAsDone':
                list[index].done = true
                db.write({list})
                break
              case 'markAsUndone':
                list[index].done = false
                db.write({list})
                break
              case 'updateTitle':
                inquirer.prompt({
                  type: 'input', name: 'taskName', message: '新名称',
                  default: list[index].taskName
                }).then(answer3 => {
                  list[index].taskName = answer3.taskName
                  db.write({list})
                })
                break
              case 'remove':
                list.splice(index, 1)
                db.write({list})
                break
            }
          })
        } else if (index === -2) {
          inquirer.prompt({
            type: 'input', name: 'taskName', message: '任务名称'
          }).then(answer => {
            const todo = {taskName: answer.taskName, done: false}
            list.push(todo)
            db.write({list})
          })
        }
      }, () => undefined)
}


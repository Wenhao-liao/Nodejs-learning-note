const os = require('os');
const homeDir = os.homedir();
const path = require('path');
const fs = require('fs');
const dbPath = path.join(homeDir,'.todo')

const db = {
    read(path = dbPath){
        return new Promise((resolve,reject)=>{
            fs.readFile(path,{flag:'a+'},(err,data)=>{
                if(err) return reject(err)
                let list 
                if(data.toString()){
                    list = JSON.parse(data.toString())
                }else{
                    list = []
                }
                resolve(list)
            })
        })

    },
    write({list,path=dbPath}){
        let string = JSON.stringify(list)
        new Promise((resolve,reject)=>{
            fs.writeFile(path,string,(err)=>{
                if(err) return reject(err)
            })
        })
   
    },

}

module.exports = db
const electron = require('electron');
const storage = require('electron-json-storage')
const fs = require('fs')
const pathTool = require('path')
const sqlite3 = require('sqlite3').verbose();




var dbFilePath = pathTool.join(electron.app.getPath('userData'),'db','file_db')

var db = new sqlite3.Database(dbFilePath);

function createTeamTable(){
    db.run("create table if not exists Team(id integer primary key autoincrement,t_id text,name text,local_path text)",(err) =>{  
        
    }); 
}

function insert(table_name,dict,callback){

    var findKeys = table_dict[table_name]

    var findDict = {}
    findKeys.forEach(function(key) {
        var value = dict[key];
        findDict[key] = value;
    }, this);

    find(table_name,findDict,(data) => {

        if(data){
            
            /// update
            update(table_name,dict,(err) => {
                callback(err)
            })

        }else{

            /// insert
            var keys = Object.keys(dict)
            var keys_str = keys.slice(',');                

            var value_str = '';
            for(var i = 0; i < keys.length; i++){
                var key = keys[i]
                var value = dict[key]
                if(keys.length - 1 == i){
                    // value_str = value_str + '\'' + value + '\''
                    value_str += `'${value}'`
                }else{
                    // value_str = value_str + '\'' + value + '\'' + ','
                    value_str += `'${value}',`
                }
            }

            var sql = 'INSERT INTO ' + table_name + ' (' + keys_str + ') ' + 'VALUES' + ' (' + value_str + ')';
            db.run(sql,(err) => {
                callback(err);
            })            
        }
    })
}

function update(table_name,dict,callback){

    var keys = Object.keys(dict);

    var valur_arr = []
    var str = ''
    for(var i = 0; i < keys.length; i++){
        var key = keys[i]
        var value = dict[key]

        if(keys.length - 1 == i){
            str = str + key + ' = ' + value
        }else{
            str = str + key + ' = ' + value + ', '
        }
    }

    var wheres = getWheres(table_name,dict)
    
    var sql = 'UPDATE ' + table_name + ' SET ' + str + ' WHERE ' + wheres
    db.run(sql,(err) => {
        callback(err)
    })
}

/// 默认根据findDataKeys去查询
function find(table_name,dict,callback){
    
    var wheres = getWheres(table_name,dict)
    var sql = 'SELECT * FROM ' + table_name + ' WHERE ' + wheres    
    db.all(sql,(err,data) => {  
        if (err){            
            console.log('FAIL to retrieve data ' + err);
            callback(null);
        } else {
            if(data.length == 0){
                callback(null);                              
            }else{
                callback(data);                                
            }
        }
    })
}

function findAll(table_name,callback){
    var sql = `SELECT * FROM ${table_name}`;
    db.all(sql,(err,data) => {
        if(err){
            console.log('FAIL to retrieve data ' + err);
            callback(null);
        }else{
            if(data.length == 0){
                callback(null);
            }else{
                callback(data);
            }
        }
    })
}

/// 根据字典里的条件去查询,支持多个条件,与find不同
function findByDict(table_name,dict,callback){

    var keys = Object.keys(dict);

    var wheres = '';
    for (var index in keys) {
        var key = keys[index];
        var value = dict[key];
        if (index == keys.length - 1) {
            wheres += `${key} = '${value}'`
        } else {
            wheres += `${key} = '${value}' and `
        }
    }

    var sql = `SELECT * FROM ${table_name} WHERE ${wheres}`
    db.all(sql, (err, data) => {
        if (err) {
            console.log('FAIL to retrieve data ' + err);
            callback(null);
        } else {
            if (data.length == 0) {
                callback(null);
            } else {
                callback(data);
            }
        }
    })
}

function remove(table_name,dict,callback){
    var wheres = getWheres(table_name,dict)    
    var sql = 'DELETE FROM ' + table_name + ' WHERE ' + wheres
    db.run(sql,(err) => {
        callback(err)
    })
}

function removeAll(table_name,callback){

    var sql = `DELETE FROM ${table_name}`
    db.run(sql,(err) => {        
        if(err){
            callback(err)
        }else{
            var resetSql = `UPDATE sqlite_sequence set seq=0 where name= ${table_name}`
            db.run(resetSql,(err) => {
                callback(err)
            })
        }
    })
}


/// 查询时候的条件语句
function getWheres(table_name,dict){

    var findKeys = table_dict[table_name]
    
    var wheres = ''    
    for (var i = 0; i < findKeys.length; i++){
        var key = findKeys[i]
        var value = dict[key]

        if(findKeys.length - 1 ==  i){
            var str = key + ' = ' + '\'' + value  + '\' '
            wheres = wheres + str
        }else{
            var str = key + ' = ' + '\'' + value  + '\' ' + 'and '
            wheres = wheres + str
        }
    }
    return wheres
}

var table_dict = {
    'Team':['t_id'],
}



export default{
    createImageFolderTable,
    createTeamTable,
    createProjectTable,

    insert,
    find,
    remove,
    update,
    removeAll,
    findAll,
    findByDict
}






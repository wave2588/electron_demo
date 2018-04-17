const electron = require('electron');
const fs = require('fs');
const pathTool = require('path');
const app = electron.app;

const sqlite3 = require('sqlite3').verbose();;
var db_name = "db"
var dbFilePath = pathTool.join(app.getPath('userData'), db_name);

var db = new sqlite3.Database(dbFilePath);

function createUserTable() {
    
    db.run("create table if not exists User(id integer primary key autoincrement,user_id text,email text,user_name text)", (err) => {
        if (err) {
            console.log('create user table error', err)
        }
    });
}

function baseInsert(table_name, dict, callback) {
   
    var findKeys = table_dict[table_name]

    var findDict = {}
    findKeys.forEach(function (key) {
        var value = dict[key];
        findDict[key] = value;
    }, this);

    baseFind(table_name, findDict, (data) => {

        if (data) {

            /// update
            baseUpdate(table_name, dict, (err) => {
                callback(err)
            })

        } else {

            /// insert
            var keys = Object.keys(dict)
            var keys_str = keys.slice(',');

            var value_keys_str = '';

            var value_dict = {}
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i]
                var value = dict[key]

                var $key = `$${key}`

                if (keys.length - 1 == i) {
                    value_keys_str += $key
                } else {
                    value_keys_str += `${$key},`
                }

                value_dict[$key] = value
            }

            var sql = `INSERT INTO ${table_name} (${keys_str}) VALUES (${value_keys_str})`
            db.run(sql, value_dict, (err) => {
                if (err) console.log('insert-->:', err, sql);
                callback(err)
            })
        }
    })
}


function baseUpdate(table_name, dict, callback) {
   
    var findKeys = table_dict[table_name];

    var wheres_arr = [];
    var value_keys_arr = [];

    var value_dict = {};

    for (var key in dict) {
        var value = dict[key];
        if (findKeys.indexOf(key) == -1) {
            value_keys_arr.push(key)
        } else {
            wheres_arr.push(key)
        }
        var $key = `$${key}`;
        value_dict[$key] = value;
    }

    var keys_str = '';
    for (var index in value_keys_arr) {
        var key = value_keys_arr[index]
        var value = dict[key]
        if (value_keys_arr.length - 1 == index) {
            keys_str += `${key} = $${key}`
        } else {
            keys_str += `${key} = $${key},`
        }
    }

    var wheres = '';
    for (var index in wheres_arr) {
        var find_key = wheres_arr[index];
        if (wheres_arr.length - 1 == index) {
            wheres += `${find_key} = $${find_key}`
        } else {
            wheres += `${find_key} = $${find_key} and `
        }
    }

    var sql = `UPDATE ${table_name} SET ${keys_str} WHERE ${wheres}`
    db.run(sql, value_dict, (err) => {
        if (err) console.log('update-->:', err, sql);
        callback(err)
    })
}

/// 默认根据findDataKeys去查询
function baseFind(table_name, dict, callback) {
    
    var findKeys = table_dict[table_name];

    var wheres = '';

    var value_dict = {};

    for (var index in findKeys) {
        var find_key = findKeys[index];
        var find_value = dict[find_key];

        var $find_key = `$${find_key}`;
        if (findKeys.length - 1 == index) {
            wheres += `${find_key} = ${$find_key}`;
        } else {
            wheres += `${find_key} = ${$find_key} and `;
        }

        value_dict[$find_key] = find_value;
    }

    var sql = `SELECT * FROM ${table_name} WHERE ${wheres}`
    db.all(sql, value_dict, (err, data) => {
        if (err) console.log('find-->:', err, sql);
        if (err || data.length == 0) {
            callback(null);
        } else {
            callback(data);
        }
    })
}

function baseFindAll(table_name, callback) {
   
    var sql = `SELECT * FROM ${table_name}`;
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

/// 根据字典里的条件去查询,支持多个条件,与find不同
function baseFindByDict(table_name, dict, callback) {
    
    var findKeys = table_dict[table_name];

    var wheres = '';

    var value_dict = {};

    var keys = Object.keys(dict);

    for (var index in keys) {
        var key = keys[index];
        var $key = `$${key}`;
        var value = dict[key];

        if (keys.length - 1 == index) {
            wheres += `${key} = ${$key}`;
        } else {
            wheres += `${key} = ${$key} and `;
        }
        value_dict[$key] = value;
    }

    var sql = `SELECT * FROM ${table_name} WHERE ${wheres}`
    db.all(sql, value_dict, (err, data) => {
        if (err) console.log('find-->:', err, sql);
        if (err || data.length == 0) {
            callback(null);
        } else {
            callback(data);
        }
    })
}

function baseRemove(table_name, dict, callback) {
    
    var findKeys = table_dict[table_name];

    var wheres = '';

    var value_dict = {};

    for (var index in findKeys) {
        var find_key = findKeys[index];
        var find_value = dict[find_key];

        var $find_key = `$${find_key}`;
        if (findKeys.length - 1 == index) {
            wheres += `${find_key} = ${$find_key}`;
        } else {
            wheres += `${find_key} = ${$find_key} and `;
        }

        value_dict[$find_key] = find_value;
    }

    var sql = `DELETE FROM ${table_name} WHERE ${wheres}`
    db.run(sql, value_dict, (err) => {
        if (err) console.log('remove-->:', err, sql);
        callback(err);
    })
}

function baseRemoveByDict(table_name, dict, callback) {
    
    var findKeys = table_dict[table_name];

    var wheres = '';

    var value_dict = {};

    var keys = Object.keys(dict);

    for (var index in keys) {
        var key = keys[index];
        var $key = `$${key}`;
        var value = dict[key];

        if (keys.length - 1 == index) {
            wheres += `${key} = ${$key}`;
        } else {
            wheres += `${key} = ${$key} and `;
        }
        value_dict[$key] = value;
    }

    var sql = `DELETE FROM ${table_name} WHERE ${wheres}`;
    db.run(sql,value_dict, (err) => {
        if (err) console.log('removeByDict-->:', err, sql);
        callback(err);
    })
}

function baseRemoveAll(table_name, callback) {
    
    var sql = `DELETE FROM ${table_name}`

    db.run(sql, (err) => {
        if (err) {
            callback(err)
        } else {
            var resetSql = `UPDATE sqlite_sequence set seq=0 where name= '${table_name}'`
            db.run(resetSql, (err) => {
                callback(err)
            })
        }
    })
}

var table_dict = {
    'User': ['user_id'],
}

export default {
    createUserTable,

    baseInsert,
    baseFind,
    baseRemove,
    baseUpdate,
    baseRemoveByDict,
    baseRemoveAll,
    baseFindAll,
    baseFindByDict
}

import dbFile from './database.js'

var table_name = 'User'

var keys = ['user_id','email','user_name']
var findDataKeys = ['user_id']

function initDB(){
    dbFile.createUserTable()
}

async function insertSync(dict){
       
    return new Promise(function(re, reject){
        dbFile.baseInsert(table_name,dict,re)
    })
}   

async function updateSync(dict){
    
    return new Promise(function(re, reject){
        dbFile.baseUpdate(table_name,dict,re)
    })
}

async function findSync(dict){      

    return new Promise(function(re, reject){
        dbFile.baseFind(table_name,dict,re)
    })
}

async function removeSync(dict){

    return new Promise(function(re, reject){
        dbFile.baseRemove(table_name,dict,re)
    })
}

async function removeByDictSync(dict){
    return new Promise(function (re, reject) {
        dbFile.baseRemoveByDict(table_name,dict,re)
    })
}

async function removeAllSync(){

    return new Promise(function(re, reject){
        dbFile.baseRemoveAll(table_name,re)
    })
}

async function findAllSync(){

    return new Promise(function(re, reject){
        dbFile.baseFindAll(table_name,re)
    })
}

async function findByDictSync(dict){

    return new Promise(function(re, reject){
        dbFile.baseFindByDict(table_name,dict,re)
    })
}



export default{
    initDB,
    insertSync,
    updateSync,
    removeSync,
    removeByDictSync,
    removeAllSync,
    findSync,   
    findByDictSync,    
    findAllSync,
}


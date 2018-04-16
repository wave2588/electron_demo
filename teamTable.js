import dbFile from './database.js'


var table_name = 'Team'

var keys = ['t_id','name','local_path']
var findDataKeys = ['t_id']

function initDB(){
    dbFile.createTeamTable()
}

async function insertSync(dict){
       
    return new Promise(function(re, reject){
        dbFile.baseInsert(table_name,dict,re)
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
    findSync,
    removeSync,
    removeAllSync,
    findAllSync,
    findByDictSync
}


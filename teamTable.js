import dbFile from './database.js'


var table_name = 'Team'

var keys = ['t_id','name','local_path']
var findDataKeys = ['t_id']

function initDB(){
    dbFile.createTeamTable()
}

async function insert(dict){
       
    return new Promise(function(re, reject){
        dbFile.insert(table_name,dict,re)
    })
}   

async function find(dict){      
    
    return new Promise(function(re, reject){
        dbFile.find(table_name,dict,re)
    })
}

async function remove(dict){

    return new Promise(function(re, reject){
        dbFile.remove(table_name,dict,re)
    })
}

async function removeAll(){

    return new Promise(function(re, reject){
        dbFile.removeAll(table_name,re)
    })
}

async function findAll(){

    return new Promise(function(re, reject){
        dbFile.findAll(table_name,re)
    })
}

async function findByDict(dict){

    return new Promise(function(re, reject){
        dbFile.findByDict(table_name,dict,re)
    })
}



export default{
    initDB,
    insert,
    find,
    remove,
    removeAll,
    findAll,
    findByDict
}


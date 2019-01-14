const mysql = require('mysql');
const moment =require('moment');

const dbConfig = {
        host: 'localhost',
        port: 33060,
        password: 'rootkerem',
        user: 'root',
        schema: 'studentsdatabasekerem',
        studentsTable:`students`
    };

    var preConnection = mysql.createConnection({
        host     : dbConfig.host,
        user     : dbConfig.user,
        password : dbConfig.password,
      });

    var connection = mysql.createConnection({
        host     : dbConfig.host,
        user     : dbConfig.user,
        password : dbConfig.password,
        database:'studentsdatabasekerem'
      });

exports.dbConfig=dbConfig;
exports.connection=connection;
exports.preConnection=preConnection;

//RETRIVE ALL STUDENTS
exports.getStudents=(cb)=>{
    connection.query(`SELECT * FROM ${dbConfig.schema}.${dbConfig.studentsTable};`,function(error,results,fields){
        cb(error,results);
    });
}

//RETRIEVE A STUDENT BY ID
exports.getStudent=(id,cb)=>{
    connection.query(`SELECT * FROM ${dbConfig.schema}.${dbConfig.studentsTable} WHERE ID='${id}';`,function(error,results,fields){
        if(results.length>0)
        {
            cb(error,results[0]);
        }
        else{
            cb(true,{});
        }
    });
}

//DELETE A STUDENT
exports.deleteStudent=(id,cb)=>{
    connection.query(`DELETE FROM ${dbConfig.schema}.${dbConfig.studentsTable} WHERE id='${id}';`,function(error,results,fields){
        cb(error);
    });
}



//todo
//create index on default create
//error messages
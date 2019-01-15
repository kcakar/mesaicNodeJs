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

const preConnection = mysql.createConnection({
    host     : dbConfig.host,
    user     : dbConfig.user,
    password : dbConfig.password,
});

const connection = mysql.createConnection({
    host     : dbConfig.host,
    user     : dbConfig.user,
    password : dbConfig.password,
    database:'studentsdatabasekerem'
});
exports.connection=connection;

const queries={
     dbExistsQuery:`CREATE DATABASE IF NOT EXISTS ${dbConfig.schema};`,
     studentsExistsQuery:`SHOW TABLES LIKE '${dbConfig.studentsTable}';`,
     studentsCreateQuery:`CREATE table ${dbConfig.studentsTable} 
                            (id varchar(36) PRIMARY KEY,
                            firstName varchar(30) NOT NULL,
                            lastName varchar(30) NOT NULL,
                            birthDate date NOT NULL,
                            hobbies varchar(500),
                            photoUrl varchar(200) NOT NULL,
                            dateCreated datetime NOT NULL)`,
    studentTable:{
        getAll:()=>`SELECT * FROM ${dbConfig.schema}.${dbConfig.studentsTable};`,
        getSingle:(id)=>`SELECT * FROM ${dbConfig.schema}.${dbConfig.studentsTable} WHERE ID='${id}';`,
        delete:(id)=>`DELETE FROM ${dbConfig.schema}.${dbConfig.studentsTable} WHERE id='${id}';`,
        add:(student)=>(`INSERT INTO ${dbConfig.schema}.${dbConfig.studentsTable} 
                           VALUES ("${student.id}", 
                                   "${student.firstName}", 
                                   "${student.lastName}", 
                                   "${moment(student.birthDate).format('YYYY-MM-DD HH:mm:ss')}",
                                   "${student.hobbies}","${student.photoUrl}",
                                   "${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}")`),
        edit:(student)=>(`UPDATE ${dbConfig.schema}.${dbConfig.studentsTable} 
                         SET firstName="${student.firstName}",
                             lastName="${student.lastName}",
                             birthDate="${moment(student.birthDate).format('YYYY-MM-DD HH:mm:ss')}",
                             hobbies="${student.hobbies}",photoUrl="${student.photoUrl}",
                             dateCreated="${moment(student.dateCreated).format('YYYY-MM-DD HH:mm:ss')}" 
                         WHERE id="${student.id}"`)
    }
}

exports.dbConfig=dbConfig;
exports.connection=connection;
exports.preConnection=preConnection;

//RETRIVE ALL STUDENTS
exports.getStudents=(cb)=>{
    connection.query(queries.studentTable.getAll(),function(error,results,fields){
        console.log(error);
        cb(error,results);
    });
}

//RETRIEVE A STUDENT BY ID
exports.getStudent=(id,cb)=>{
    connection.query(queries.studentTable.getSingle(id),function(error,results,fields){
        if(results && results.length>0)
        {
            cb(error,results[0]);
        }
        else{
            console.log(error);
            cb(true,{});
        }
    });
}

//DELETE A STUDENT
exports.deleteStudent=(id,cb)=>{
    connection.query(queries.studentTable.delete(id),function(error,results,fields){
        console.log(error);
        cb(error);
    });
}

//ADD A STUDENT
exports.addStudent=(student,cb)=>{
    try{
        connection.query(queries.studentTable.add(student), function(error,results,fields){
            console.log(error);
            cb(error);
        });
    }
    catch(ex)
    {
        cb(ex);
    }
}

//EDIT A STUDENT
exports.editStudent=(student,cb)=>{
    try{
        connection.query(queries.studentTable.edit(student), function(error,results,fields){
            console.log(error);
            cb(error);
        });
    }
    catch(ex)
    {
        console.log(ex);
        cb(ex);
    }
}

//GENERATES INSERT STATEMENT FOR MULTIPLE STUDENTS
function getInsertStatement(students){
    let sqlStatement=`INSERT INTO ${dbConfig.schema}.${dbConfig.studentsTable} VALUES `;
    students.forEach(student=>{
        sqlStatement+=`("${student.id}", "${student.firstName}", "${student.lastName}", "${moment(student.birthDate).format('YYYY-MM-DD HH:mm:ss')}","${student.hobbies}","${student.photoUrl}","${moment(student.dateCreated).format('YYYY-MM-DD HH:mm:ss')}")`;
        if(students.indexOf(student)!==students.length-1)
        {
            sqlStatement+=",";
        }
    });
    return sqlStatement;
}

//CREATE DB IF DOESNT EXIST AND FILL WITH MOCK DATA
exports.init=(mockGenerator)=>{
    preConnection.query(queries.dbExistsQuery,function(error,results){
        preConnection.end();
        if(error)
        {
            console.log(error);
        }
        else{
            connection.query(queries.studentsExistsQuery,function(error,results){
                if(results.length==0){
                    console.log("Creating students table");
                    connection.query(queries.studentsCreateQuery,function(error,results){
                        if(!error)
                        {
                            console.log("Filling students table with default data");
                            let mockData=mockGenerator(30);
                            const insertQuery=getInsertStatement(mockData);
                            connection.query(insertQuery,function(error,results){
                                console.log("Database ready!");
                                connection.end();
                            });
                        }
                    })
                }
                else{
                    connection.end();
                }
            });
        }
    });
}

//todo
//error messages
//make avatar link relative
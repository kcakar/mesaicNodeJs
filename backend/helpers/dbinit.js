const mysqlx = require('mysql');
const moment =require('moment');
const db=require('./db');

const dbCreateQuery=`
CREATE table ${db.dbConfig.studentsTable}
(id varchar(36) PRIMARY KEY,
firstName varchar(30) NOT NULL,
lastName varchar(30) NOT NULL,
birthDate date NOT NULL,
hobbies varchar(30),
photoUrl varchar(30) NOT NULL,
dateCreated datetime NOT NULL)
`;

const dbExistsQuery=`CREATE DATABASE IF NOT EXISTS ${db.dbConfig.schema};`;
const tableExistsQuery=`SHOW TABLES LIKE '${db.dbConfig.studentsTable}';`

const mock=[{"id":"e35b3093-0fcf-4436-833f-5fc9fd8f550a","firstName":"Chantel","lastName":"Laurabee","birthDate":new Date("07.23.2004"),"hobbies":"","photoUrl":"/img/default.png","dateCreated":new Date()},
{"id":"7556c681-b260-4302-bedf-3c6daa136e0f","firstName":"Mike","lastName":"Taqqu","birthDate":new Date("10.24.2004"),"hobbies":"","photoUrl":"/img/default.png","dateCreated":new Date()},
{"id":"590f9f83-6676-4b44-9225-a6490e0794b4","firstName":"Chanelle","lastName":"Majercik","birthDate":new Date("07.29.2004"),"hobbies":"","photoUrl":"/img/default.png","dateCreated":new Date()},
{"id":"f67106f8-965f-40b4-9bfe-20caa0c0c42c","firstName":"Amado","lastName":"D'amico","birthDate":new Date("04.22.2004"),"hobbies":"","photoUrl":"/img/default.png","dateCreated":new Date()},
{"id":"a5a55c84-4c9d-4797-a790-29d2fd03c682","firstName":"Shirleen","lastName":"D'amico","birthDate":new Date("02.04.2004"),"hobbies":"","photoUrl":"/img/default.png","dateCreated":new Date()},
];

function getInsertStatement(students){
    let sqlStatement=`INSERT INTO ${db.dbConfig.schema}.${db.dbConfig.studentsTable} VALUES `;
    students.forEach(student=>{
        sqlStatement+=`("${student.id}", "${student.firstName}", "${student.lastName}", "${moment(student.birthDate).format('YYYY-MM-DD HH:mm:ss')}","${student.hobbies}","${student.photoUrl}","${moment(student.dateCreated).format('YYYY-MM-DD HH:mm:ss')}")`;
        if(students.indexOf(student)!==students.length-1)
        {
            sqlStatement+=",";
        }
    });
    return sqlStatement;
}

//check if db already exists
db.preConnection.query(dbExistsQuery,function(error,results){
    db.preConnection.end();
    if(error)
    {
        console.log(error);
    }
    else{
        db.connection.query(tableExistsQuery,function(error,results){
            if(results.length==0){
                console.log("Creating students table");
                db.connection.query(dbCreateQuery,function(error,results){
                    if(!error)
                    {
                        console.log("Filling students table with default data");
                        const insertQuery=getInsertStatement(mock);
                        db.connection.query(insertQuery,function(error,results){
                            console.log("Database ready!");
                            db.connection.end();
                        });
                    }
                })
            }
            else{
                db.connection.end();
            }
        });
    }
});

//create the database if it doesnt exist and fill it with mock data.
// mysqlx.getSession(db.dbConfig)
// .then(session => {
//      session
//     .getSchema(db.dbConfig.schema)
//     .getCollection('students')
//     .existsInDatabase()
//     .then(exists=>{
//         if(!exists)
//         {
//             console.log("Collection does not exist. Creating Students collection.");
//             session.sql(dbColumns).execute().then(result=>{
//                 console.log("Filling mock data.");
//                 const sqlFillMock=getInsertStatement(mock);
//                 session.sql(sqlFillMock).execute().then(result=>{
//                     console.log("Mock data ready.");
//                     session.close();
//                 });
//             });
//         }
//         else{
//             session.close();
//         }
//     });
//   })
//   .catch(err=>{
//       console.log(err);
//   });

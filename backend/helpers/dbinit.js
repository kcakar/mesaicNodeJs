const mysqlx = require('@mysql/xdevapi');

const options = {
    host: 'localhost',
    port: 33060,
    password: 'rootkerem',
    user: 'root',
    schema: 'studentsdatabasekerem' // created by default
  };
mysqlx.getSession(options)
.then(session => {
    let exists=session
    .getSchema(options.schema)
    .getCollection('students')
    .existsInDatabase()
    .then(exists=>{
        if(!exists)
        {
            session
            .getSchema(options.schema)
            .createCollection('students')
        }
        session.close();
    });
  })
  .catch(err=>{
      console.log(err);
  });

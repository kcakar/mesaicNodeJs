# mesaicNodeJs

Hello! I have created this application using NodeJS, MySQL and ReactJS.

## Installation

Use npm install on both backend and frontend folders.

You also need to have MySQL installed.

Appearently MySQL updated its authorization mode so I had to use below command to make my connector work:

```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YOURPASSWORDHERE'
```

## Usage

You can change your connection settings on backend/helpers/db.js path.

There is an object called dbConfig as below:

```javascript
const dbConfig = {
        host: 'localhost',
        port: 33060,
        password: 'pass',
        user: 'root',
        schema: 'studentsdatabasekerem',
        studentsTable:`students`
    };

```

By default the application creates a database named 'studentsdatabasekerem', then creates a table called 'students' and finally fils it with 50 students using a mock data generator.

To make project work just use npm start command on backend and then frontend folders.

The backend works on port 3001 and frontend works on port 3000.

You can change the backend port on backend/bin/www file.


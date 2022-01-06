const mysql = require('mysql2');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({extended : false}));
app.use(express.json());

// connect the db
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'pwd',
        database:'election',
    },
    console.log('Connected to the election database')
);


// Default response for any other request (Not Found)
app.use((req, res)=> {
    res.status(404).end();
});

app.listen(PORT , () =>{
    console.log(`Server running on port ${PORT}`);
} );
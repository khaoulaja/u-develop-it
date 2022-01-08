const mysql = require('mysql2');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');
const { json } = require('body-parser');

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

//get all the candidates
app.get('/api/candidates', (req, res)=> {
    const sql = `select candidates.*, parties.name as party_name from candidates left join parties on candidates.party_id=parties.id`;

    db.query(sql, (err, rows) => {
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});
//GET a single candidate
app.get('/api/candidates/:id', (req, res)=>{
    const sql= `select candidates.*, parties.name as party_name from candidates left join parties on candidates.party_id=parties.id WHERE candidates.id=?`
    const params= [req.params.id];
    db.query(sql,params, (err, row) => {
        if (err) {
        res.status(404).json({error : err.message});
        return;
        }
        res.json({
            message : 'success',
            data : row
        });
    });
});

// Delete a candidate
app.delete('/api/candidates/:id', (req,res)=>{
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
        res.status(400).json({error : err.message});
        
        } else if(!result.affectedRows){
            res.json({message: 'candidate not found!'})
        } else {
            res.json({
                message : 'deleted',
                changes : result.affectedRows,
                id : req.params.id
            });
        }
    });

})

// Create a candidate
app.post('/api/candidates', ({body}, res)=>{
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if(errors){
        res.status(400).json({error : errors});
        return;
    }
    const sql = `INSERT INTO candidates ( first_name, last_name, industry_connected) 
                VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({message : err.message});
            return;
        }
        res.json({
            message : 'success',
            data: body
        });
    });
});

//update a candidate's party
app.put('/api/candidates/:id', (req, res)=>{
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
    res.status(400).json({ error: errors });
    return;
    }
    const sql = `update candidates set party_id=? where id =?`;
    const params = [req.body.party_id, req.params.id];
    
    db.query(sql, params, (err, result)=>{
        if (err) {
            res.status(400).json({error : err.message});
        } else if (!result.affectedRows) {
            res.json({message : 'Candidate not found!'});
        } else{
            res.json({
                message : 'success',
                data: req.body,
                changes : result.affectedRows
            });
        }
    });
});

// get all parties
app.get('/api/parties', (req, res)=>{
    const sql = `select * from parties`;
    db.query(sql, (err, rows)=>{
        if(err){
            res.status(500).json({error : err.message});
            return;
        }
        res.json({
            message: 'success',
            data : rows
        });
    });
});

// get a single party
app.get('/api/parties/:id', (req, res)=>{
    const sql = `select * from parties where id=?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row)=>{
        if (err) {
            res.status(400).json({error : err.message});
            return;
        }

        res.json({
            message: 'success',
            data : row
        });
    });

});

// delete a party
app.delete('/api/parties/:id', (req, res)=>{
    const sql = `delete from parties where id=?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result)=>{
        if(err){
            res.status(400).json({error : err.message});
        }
        // check if anything was deleted
        else if (!result.affectedRows) {
            res.json({
                message : 'Party not found!'
            });
            
        } else{
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});


// Default response for any other request (Not Found)
app.use((req, res)=> {
    res.status(404).end();
});

app.listen(PORT , () =>{
    console.log(`Server running on port ${PORT}`);
} );
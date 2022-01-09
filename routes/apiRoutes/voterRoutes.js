const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// get all voters
router.get('/voters', (req, res)=>{
    const sql = `select * from voters order by last_name`;

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

// get a single voter 
router.get('/voters/:id', (req, res)=>{
    const sql = `select * from voters where id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row)=>{
        if (err) {
            res.status(400),json({error : err.message});
            return;
        }
        res.json({
            message : 'success',
            data : row
        });
    });
});

// add a voter
router.post('/voters', ({body}, res)=>{
    // Data validation
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');
    if(errors){
        res.status(400).json({error : errors});
        return;
    }
    const sql = `insert into voters (first_name, last_name, email) values (?, ? ,?)`;
    const params = [body.first_name, body.last_name, body.email];
    db.query(sql, params, (err, result)=>{
        if(err){
            res.status(400).json({error : err.message});
            return;
        }
        res.json({
            message : 'success',
            data : body
        });
    });

});

// update email address of a voter
router.put('/voters/:id', (req, res)=>{
    const errors = inputCheck(req.body, 'email');
    if (errors) {
        res.status(400).json({error : errors});
        return;
    }

    const sql = `update voters set email = ? where id = ?`;
    const params = [req.body.email, req.params.id];
    
    db.query(sql, params, (err, result)=>{
        if (err) {
            res.status(400).json({error : err.message});
        }
        else if (!result.affectedRows) {
            res.json({message : 'Voter not found!'});
        }
        else{
            res.json({
                message : 'success',
                data : req.body,
                changes : result.affectedRows
            });
        }
    });
});

//delete a voter
router.delete('/voters/:id', (req, res)=>{
    
    const sql = `delete from voters where id = ?`;
    const params = req.params.id;

    db.query(sql, params, (err, result)=>{
        if (err) {
            res.status(400).json({error : err.message});
        } else if (!result.affectedRows) {
            res.json({message : 'Voter not found!'});
        }
        else {
            res.json({
                message : 'deleted',
                changes : result.affectedRows,
                id : params

            });
        }
    });
});


module.exports = router;
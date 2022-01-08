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

module.exports = router;
const express = require('express')
const db = require('../db')

const router = express.Router();

router.get('/', async (req, res, next) => {
    res.json({test: 'Root folder'})
});

router.get('/getUsers', async (req, res, next) => {
    //res.json({test: 'test'})
    try{
        let results = await db.getAllUsers();
        res.json(results)
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
});


//getone user
router.get('/getUser/:id', async (req, res, next) => {
    //res.json({test: 'test'})
    try{
        let results = await db.getOneUser(req.params.id);
        if(results.length === 0){
            res.status(404).send()
        }
        res.json(results)
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
});

module.exports = router
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


//get one user
router.get('/getUser/:id', async (req, res, next) => {
    
    try{
        let results = await db.getOneUser(req.params.id);
        if(results.length === 0){
            res.status(404).send({Message: 'User not found'})
        }
        res.json(results)
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
});


//add one user
router.post('/addUser', async (req, res, next) => {
  
    try{
        await db.addUser(req.body);
        res.status(201).send(req.body)
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
});


//update userinfor
router.patch('/updateUserInfo', async (req, res) => {
   
        const keys = Object.keys(req.body)
        const allowedPropertyUpdates = ['id', 'username', 'email', 'password', 'token']

        const isValidOperation = keys.every((key) => {
            return allowedPropertyUpdates.includes(key)
        })

       if(!isValidOperation){
           return res.status(400).send({error: 'Invalid data provided'})
       }

        try{
            
            //validation can be put on the request body
            console.log(req.body)
            await db.updateUser(req.body);
            res.status(200).send({Message: 'Record updated successfully'});
        
        }catch(e){
            console.log(e)
            res.status(400).send(e)
        }
})

//delete user
router.delete('/removeUserById/:id', async (req, res, next) => {
    
    try{
        let apiResponseBody = await db.deleteOneUser(req.params.id);
        if(apiResponseBody.affectedRows === 0){
           return res.status(404).send({Message: 'User not found'})
           //return res.status(204).send() ---technically this should be the right now
        }        
        res.status(200).send({Message: 'User has successfully been removed'})
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
});


module.exports = router